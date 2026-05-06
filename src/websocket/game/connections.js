import { storeGameData,
  storeRoomId,
  initView, storeDataOfPlayer  } from "../../controller/game/dataStorage.js"; 
import { loadRoute } from "../../router/router.js";
import { players } from "../../../main.js";
import { connectSocket } from "../../connection.js";
import {reloadComposant_waitingPagePlayersBlock} from "../../../components/game/waitingPage/waitingPagePlayersBlock/waitingPagePlayersBlock.js";
import {reloadComposant_waitingPageCopyBlock} from "../../../components/game/waitingPage/waitingPageCopyBlock/waitingPageCopyBlock.js";
import { reloadComposant_StatPage } from "../../../components/game/statPage/statPage.js";
import { joinRoom } from "../../controller/game/louancher.js";
import {gameChanges} from "../../controller/game/game.js";

// ============= TEST APP =============
export function gameConnectionsListenForTestApp(socket) {
  socket.on("roomCreated", async ({ gameData, player }) => {
    console.log("RECEIVE ROOM SUCCESSFULLY CRTEATED :>>", { gameData, player });
    storeGameData(gameData);
    storeRoomId(gameData.roomId);
    players.push({ id: player.id, socket: socket, position: player.position });
    initView();
    connectSocket();
    await loadRoute({ path: "/test-config" });
  });

  socket.on("roomJoined", async ({ gameData, player }) => {
    console.log("RECEIVE ROOM JOINED :>>", { gameData, player });

    storeGameData(gameData);
    players.push({ id: player.id, socket: socket, position: player.position });

    await loadRoute({ path: "/test-config" });
  });
  socket.on("roomJoinedAsSpectator", async ({ gameData, player }) => {
    storeGameData(gameData);
    players.push({ id: player.id, socket: socket, position: player.position });
    reloadComposant_StatPage();
  });

  socket.on("playerHasLeftRoom", (gameData) => {
    storeGameData(gameData);
  });

  socket.on("playerHasJoinedRoom", (gameData) => {
    storeGameData(gameData);
  });
  socket.on("playerHasJoinedRoomAsSpectator", (gameData) => {
    storeGameData(gameData);
  });
}
// ============= Player  APP =============
export function gameConnectionsListen(socket) {
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
  socket.on("roomJoinedAsSpectator", ({ gameData, player }) => {
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
  socket.on("playerHasJoinedRoomAsSpectator", (gameData) => {
    console.log("RECEIVE PLAYER HAS JOIN ROOM AS SPECTATOR :>>", { gameData });
    storeGameData(gameData);
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
}
