import "./src/connection.js";
import "./src/controller/game/game.js";
import "./src/controller/error.js";
import "./src/controller/game/actions.js";
import "./src/controller/game/louancher.js";
import "./src/helpers/copy.js";
import "./src/controller/game/spectactor.js";
import "./src/controller/game/players.js";
import { apiClient } from "../src/helpers/api.js"; 
import { getRandomSkin } from "./src/controller/game/players.js";
import { loadRoute } from "./src/router/router.js";
import {
  getGameId,
  getToken,
  setToken,
  setGameId,
  deleteToken,
  deleteGameId,
} from "./src/controller/game/dataStorage.js";
import {env } from "./env.js";


export let token = null;
export let gameId = null;
export let players = [];
export const environnement = "test-app";

localStorage.removeItem("askPlayer");
const getGame = async () => {
  try {
    let gameInDB = await apiClient("api/game/" + gameId, null, {
      token: token,
    });
    if (!gameInDB) {
      console.error("Game not found in DB for ID:", gameId);
      return;
    }
    console.log(gameInDB);
    connectSocket(gameInDB);
  } catch (e) {
    console.log(e);
    if (e.message === "UNAUTHORIZED") {
      disconnectAndReconnect();
    }
  }
};

const disconnectAndReconnect = () => {
  if (window.opener) {
    // On prévient Studio que la session est morte
    window.opener.postMessage("UNAUTHORIZED", env.CARD_STUDIO_FRONT_END_URL);
    // On ferme la fenêtre de test
    deleteToken();
    deleteGameId();
    loadRoute({ path: "/page-401" });
    //window.close();
  } else {
    // Si la fenêtre a été ouverte seule, on redirige juste
  }
};
const redirectToCardStudio = () => {
  window.location.href = env.CARD_STUDIO_FRONT_END_URL;
};
const exit = () => {
  disconnectAndReconnect();
  location.reload();
};
window.exit = exit;
window.redirectToCardStudio = redirectToCardStudio;
const handleMessage = (event) => {
  if (token || gameId) return;
  if (event.origin !== env.CARD_STUDIO_FRONT_END_URL) {
    return;
  }

  console.log("RECEIVE DATA FROM CARD STUDIO");
  token = event.data.token;
  gameId = event.data.gameId;
  console.log( token,gameId);

  if (token) {
    setToken(token);
    setGameId(gameId);
    getGame();
  } else {
    console.warn("Message reçu sans token :", event.data);
  }
  window.removeEventListener("message", handleMessage);
};
const initApp = async () => {
  // 3 - handle message from card studio with token and gameId to start the app

  // 2 - wait for message from card studio with token and gameId to start the app
  window.addEventListener("message", handleMessage); 
  // 1 - response if card studio call test app
  if (window.opener && !token && !gameId) {
    window.opener.postMessage("READY_FOR_TOKEN", env.CARD_STUDIO_FRONT_END_URL);
  }

  // 4 - if page is reloaded and token and gameId are already in localStorage, start the app
  // wait 3 seconds to receive token and gameId from card studio in case of page reload, if not received, try to get them from localStorage and start the app, if not found, stay on loading screen
  setTimeout(() => {
    if (!token && !gameId) {
      console.log("CONNECT WITH STORAGE");
      token = getToken();
      gameId = getGameId();
      getGame();
      return;
    }
  }, 3000);

  loadRoute({ path: "/" });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
