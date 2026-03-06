import { navigateTo } from "../../router/router.js";

export function startGame(params) {
  console.log("=========START ROOM=======");
  console.log("roomId :>> " + params.roomId);
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

export function joinRoom(gameData) {
  console.log(gameData);
  window.gameData = gameData;
  navigateTo({
    path: "/game",
    roomId: gameData.roomId
  });
}

window.startGame = startGame;
