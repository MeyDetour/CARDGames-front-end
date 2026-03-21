import gameplayPage, {
  reloadComposant_gameplayPage,
} from "../../components/game/game/gameplayPage.js";
import { winPage, reloadComposant_winPage } from "../../components/game/winPage/winPage.js";
import {
  waitingPage,
  reloadComposant_waitingPage, 
} from "../../components/game/waitingPage/waitingPage.js"; 
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
    return gameplayPage();
  }
  if (gameData.data.state.value == "gameEnd") {
    return winPage();
  }
}

export function reloadComposant_gamePage() {
  let gameData = getGameData();

  if (!gameData) {
    displayError("No game data found to display game");
    navigateTo({ path: "/games" });
    return;
  }
  if (gameData.data.state.value == "waitingPlayers") {
    reloadComposant_waitingPage();
  }
  if (gameData.data.state.value == "inProgress") {
    reloadComposant_gameplayPage();
  }if (gameData.data.state.value == "endOfGame") {
    reloadComposant_winPage();
  }
}
