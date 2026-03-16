import gameplayPage from "../../components/game/game/gameplayPage.js";
import { waitingPage } from "../../components/game/waitingPage/waitingPage.js";
import { displayError } from "../../src/controller/error.js";
import {
  getCurrentPlayer,
  getGameData, 
} from "../../src/controller/game/dataStorage.js";

export function gamePage(params = {}) {
  let currentPlayer = getCurrentPlayer();
  let gameData = getGameData(); 

  if (!currentPlayer) {
    navigateTo({ path: "/" });
    return;
  }

  if (!gameData) {
    displayError("No game data found to display game");
    navigateTo({ path: "/games" });
    return;
  }
  if (!window.socket) {
    displayError("No socket found to display game");
    navigateTo({ path: "/games" });
    return;
  } 
  
  if (gameData.data.state.value == "waitingPlayers") {
    return waitingPage(gameData, currentPlayer);
  }
  if (gameData.data.state.value == "inProgress") {
    return   gameplayPage( ) 
  }
}

export function reloadComposant_gamePage() {
  let content = document.querySelector("#content");

  content.innerHTML = gamePage();
}
