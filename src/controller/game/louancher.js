import { storeDataOfPlayer } from "./dataOfPlayer.js";

export function startGame(param) {

    console.log("=========START ROOM=======");
    console.log('gameData :>> ', gameData);
    console.log('playerId :>> ', playerId);
  if (!param.roomId) {
    console.warn("Provide room bitteschon");
  }

  let roomId = param.roomId;
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
  navigateTo("/game", { roomId:  gameData.roomId, state: "waitingPeople" });
}
 

window.startGame = startGame;