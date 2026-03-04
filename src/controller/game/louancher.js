import { getPlayerId, storeDataOfPlayer } from "./dataOfPlayer.js"; 
import { navigateTo } from "../../router/router.js";

export function startGame(params) {

    console.log("=========START ROOM======="); 
    console.log("roomId :>> "+params.roomId);
    console.log('playerId :>> ', getPlayerId());
  if (!params.roomId) {
    console.warn("Provide room bitteschon");
  }

  let roomId = params.roomId;
  if (window.socket) {
    socket.emit("startGame", { roomId });
  } else {
    console.warn("Dont find socket to start game");
  }
}

export function joinRoom(gameData,playerId) {
    console.log("=========JOIN ROOM=======");
    console.log('gameData :>> ', gameData);
    console.log('playerId :>> ', playerId);
  window.gameData = gameData;
  storeDataOfPlayer( playerId,gameData.roomId);  
  navigateTo({ path: "/game", roomId:  gameData.roomId, state: "waitingPeople" });

}
 

window.startGame = startGame;