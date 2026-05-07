import {
  storeGameData,
  storeRoomId,
  initView,
  setPlayerView,
  storeDataOfPlayer,
  getView,
} from "../../controller/game/dataStorage.js";
import { loadRoute } from "../../router/router.js";
import { players } from "../../../main.js";
import { connectSocket } from "../../connection.js";
import { reloadComposant_waitingPagePlayersBlock } from "../../../components/game/waitingPage/waitingPagePlayersBlock/waitingPagePlayersBlock.js";
import { reloadComposant_waitingPageCopyBlock } from "../../../components/game/waitingPage/waitingPageCopyBlock/waitingPageCopyBlock.js";
import { reloadComposant_StatPage } from "../../../components/game/statPage/statPage.js";
import { joinRoom } from "../../controller/game/louancher.js";
import { gameChanges } from "../../controller/game/game.js";
import { changeCurrentView } from "../../../components/game/statPage/topRowPlayerInformations/topRowPlayerInformations.js";

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
    console.log("ROOM JOINED AS SPECTATOR");
    storeGameData(gameData);
    players.push({ id: player.id, socket: socket, position: player.position });
    reloadComposant_StatPage();
  });

  socket.on("playerHasLeftRoom", (gameData) => {
    storeGameData(gameData);
  });

  socket.on("playerHasJoinedRoom", ({gameData, player}) => {
    console.log("PLAYER HAS JOIN ROOM");
    storeGameData(gameData); 
    changeCurrentView(player.position);
  });
  socket.on("playerHasJoinedRoomAsSpectator", ({gameData, player}) => {

    console.log("PLAYER HAS JOIN ROOM AS SPECTATOR >>");
  
    storeGameData(gameData); 
    changeCurrentView(player.position);
  });
}
// ============= Player  APP =============
export function gameConnectionsListen(socket) {
  socket.on("roomCreated", ({ gameData, player }) => {
    console.log("RECEIVE ROOM SUCCESSFULLY CRTEATED :>>", { gameData, player });
    storeDataOfPlayer(player);
    storeGameData(gameData);
    storeRoomId(gameData.roomId);
    setPlayerView(0);
    players.push(gameData.data.players[0]);
    joinRoom(gameData);
  });

  socket.on("roomJoined", ({ gameData, player }) => {
    console.log("RECEIVE ROOM JOINED :>>", { gameData, player });
    storeRoomId(gameData.roomId);
    storeGameData(gameData);
    storeDataOfPlayer(player);
    setPlayerView(player.position);
    players.push(player);
    joinRoom(gameData);
  });
  socket.on("changeSpectatorToPlayerValidation", ({ gameData, player }) => {
    console.log("RECEIVE ROOM JOINED :>>", { gameData, player });
    storeRoomId(gameData.roomId);
    storeGameData(gameData);
    storeDataOfPlayer(player);
    setPlayerView(player.position);
    players.push(player);
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

  socket.on("playerHasJoinedRoom", ({gameData, player}) => {
    console.log("RECEIVE PLAYER HAS JOIN ROOM :>>", { gameData, player });

    gameChanges(gameData);
    reloadComposant_waitingPagePlayersBlock();
    reloadComposant_waitingPageCopyBlock();
  });
  socket.on("playerHasJoinedRoomAsSpectator", ({gameData, player}) => {
    console.log("RECEIVE PLAYER HAS JOIN ROOM AS SPECTATOR :>>", { gameData, player });
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
