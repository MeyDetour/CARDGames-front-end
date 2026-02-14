import { button } from "../../components/button/button.js";
import { waitingPage } from "../../components/game/waitingPage/waitingPage.js";
import { displayError } from "../../src/controller/error.js";
import { getPlayerId } from "../../src/controller/game/dataOfPlayer.js";
import { navigateTo } from "../../src/router/router.js";
export function gamePage(params = {}) {
  let playerId = getPlayerId();
  if (!playerId) {
    navigateTo("/");
    return;
  }
   

  if (!window.gameData) {
    displayError("No game data found to display game");
    navigateTo("/games");
    return;
  }
  if (!window.socket) {
    displayError("No socket found to display game");
    navigateTo("/games");
    return;
  }
  console.log(window.gameData);

  if (gameData.data.state.value == "waitingPlayers") {
    return waitingPage(gameData,playerId);
  }

  return /*html*/ ` 
    `;
}
