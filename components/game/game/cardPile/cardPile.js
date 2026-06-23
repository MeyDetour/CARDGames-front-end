import { button } from "../../../button/button.js";
import { serializeParams } from "../../../../src/helpers/serializer.js";
import {
  getGameData,
  getCurrentPlayer,
} from "../../../../src/controller/game/dataStorage.js";
import { environnement } from "../../../../main.js";
import { getPlayerOfCurrentView } from "../../../../src/controller/game/players.js";
import { cardBack } from "../../../cardBack/cardBack.js";
import { cardPlaceholder } from "../../../cardPlaceholder/cardPlaceholder.js";
import { customCard } from "../../../customCard/customCard.js";
import { defaultCard } from "../../../defaultCard/defaultCard.js";
export function gameplay_cardPile(
  cardsParams,
  actionParams,
  type,
  label,
  isVisibile = false,
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
    console.warn("Spectators cannot see card piles, returning empty string");
    return "";
  }
  if (type == "deck" && !cardsParams?.deck?.activation) {
    console.warn("Deck is not activated, returning empty string");
    return "";
  }
  if (type == "discardDeck" && !cardsParams?.discard?.activation) {
    console.warn("Discard deck is not activated, returning empty string");
    return "";
  }
  if (isVisibile) {
    return /*html */ `
   <div onclick="${actionParams && actionParams.action ? `doAction(${serializeParams(actionParams)})` : ""}" class="gameplayPile ${actionParams ? "blink" : ""} ${classname} ${environnement}" id="pile-type-${type}">
        ${!cards || cards.length === 0 ? cardPlaceholder() : 
          cards[cards.length - 1].type =="custom"
          ? customCard(cards[cards.length - 1], { hoverable: actionParams ? true : false })
          : defaultCard(cards[cards.length - 1], { hoverable: actionParams ? true : false })
        }
        ${actionParams ? /*html */ `<span class="actionLabel">${actionParams.action.name}</span>` : ""}
        ${label ? /*html */ `<span class="pileLabel">${label}</span>` : ""}
   </div>
     `;
  }

  return /*html */ `
   <div onclick="${actionParams && actionParams.action ? `doAction(${serializeParams(actionParams)})` : ""}" class="gameplayPile ${classname}  ${environnement}" id="pile-type-${type}">
  ${cardBack(actionParams ? true : false)}
  ${actionParams ? /*html */ `<span class="actionLabel">${actionParams.action.name}</span>` : ""}
   ${label ? /*html */ `<span class="pileLabel">${label}</span>` : ""}
   </div>
     `;
}

export function autoreloadComposant_gameplayCardPile(type) {
  console.log("-- autorelaod card pile "+type+" --");
  let gameData = getGameData();
  if (!gameData) {
    console.warn("No game data found to autoreload gameplay card pile");
    return;
  }

  let currentPlayer;
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  }
  if (environnement == "test-app") {
    currentPlayer = getPlayerOfCurrentView();
  }
  let playerActions = currentPlayer.actions.value;

  let actionOnDeck = playerActions.find((action) => action.actionOnDeck);

  let content = document.querySelector("#gameplayPage .table .center");
  if (!content) {
    console.warn("No content found to autoreload gameplay card pile");
    return;
  }
  let pileContainer = content.querySelector(`#pile-type-${type}`);
  if (pileContainer) {
    pileContainer.remove();
  }
  let actionOnDiscardDeck = playerActions.find(
    (action) => action.actionOnDiscardDeck,
  );
  content.innerHTML += gameplay_cardPile(
    gameData.roomInDb.params.cards,
    type == "discardDeck"
      ? actionOnDiscardDeck
        ? {
            playerId: currentPlayer.id,
            roomId: gameData.roomId,
            action: actionOnDiscardDeck ? actionOnDiscardDeck : null,
            actionType: actionOnDiscardDeck
              ? actionOnDiscardDeck.type || "default"
              : "default",
          }
        : null
      : actionOnDeck
        ? {
            playerId: currentPlayer.id,
            roomId: gameData.roomId,
            action: actionOnDeck ? actionOnDeck : null,
            actionType: actionOnDeck
              ? actionOnDeck.type || "default"
              : "default",
          }
        : null,
    type,
    type == "discardDeck" ? "Défausse" : "Pioche",
    type == "discardDeck"
      ? gameData.roomInDb.params.cards.discard.renderTheLastDiscardedCard
      : gameData.roomInDb.params?.cards?.deck?.renderTheNextDeckCard,
    type == "discardDeck"
      ? gameData.data.discardDeck.value.map((cardId) => {
          return gameData.data.cards[cardId];
        })
      : gameData.data.deck.value.map((cardId) => {
          return gameData.data.cards[cardId];
        }),
  ); 
}
