import { connectSocket, socket } from "../../websocket/connection.js";
import { navigateTo } from "../../router/router.js";
import { reloadComposant_gamePage } from "../../../pages/game/game.js";
import { deleteStoreDataOfPlayer } from "./dataOfPlayer.js";
export async function gameLogin(params) {
  window.gameState = "";
  if (!socket) return console.log("cannot find socket");

  // GET DATA
  let pseudo = document.querySelector("#pseudo")
    ? document.querySelector("#pseudo").value
    : null;
  window.pseudo = pseudo;
  let gameId = params.gameId;
  let roomId = params.roomId;

  try {
    let gameInDB = await fetch("http://localhost:8001/game/" + gameId);

    if (!gameInDB.ok) {
      throw new Error("error while fetch");
    }

    gameInDB = await gameInDB.json();

    // IF GAME IS SELECTED BUT NOT PSEUDO
    if ((gameId || roomId) && !pseudo && gameInDB) {
      console.log("enter pseudo to create game");
      navigateTo( {
        path:"/choose-pseudo",
        gameId: gameInDB.id,
        state: "waitingPeople",
        name: gameInDB.name,
        roomId: roomId,
      });
      return;
    }

    // IF PSEUDO AND GAME ID LETS CREATE
    if (gameId && pseudo && gameInDB && !roomId) {
      console.log("========TRY TO CREATE ROOM==========");
      (window.socket || socket).emit("createRoom", { gameInDB, pseudo });
      return;
    }

    // IF PSEUDO AND ROOM ID
    if (roomId && pseudo && gameId) {
      console.log("=============TRY TO JOIN ROOM=======");
      socket.emit("joinRoom", { roomId, pseudo });
      return;
    }

    console.log("AUTRE ");
    console.log("gameId :>> ", gameId);
    console.log("roomId :>> ", roomId);
    console.log("pseudo :>> ", pseudo);
    //join room
  } catch (err) {}
}

export function verifyGameId(params) {
  console.log("<<<<<WE GOT ROOM ID LETS VERIFY>>>>>");
  let roomId = params.roomId;
  let result = params.result;
  let gameId = params.gameId;
  let pathOnEchec = params.pathOnEchec
    ? params.pathOnEchec
    : "/";
  console.log(roomId);
  console.log(result);
    if (!result && result != null && result != undefined) {
    console.log("<<<<<ROOM ID DOESNOT EXIST>>>>>");
    deleteStoreDataOfPlayer();
    navigateTo({ path: pathOnEchec });
    return;
  }
  if (!roomId && result==undefined) {
    let roomId = document.querySelector("#roomCode")
      ? document.querySelector("#roomCode").value
      : null;
    if (!roomId) { 
      navigateTo({ path: "/" });
      return;
    }
    if (window.socket) {
      console.log("verify id for room " + roomId);
      socket.emit("isExistingRoom", { roomId });
    } else {
      console.warn("Dont find socket to  verify if room exist");
    }
    return;
  }
  if (roomId && (result == null || result == undefined)) {
    socket.emit("isExistingRoom", { roomId ,pathOnEchec });
  }

  if (result && gameId) {
    console.log("<<<<<ROOM ID EXIST>>>>>");

    gameLogin({ roomId: roomId, gameId: gameId });
  }
}

export function gameChanges(gameData) {
  window.gameData = gameData;

  console.log("new game data");
  console.log(gameData);

  if (window.gameState !== gameData.data.state) {
    reloadComposant_gamePage();
  }
}

window.verifyGameId = verifyGameId;

window.gameLogin = gameLogin;
