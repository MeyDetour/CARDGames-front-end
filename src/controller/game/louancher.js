import { navigateTo } from "../../router/router.js";
import { players } from "../../../main.js";

import { socket } from "../../connection.js";
import { deleteAllGameVariablesSaved } from "./dataStorage.js";
import { deleteAllGameVariablesSavedForTestApp } from "./dataStorage.js";

export function startGame(params) {
  console.log("=========START ROOM=======");

  if (socket) {
    socket.emit("startGame");
  } else {
    console.warn("Dont find socket to start game");
  }
}
export function replay(params) {
  deleteAllGameVariablesSaved();
  if (socket) {
    socket.emit("replayGame");
  } else {
    console.warn("Dont find socket to replay game");
  }
}

export function joinRoom(gameData) {
  navigateTo({
    path: "/game",
    roomId: gameData.roomId,
  });
}

window.startGame = startGame;
window.replay = replay;

export function startGameForTestApp() {
  console.log("=========START ROOM=======");
  let socket = players[0]?.socket;
  if (socket) {
    deleteAllGameVariablesSavedForTestApp();
    socket.emit("startGame");
  } else {
    console.warn("Dont find socket to start game");
  }
}
export function replayForTestApp() {
  let socket = players[0]?.socket;
  deleteAllGameVariablesSavedForTestApp();
  if (socket) {
    socket.emit("replayGame");
  } else {
    console.warn("Dont find socket to replay game");
  }
}

window.startGameForTestApp = startGameForTestApp;
window.replayForTestApp = replayForTestApp;
