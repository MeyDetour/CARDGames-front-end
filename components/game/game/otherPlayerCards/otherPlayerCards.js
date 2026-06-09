import { 
  getPlayerOfCurrentView, 
  getPreviousPlayerFromCurrentPlayerPosition,
  getNextPlayerFromCurrentPlayerPosition,

} from "../../../../src/controller/game/players.js";
import { getView, getCurrentPlayer, getGameData } from "../../../../src/controller/game/dataStorage.js";
import { displayError } from "../../../../src/controller/error.js";
import { environnement } from "../../../../main.js";
import { cardBack } from "../../../cardBack/cardBack.js";
import  { listenActionsOnDeck } from "../../../../src/controller/game/actions.js";
export function gameplay_otherPlayerCards(action, currentPlayer) {
  if (!action) {
    console.warn("No action found for other player cards");
    return "";
  }
  console.log(action);
  let gameData = getGameData();
  if (!gameData) {
    console.warn("No game data found ");
    return "";
  } 
 
  let playerToGetCard =
    action.playerToTargetWithThisAction == "previousPlayer"
      ? getPreviousPlayerFromCurrentPlayerPosition(currentPlayer.position)
      : action.playerToTargetWithThisAction == "nextPlayer"
        ? getNextPlayerFromCurrentPlayerPosition(currentPlayer.position)
        : action.playerToTargetWithThisAction == "randomPlayer"
          ? gameData.data.players[
              Math.round(Math.random() * gameData.data.players.length)
            ]
          : action.playerToTargetWithThisAction == "playerWithTheMostCardInHand"
            ? gameData.data.players.reduce((prev, current) =>
                prev.handDeck.value.length > current.handDeck.value.length
                  ? prev
                  : current,
              )
            : action.playerToTargetWithThisAction == "playerWithTheLessCardInHand"
              ? gameData.data.players.reduce((prev, current) =>
                  prev.handDeck.value.length < current.handDeck.value.length
                    ? prev
                    : current,
                )
              : null;

  if (!playerToGetCard) {
    console.warn("No player found to get other player cards");
    return "";
  }
  return /*html */ `
    <div class="gamePlayOtherPlayerCardsContainer ">
        <h2>Sélectionnez ${action.numberOfCardToSelectMax>1 ? "des cartes":"une carte"}</h2>
        <div class="cardWrapper handDeckOtherPlayer">
        ${Array.from(playerToGetCard.handDeck.value).map(card => cardBack(true,card)).join('')}
        </div>
    </div>
    `;
}

export function reloadComposant_gameplayOtherPlayerCards(content) {
  console.log("-- reload other player cards --");
 
  let currentPlayer; 
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  }
  if (environnement == "test-app") {
    currentPlayer = getPlayerOfCurrentView(); 
  }
  if (!currentPlayer) {
    displayError("No current player found to display other player cards");
    return;
  }
  console.log(currentPlayer);
  const otherPlayerCardsContainer = content.querySelector(
    ".gamePlayOtherPlayerCardsContainer",
  );
  if (otherPlayerCardsContainer) {
    otherPlayerCardsContainer.remove();
  }
   
    content.innerHTML +=
      gameplay_otherPlayerCards(
        currentPlayer.actions?.value?.find(
          (action) =>
            action.actionOnHanddOtherPlayerCards &&
            action.appearAsTheFirstAction,
        ),
        currentPlayer
      )
    
    setTimeout(() => {
      listenActionsOnDeck("handDeckOtherPlayer");
    }, 1000);
}
