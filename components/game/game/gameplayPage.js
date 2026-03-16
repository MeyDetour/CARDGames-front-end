import { button } from "../../button/button.js";
import { defaultCard } from "../../defaultCard/defaultCard.js";
import { identityContainer } from "./identityContainer/identityContainer.js";
import { originalGameData } from "../../../gameData.js";
import { statsValues } from "./statsValues/statsValues.js";
import {
  getCurrentPlayer,
  getGameData,
} from "../../../src/controller/game/dataStorage.js";
import { displayError } from "../../../src/controller/error.js";
import { messaegerieComponent } from "../../messagerie/messagerie.js";
export default function gameplayPage() {
  let currentPlayer = getCurrentPlayer();

  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display game");
    return;
  }
  let points = 45;
  let displaypoints = gameData.roomInDb.params.rendering.game.displayStatistics;
  let actions =
    currentPlayer.actions && currentPlayer.actions.value
      ? currentPlayer.actions.value
      : [];
  let handDeck =
    currentPlayer.handDeck && currentPlayer.handDeck.value
      ? currentPlayer.handDeck.value
      : [];
  let cardList = gameData.roomInDb.assets.cards;
  let gainList = gameData.roomInDb.assets.gains;
  let players = gameData.data.players.filter(
    (player) => player.id !== currentPlayer.id,
  );
  let displayOtherPlayerCount =
    gameData.roomInDb.params.rendering.game.displayCountAdversaryHandDeck;

  return /*html */ `
        <div id="gameplayPage">

            <div class="playerToolBar"  >
                    <div class="leftStat">
                        ${statsValues({ displaypoints: displaypoints, gainList: gainList }, currentPlayer)}                    
                    </div>
                    <div class="middle">
                      ${actions
                        .map((action) => {
                          let mustAppear =
                            !action.appearAtPlayerTurn ||
                            (action.appearAtPlayerTurn &&
                              gameData.data.currentPlayerPosition.value ===
                                currentPlayer.position);

                          if (!mustAppear) return "";

                          return /*html */ `
                              ${button(
                                null,
                                null,
                                null,
                                "doAction",
                                action.name,
                                "greyButton",
                                {
                                  playerId: currentPlayer.id,
                                  roomId: gameData.roomId,
                                  action: action.name,
                                  actionType: action.type || "default",
                                },
                              )}
                          `;
                        })
                        .join("")}
                    </div>
                    <div class="right">
                        <div  data-player-id="${currentPlayer.id}" class="player currentPlayer ${gameData.data.currentPlayerPosition.value == currentPlayer.position ? "currentPlayerTurn" : ""}">  
                          <div class="identityContainer ">
                              <div class="playerImageContainer">
                                  <img src="/assets/images/template-player.png" alt="avatar" />
                              </div>
                              <span>${currentPlayer.pseudo}</span>
                          </div> 
                        </div>
                    </div> 
            </div>
            <div class="handDeck">
                  ${handDeck
                    .map((cardId) => {
                      let carElt = cardList[cardId];
                      carElt.faceUp = true;
                      const suits = {
                        coeur: "hearts",
                        carreau: "diamonds",
                        treffle: "clubs",
                        pique: "spades",
                      };

                      carElt.suit = suits[carElt.addedAttributs.couleur] || "";
                      carElt.hoverable = true;
                      return defaultCard(carElt);
                    })
                    .join("")}
            </div>
            <div class="gameplayMessagerie-container">
                    ${messaegerieComponent()}
            </div>
            <div class="headerButtons">
            </div>
            ${players
              .map((player, key) => {
                return identityContainer(
                  player,
                  key + 1,
                  gameData.data.currentPlayerPosition.value === player.position,
                  players.length + 1,
                  displayOtherPlayerCount,
                  gainList,
                );
              })
              .join("")}
              

            
        </div>
    `;
}

export function reloadComposant_gameplayPage() {
  if (document.querySelector("#gameplayPage")) {
    let content = document.querySelector("#content");

    content.innerHTML = gameplayPage();
  }
}


export function reloadComposant_messagerie_gameplayPage() {
  let content = document.querySelector("#gameplayPage .gameplayMessagerie-container");
  if (content) {
    content.innerHTML = messaegerieComponent();
  }
}