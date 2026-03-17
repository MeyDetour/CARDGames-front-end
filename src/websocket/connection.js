import { displayError } from "../controller/error.js";
import { gameChanges, verifyGameId } from "../controller/game/game.js";
import { joinRoom, startGame } from "../controller/game/louancher.js";
import {
  updateListOfMessages,
  addMessageNotification,
} from "../controller/game/messages.js";
import {
  cleanMessageInput,
  addNewMessageInMessagerie,
} from "../controller/game/messages.js";
import { reloadComposant_waitingPagePlayersBlock } from "../../components/game/waitingPage/waitingPagePlayersBlock/waitingPagePlayersBlock.js";
import { reloadComposant_waitingPageCopyBlock } from "../../components/game/waitingPage/waitingPageCopyBlock/waitingPageCopyBlock.js";
import {
  storeRoomId,
  storeDataOfPlayer,
  storeGameData,
} from "../controller/game/dataStorage.js";
import { displayAskPlayerWidget } from "../../components/game/game/widgetContainer/widgetContainer.js";
import { reloadComposant_gamePage } from "../../pages/game/game.js";
import { addMessageInLoadingMessage } from "../../components/game/game/messageOfLoading/messageOfLoading.js";

export let socket = null;
export async function connectSocket() {
  if (socket) return;
  socket = io("ws://localhost:8008");

  console.log("CONNECTED TO SOCKET SERVER");
  // expose on window so other legacy code can access it
  window.socket = socket;

  //===============GAME MANAGEMENT=============

  socket.on("gameStarted", ({ gameData }) => {
    console.log("RECEIVE GAME START SIGNAL");
    storeGameData(gameData);
    reloadComposant_gamePage();
  });

  //===============MESSAGERIE=============

  //when player send message and message is successfully added
  socket.on("messageAddedInMessagerie", ({ messages, message }) => {
    console.log("RECEIVE MESSAGE SUCCESSFULLY ADDED IN MESSAGERIE :>>", {
      messages,
      message,
    });
    updateListOfMessages(messages);
    cleanMessageInput(message);
    addNewMessageInMessagerie(message);
  });

  socket.on("newMessageReceived", ({ messages, message }) => {
    console.log("RECEIVE NEW MESSAGE :>> ", { messages, message });
    updateListOfMessages(messages);
    addNewMessageInMessagerie(message);
    addMessageNotification();
  });

  //===============ERROR=============

  socket.on("error", (err) => {
    console.log("RECEIVE ERROR :>>", { err });
    displayError(err);
  });

  //===============UPDATES=============

  socket.on("playerData", (currentPlayer) => {
    console.log("RECEIVE PLAYER DATA :>>", { currentPlayer });
    storeDataOfPlayer(currentPlayer);
  });

  socket.on("gameChanges", ({ gameData, currentPlayer }) => {
    console.log("RECEIVE GAME CHANGES :>>", { gameData, currentPlayer });
    gameChanges(gameData, currentPlayer);
  });

  socket.on("updateGameDataLogs", (message) => {
    addMessageInLoadingMessage(message);
  });

  //===============ROOM CONNECTION=============

  socket.on("roomCreated", ({ gameData, player }) => {
    console.log("RECEIVE ROOM SUCCESSFULLY CRTEATED :>>", { gameData, player });
    storeDataOfPlayer(player);
    storeGameData(gameData);
    storeRoomId(gameData.roomId);
    joinRoom(gameData);
  });

  socket.on("roomJoined", ({ gameData, player }) => {
    console.log("RECEIVE ROOM JOINED :>>", { gameData, player });
    storeRoomId(gameData.roomId);
    storeGameData(gameData);
    storeDataOfPlayer(player);
    joinRoom(gameData);
  });

  socket.on("playerHasLeftRoom", (gameData) => {
    console.log("RECEIVE PLAYER HAS LEFT ROOM :>> ", gameData);
    gameChanges(gameData);
    reloadComposant_waitingPagePlayersBlock();
    reloadComposant_waitingPageCopyBlock();
  });

  socket.on("playerHasJoinedRoom", (gameData) => {
    console.log("RECEIVE PLAYER HAS JOIN ROOM :>>", { gameData });

    gameChanges(gameData);
    reloadComposant_waitingPagePlayersBlock();
    reloadComposant_waitingPageCopyBlock();
  });

  socket.on(
    "isExistingRoomResult",
    ({ roomId, result, gameId, pathOnEchec }) => {
      console.log("RECEIVE IS EXISTING ROOM RESULT :>> ", {
        roomId,
        result,
        gameId,
        pathOnEchec,
      });
      verifyGameId({
        roomId: roomId,
        result: result,
        gameId: gameId,
        pathOnEchec: pathOnEchec,
      });
    },
  );

  //===============ACTIONS=============

  socket.on("askPlayer", ({ event, params, roomId }) => {
    console.log("RECEIVE ORDER TO ASK PLAYER :>> ", { event, params, roomId });
    displayAskPlayerWidget(event, params, roomId);
  });
}
