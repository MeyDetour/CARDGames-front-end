import { reloadComposant_gameplayPage } from "../../../components/game/game/gameplayPage.js";

/* Function to handle player actions in the game
    @param {string} playerId - The ID of the player performing the action
    @param {string} roomId - The ID of the game room
    @param {string} action - The name of action being performed
    @param {string} actionType - The type of action (e.g., "askPlayer")
*/
function doAction(params) {
    let playerId = params.playerId;
    let roomId = params.roomId;
    let action = params.action;
    let actionType = params.actionType || "default";
    
  console.log("Do Action :>> ", { playerId, roomId, action, actionType });
  //  socket.emit("doAction", { playerId, roomId, action, actionType });
}
function changeTour() {
  let gameData = window.gameData;
  if (!gameData) {
    console.warn("No game data found to change tour");
    return;
  }
  gameData.data.currentPlayerPosition.value =
    (gameData.data.currentPlayerPosition.value % gameData.data.players.length) +
    1;
  window.gameData = gameData;
  console.log("change tour");
  console.log(
    "current player position :>> ",
    gameData.data.currentPlayerPosition.value,
  ); 
  reloadComposant_gameplayPage();
}

window.doAction = doAction;
window.changeTour = changeTour;
