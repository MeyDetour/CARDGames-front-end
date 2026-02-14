import { connectSocket, socket } from "../../websocket/connection.js";
import { navigateTo } from "../../router/router.js";
import { deleteStoreDataOfPlayer } from "./dataOfPlayer.js";
export async function gameLogin(params) {
  if (!socket) return console.log("cannot find socket");

  // GET DATA
  let pseudo = document.querySelector("#pseudo")
    ? document.querySelector("#pseudo").value
    : null;
  let gameId = params.gameId;
  let roomId = params.roomId;

  if (!gameId) {
    setError("Choisissez un jeu");
    return;
  }

  try {
    let gameInDB = await fetch("http://localhost:8001/game/" + gameId);

    if (!gameInDB.ok) {
      throw new Error("error while fetch");
    }

    gameInDB = await gameInDB.json();

    // IF GAME IS SELECTED BUT NOT PSEUDO
    if ((gameId || roomId) && !pseudo && gameInDB) {
      console.log("enter pseudo to create game");
      navigateTo("/choose-pseudo", {
        gameId: gameInDB.id,
        state: "waitingPeople",
        name: gameInDB.name,
      });
      return
    }

    // IF PSEUDO AND GAME ID LETS CREATE
    if (gameId && pseudo && gameInDB && !roomId) {
      console.log("========TRY TO CREATE ROOM==========");
      (window.socket || socket).emit("createRoom", { gameInDB, pseudo });
      return;
    }

    // IF PSEUDO AND ROOM ID
    if (roomId && pseudo && gameInDB && !gameId) {
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





export function verifyGameId(roomId, result,pathOnEchec="/game-code-error") {
  console.log("<<<<<WE GOT ROOM ID LETS VERIFY>>>>>");
     
  if (!roomId && result == null) {
    let roomId = document.querySelector("#roomCode")
      ? document.querySelector("#roomCode").value
      : null;
    if (!roomId) {
      console.warn("Provide room bitteschon");
      return;
    }
    if (window.socket) {
      console.log("verify id for room " + roomId);
      socket.emit("isExistingRoom", { roomId });
    } else {
      console.warn("Dont find socket to  verify if room exist");
    }
  }
  if (!result) {
    console.log("<<<<<ROOM ID DOESNOT EXIST>>>>>");
    deleteStoreDataOfPlayer()
    navigateTo(pathOnEchec, {});
    return;
  }
  if (result) {
     console.log("<<<<<ROOM ID EXIST>>>>>");
     
    gameLogin({ roomId: roomId });
  }
}








window.verifyGameId = verifyGameId;

window.gameLogin = gameLogin;