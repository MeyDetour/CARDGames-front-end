import gameplayPage from "../../components/game/game/gameplayPage.js";
import { waitingPage } from "../../components/game/waitingPage/waitingPage.js";
import { getCurrentPlayer } from "../../src/controller/game/dataOfPlayer.js";
export function gamePage(params = {}) {
  let currentPlayer = getCurrentPlayer();
 console.log("current player in game page");
 console.log(currentPlayer);

  if (!currentPlayer) {
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
  if (window.gameState === window.gameData.data.state) {
    return;
  }
  window.gameState = gameData.data.state;
  if (gameData.data.state.value == "waitingPlayers") {
    return waitingPage(window.gameData, currentPlayer);
  }
}

export function reloadComposant_gamePage() {
  let content = document.querySelector("#content");

  content.innerHTML = gamePage();
}
