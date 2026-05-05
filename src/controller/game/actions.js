import { reloadComposant_gameplayPage } from "../../../components/game/game/gameplayPage.js";
import { players } from "../../../main.js";

/* Function to handle player actions in the game
    @param {string} playerId - The ID of the player performing the action
    @param {string} roomId - The ID of the game room
    @param {string} action - The name of action being performed
    @param {string} actionType - The type of action (e.g., "askPlayer")
*/
function doActionForTestApp(params) {
  let action = params.action;
  let actionType = params.actionType || "default";
  let id = params.playerId; 
  let socket = players.find((player) => player.id == id).socket;
  socket.emit("doActionForTestApp", { action, actionType });
}

window.doActionForTestApp = doActionForTestApp;


/* Function to handle player actions in the game
    @param {string} playerId - The ID of the player performing the action
    @param {string} roomId - The ID of the game room
    @param {string} action - The name of action being performed
    @param {string} actionType - The type of action (e.g., "askPlayer")
*/
function doAction(params) {  
    let action = params.action;
    let actionType = params.actionType || "default";
    
  console.log("Do Action :>> ", {   action, actionType });
   socket.emit("doAction", {  action, actionType });
} 

window.doAction = doAction; 
