import { displayError } from "../controller/error.js";
import { gameChanges, verifyGameId } from "../controller/game/game.js";
import { joinRoom } from "../controller/game/louancher.js";
import { updateListOfMessages } from "../controller/game/messages.js";
import {
  messageSuccessfullySend,
  addNewMessageInMessagerie,
} from "../controller/game/messages.js";
import { reloadComposant_waitingPagePlayersBlock } from "../../components/game/waitingPage/waitingPagePlayersBlock/waitingPagePlayersBlock.js";
import { reloadComposant_waitingPageCopyBlock } from "../../components/game/waitingPage/waitingPageCopyBlock/waitingPageCopyBlock.js";
import { storeRoomId , storeDataOfPlayer} from "../controller/game/dataOfPlayer.js";
export let socket = null;
export async function connectSocket() {
  if (socket) return;
  socket = io("ws://localhost:8008");

  console.log("CONNECTED TO SOCKET SERVER");
  // expose on window so other legacy code can access it
  window.socket = socket;

  socket.on("roomCreated", ({ gameData , player}) => {
    console.log("room created"); 

      storeDataOfPlayer(player);
      storeRoomId(gameData.roomId);
      console.log(player);
      joinRoom(gameData);
   
  });
   socket.on("playerData", (currentPlayer) => {
      console.log(currentPlayer);
      storeDataOfPlayer(currentPlayer);
    });
  socket.on("playerHasJoinedRoom", (gameData) => {
    console.log("<<EVENT : PLAYER JOIN GAME>>");

    gameChanges(gameData);
    reloadComposant_waitingPagePlayersBlock();
    reloadComposant_waitingPageCopyBlock(gameData);
  });
  socket.on("playerHasLeftRoom", (gameData) => {
    console.log("<<EVENT : PLAYER LEFT GAME>>");

    gameChanges(gameData);
    reloadComposant_waitingPagePlayersBlock();
    reloadComposant_waitingPageCopyBlock(gameData);
  });
  //when player send message and message is successfully added
  socket.on("messageAddedInMessagerie", ({ messages, message }) => {
    updateListOfMessages(messages);
    messageSuccessfullySend(message);
  });
  socket.on("newMessageReceived", ({ messages, message }) => {
    console.log("received new message " + JSON.stringify(message));
    updateListOfMessages(messages);
    addNewMessageInMessagerie(message);
  });
  socket.on("roomJoined", ({ gameData, player }) => {
    storeRoomId(gameData.roomId);
      storeDataOfPlayer(player);
    joinRoom(gameData);
  });
  socket.on("gameChanges", (gameData) => {
    gameChanges(gameData);
  });
  socket.on("error", (err) => {
    console.log(err);
    displayError(err);
  });

  socket.on(
    "isExistingRoomResult",
    ({ roomId, result, gameId, pathOnEchec }) => {
      verifyGameId({
        roomId: roomId,
        result: result,
        gameId: gameId,
        pathOnEchec: pathOnEchec,
      });
    },
  );

  socket.on("gameChanges", (room) => {
    console.log(room);
  });
  socket.on("message", (message) => {
    // messages may be handled elsewhere; keep compatibility
    if (window.messages && Array.isArray(window.messages))
      window.messages.push(message);
  });

  socket.on("askPlayer", ({ event, params, roomId }) => {
    // placeholder for compatibility
  });
}
