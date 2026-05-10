import { button } from "../../../button/button.js";
import { serializeParams } from "../../../../src/helpers/serializer.js";
import {
  getGameData,
  getCurrentPlayer,
} from "../../../../src/controller/game/dataStorage.js";
import { environnement } from "../../../../main.js";
import { getPlayerOfCurrentView } from "../../../../src/controller/game/players.js";
import { cardPlaceholder } from "../../../cardPlaceholder/cardPlaceholder.js";
import { customCard } from "../../../customCard/customCard.js";
export function gameplay_cardPile(
  cardsParams,
  actionParams,
  type,
  label,
  isVisibile=false,
  cards,
  classname = "",
) { 
  let gameData = getGameData();

  let currentPlayer;
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  }
  if (environnement == "test-app") {
    currentPlayer = getPlayerOfCurrentView();
  }
  if (
    gameData.data.spectators.some(
      (spectator) => spectator.id == currentPlayer.id,
    )
  ) {
    return "";
  }
  if (type == "deck" && !cardsParams?.deck?.activation) {
    return "";
  }
  if (type == "discardDeck" && !cardsParams?.discard?.activation) {
    return "";
  }
  if (isVisibile) {
     
    return /*html */ `
   <div onclick="${actionParams && actionParams.action ?  `doAction(${serializeParams(actionParams)})` : ""}" class="gameplayPile ${actionParams ? "blink" : ""} ${classname} ${environnement}" id="pile-type-${type}">
        ${!cards || cards.length === 0 ? cardPlaceholder() : customCard(cards[0])}
        ${actionParams ? /*html */ `<span class="actionLabel">${actionParams.action}</span>` : ""}
        ${label ? /*html */ `<span class="pileLabel">${label}</span>` : ""}
   </div>
     `;
  }


  return /*html */ `
   <div onclick="${actionParams && actionParams.action ? `doAction(${serializeParams(actionParams)})` : ""}" class="gameplayPile ${classname} ${actionParams ? "blink" : ""} ${environnement}" id="pile-type-${type}">
   <img src="/assets/images/cardBack.png">
  ${actionParams ? /*html */ `<span class="actionLabel">${actionParams.action}</span>` : ""}
   ${label ? /*html */ `<span class="pileLabel">${label}</span>` : ""}
   </div>
     `;
}

export function reloadComposant_gameplayCardPile(
  content,
  cardsParams,
  actionParams,
  type,
  label,
  isVisibile,
  cards,
  classname = "",
) {
  let pileContainer = content.querySelector(`#pile-type-${type}`);
  if (pileContainer) {
    pileContainer.remove();
  }
  content.innerHTML += gameplay_cardPile(
    cardsParams,
    actionParams,
    type,
    label,
    isVisibile,
    cards,
    classname,
  );
}
