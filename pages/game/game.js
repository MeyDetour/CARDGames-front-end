 
import { defaultCard } from "../../components/defaultCard/defaultCard.js"; 
import { getPlayerId } from "../../src/controller/game/dataOfPlayer.js"; 
export function gamePage(params = {}) {
  let playerId = getPlayerId();
/*
  if (!playerId) {
    navigateTo({ path: "/" });
    return;
  }

  if (!window.gameData) {
    displayError("No game data found to display game");
    navigateTo({ path: "/games" });
    return;
  }
  if (!window.socket) {
    displayError("No socket found to display game");
    navigateTo({ path: "/games" });
    return;
  }
  console.log(window.gameData);
  if (window.gameState === gameData.data.state) {
    return;
  }
  window.gameState == gameData.data.state;
  if (gameData.data.state.value == "waitingPlayers") {
    return waitingPage(gameData, playerId);
  }
*/
  const playerHand = [
    { id: "1", suit: "hearts", value: "9", faceUp: true },
    { id: "2", suit: "hearts", value: "K", faceUp: true },
    { id: "3", suit: "clubs", value: "10", faceUp: true },
    { id: "4", suit: "spades", value: "A", faceUp: true },
    { id: "5", suit: "diamonds", value: "Q", faceUp: true },
    { id: "6", suit: "diamonds", value: "J", faceUp: true },
  ];

 

  return /*html*/ ` 
      ${defaultCard(playerHand[0])}
      ${defaultCard(playerHand[1])}
      ${defaultCard(playerHand[3])}
      ${defaultCard(playerHand[4])}
    `;
}

export function reloadComposant_gamePage() {
  let content = document.querySelector("#content");

  content.innerHTML = gamePage();
}
