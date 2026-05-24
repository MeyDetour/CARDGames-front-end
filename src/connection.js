import {
  gameManagementListen,
  gameManagementListenForTestApp,
} from "./websocket/game/management.js";
import { websocketErrorListen } from "./websocket/error/error.js";
import {
  gameUpdatesListen,
  gameUpdatesListenForTestApp,
} from "./websocket/game/updates.js";
import { gameMessagerieListen } from "./websocket/game/messagerie.js";
import {
  gameConnectionsListen,
  gameConnectionsListenForTestApp,
} from "./websocket/game/connections.js";
import { gameActionsListen } from "./websocket/game/action.js";
import { env } from "../env.js";
import { getRoomId } from ".//controller/game/dataStorage.js";
import {
  getGameId,
  getToken,
  initView,
} from "./controller/game/dataStorage.js";
import { getRandomSkin } from "./controller/game/players.js";
import { players } from "../main.js";
import { apiClient } from "../src/helpers/api.js";
import { getView } from "./controller/game/dataStorage.js";
import { environnement } from "../main.js";
import { loadRoute } from "./router/router.js";


export function connectSocket(game) {
  if (environnement === "test-app") {
    connectSocketForTestApp(game);
  } else {
    connectSocketForPlayerApp();
  }
}

export let socket = null;
export async function connectSocketForPlayerApp() {
  if (socket) return;
  socket = io(env.CARD_STUDIO_WEBSOCKET_URL);

setTimeout(() => {
  if (!socket || !socket.connected) {
    console.error("Failed to connect to the server.");
    displayError("Failed to connect to the server.");
    return;
  }
  
}, 5000);
  console.log("CONNECTED TO SOCKET SERVER");
  // expose on window so other legacy code can access it
  window.socket = socket;
  //===============GAME MANAGEMENT=============
  gameManagementListen(socket);

  //===============ERROR=============

  websocketErrorListen(socket);

  //===============UPDATES=============
  gameUpdatesListen(socket);
  //===============ROOM CONNECTION=============

  gameConnectionsListen(socket);
  //===============Messages=============
  gameMessagerieListen(socket);
  //===============ACTIONS=============
  gameActionsListen(socket);
}

export async function connectSocketForTestApp(gameInDB = {}) {
  console.log("TRY TO CONNECT SOCKET IN TEST APP");

  let socket = io(env.CARD_STUDIO_WEBSOCKET_URL);
 setTimeout(() => {
  if (!socket || !socket.connected) {
    console.error("Failed to connect to the server.");
   loadRoute({ path: "/page-500" });
    return;
  }
}, 5000);
  if (players.length === 0) {
    console.log("CREATE ROOM");
    socket.emit("createRoom", {
      gameInDB,
      pseudo: "Player 1",
      skin: getRandomSkin(),
      isTest: true,
    });
  } else {
    socket.emit("joinRoom", {
      roomId: getRoomId(),
      pseudo: "Player " + (players.length + 1),
      skin: getRandomSkin(),
    });
  }
 
  //===============GAME MANAGEMENT=============
  gameManagementListenForTestApp(socket);

  //===============ERROR=============

  websocketErrorListen(socket);

  //===============UPDATES=============
  gameUpdatesListenForTestApp(socket);
  //===============ROOM CONNECTION=============

  gameConnectionsListenForTestApp(socket);
  //===============ACTIONS=============

  gameActionsListen(socket);
}

window.connectSocket = connectSocket;

export function disconnectSocket(params) {
  if (!players) {
    console.warn("No players found to disconnect.");
    return;
  }
  let player = players.find((p) => p.id === params.id);
  if (player && player.socket && player.socket.connected) {
    player.socket.disconnect();
    console.log("Socket disconnected successfully.");
    let index = players.findIndex((p) => p.id === params.id);
    players.splice(index, 1); // Remove the player from the array
    if (getView().playerView == player.position) {
      initView();
    }
  } else {
    console.warn("Socket is already disconnected or was never connected.");
  }
}
window.disconnectSocket = disconnectSocket;
