import { navigateTo } from "../../router/router.js";
import { socket } from "../../websocket/connection.js";
import { deleteAllGameVariablesSaved } from "./dataStorage.js";
export function startGame(params) {
  console.log("=========START ROOM======="); 
  if (!params.roomId) {
    console.warn("Provide room bitteschon");
  }

  let roomId = params.roomId;
  if (socket) {
    socket.emit("startGame", { roomId });
  } else {
    console.warn("Dont find socket to start game");
  }
}
export function replay(params){
  
  deleteAllGameVariablesSaved()
  if (socket){
    socket.emit("replayGame");
  } else {
    console.warn("Dont find socket to replay game");
  }
}

export function joinRoom(gameData) { 
  navigateTo({
    path: "/game",
    roomId: gameData.roomId
  });
}

window.startGame = startGame;
window.replay = replay;