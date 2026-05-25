import {
  getView,
  storeView,
  setPlayerView,
} from "../../../../src/controller/game/dataStorage.js";
import { getGameData } from "../../../../src/controller/game/dataStorage.js";
import {
  getPlayerOfCurrentView,
  getSocketOfPlayerOfCurrentView,
} from "../../../../src/controller/game/players.js";
import { getPlayerStat } from "../../../../src/controller/game/players.js";
import { reloadComposant_gameplayPage } from "../../game/gameplayPage.js";
import { button } from "../../../button/button.js";
import { reloadComposant_winPage } from "../../winPage/winPage.js";
import { reloadComposant_loosePage } from "../../loosePage/loosePage.js";
import { displayError } from "../../../../src/controller/error.js";
import {autoreloadComposant_gameplayCardPile} from "../../game/cardPile/cardPile.js";
import { reloadComposant_gameplay_statEventsDemonsWithValueSection} from "../eventsDemonsWithValueSection/section.js";

export default function topRowPlayerInformations() {
  let view = getView();
  let gameData = getGameData();
  let currentPlayer = getPlayerOfCurrentView();
  let playersStat2 = getPlayerStat(currentPlayer, gameData);
  let playerStat1 = playersStat2.splice(Math.round(playersStat2.length / 2));
  if (!currentPlayer) {
    displayError("No current player found to display game");
    return "";
  }
  return /*html*/ `     
                <div class="boxContainer">
                      <div class="titleContainer">
                          <img>
                          <h5>
                              Point de vue <kbd>Tab</kbd>
                          </h5> 
                      </div>
                          <select name="pointOfView" id="pointOfView"" onchange="changePlayerView(event)">
                          ${gameData.data.players
                            .map(
                              (player) => /*html*/ `
                            <option ${player.position === parseInt(view.playerView) ? "selected" : ""} value="${player.position}">${player.pseudo}</option>
                          `,
                            )
                            .join("")} 
                             ${gameData.data.spectators
                               .map(
                                 (player) => /*html*/ `
                            <option ${player.position === parseInt(view.playerView) ? "selected" : ""} value="${player.position}">${player.pseudo} (Spectateur)</option>
                          `,
                               )
                               .join("")} 
                        </select>
                </div>
    
                <div class="boxContainer actionSection">
                    <div class="titleContainer">
                            <img>
                            <h4>
                                Actions pour ${currentPlayer.pseudo}
                            
                            </h4> 
                    </div>
                        <div class="actionWrapper">
                          ${currentPlayer.actions.value
                            .map((elt) => {
                              const actionData = JSON.stringify({
                                action: elt.name,
                                actionType: elt.type || "default",
                                playerId: currentPlayer.id,
                              }).replace(/"/g, "&quot;");
                              return /*html*/ `<button onclick="doAction(${actionData})">${elt.name}</button>`;
                            })
                            .join("")} 
                        </div> 
                </div>  
    `;
}

export function changeCurrentView(eOrValue) {
  const position = eOrValue?.target ? eOrValue.target.value : eOrValue;
  console.log("change to current position :"+eOrValue);
  setPlayerView(position);
  reload_topRowPlayerInformations();
  reloadComposant_gameplay_statEventsDemonsWithValueSection(getGameData(), getView());
  reloadComposant_gameplayPage();
  autoreloadComposant_gameplayCardPile("deck");
  autoreloadComposant_gameplayCardPile("discardDeck");
  reloadComposant_winPage();
  reloadComposant_loosePage();
}
window.changePlayerView = changeCurrentView;

// ============ RELOAD =============
export function reload_topRowPlayerInformations() {
  console.log("-- reload top row player informations --");
  let content = document.querySelector(".statGamePage .right .topRow");
  if (content) {
    content.innerHTML = topRowPlayerInformations();
    if (localStorage.getItem("askPlayer")) {
      displayAskPlayerWidget(
        JSON.parse(localStorage.getItem("askPlayer")).event,
        JSON.parse(localStorage.getItem("askPlayer")).params,
      );
    }
  }
}

// ============ASK PLAYER WIDGET =============
export function displayAskPlayerWidget(event, params) {
  localStorage.setItem("askPlayer", JSON.stringify({ event, params }));

  let content = document.querySelector(
    ".statGamePage .right .topRow .actionWrapper",
  );
  //submit the response
  window.sendAskPlayerValue = function () {
    localStorage.removeItem("askPlayer");
    const obj = { insertedValue: getValueOfAskPlayerWidget() };
    let socket = getSocketOfPlayerOfCurrentView();

    if (
      socket &&
      obj &&
      obj.insertedValue != null &&
      obj.insertedValue != undefined
    ) {
      console.log({ event, obj, params });
      socket.emit("playerInsertedValue", { event, obj, params });
      hideAskPlayerWidget();
    } else {
      console.warn("Dont find socket to send value of widget");
    }
  };

  if (content) {
    let type = event.event.requiresInput.type;
    content.innerHTML += `
    <div class="widgetAskPlayer"> 
                <span>${event.event.requiresInput.label}</span>
                ${
                  event.event.requiresInput.description
                    ? `<p>${event.event.requiresInput.description}</p>`
                    : ""
                }
                <div class="input-container"> 
                  <input id="widgetInput" type="${type}" ${type === "number" ? `min="${parseInt(event.event.requiresInput.min) || 0}" max="${parseInt(event.event.requiresInput.max) || 100}"` : ""} placeholder="${type === "number" ? "Enter a number" : "Enter text"}">
                </div>
                <div class="buttonsContainer">
                  ${button(null, null, null, "sendAskPlayerValue", "Valider", "greenButton", {})}
                  ${button(null, null, null, "hideAskPlayerWidget", "Annuler", "redButton", {})}
                </div>
           
      </div>`;
  }
}
// hide widget without any action
export function hideAskPlayerWidget() {
  localStorage.removeItem("askPlayer");
  let widget = document.querySelector(
    ".statGamePage .right .topRow .actionWrapper .widgetAskPlayer",
  );
  if (widget) {
    widget.remove();
  }
}
window.hideAskPlayerWidget = hideAskPlayerWidget;

// get the value inside of the widget
function getValueOfAskPlayerWidget() {
  let input = document.querySelector(
    ".statGamePage .right .topRow .actionWrapper .widgetAskPlayer #widgetInput",
  );
  if (input && input.value != "") {
    return input.value;
  }
  return null;
}
