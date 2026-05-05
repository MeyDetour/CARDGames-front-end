import { connectSocket } from "../connection.js";   
import { deleteAllGameVariablesSaved } from "../controller/game/dataStorage.js";
import {
  getRoomId,
  deleteRoomId,
} from "../../../src/controller/game/dataStorage.js"; 
import { verifyGameId } from "../controller/game/game.js";
import { getPage } from "./redirectionPlayerApp.js";
import { getPageForTestApp } from "./redirectionTestApp.js";
import { env } from "../../env.js";
import { environnement } from "../../../main.js";
export async function loadRoute(params = {}) {
  const route = params.path;
  if (!route) {
    console.warn("No route provided, navigating to home page");
    navigateTo({ path: "/" });
    return;
  }

  let content = document.querySelector("#content");
  let html = "";
  console.log("Navigating to:", route, params);

  // HANDLE SAVE
  // si on est deconnecter
  //  on peut refresh et revenir sur la partie
  // si on change de page on delete les data
  if (route != "/" && route != "/game") {
    deleteRoomId();
  }

  //let roomId = getRoomId();
  //if (roomId && route == "/") {
  //  verifyGameId({ roomId: roomId, result: null });
  //  deleteRoomId();
  //  return;
  //}

  if (environnement == "test-app") {
   html = getPageForTestApp(route);
  }
  if (environnement == "player-app") { 
    html = await getPage(route);
  }
  content.innerHTML = html;
}

export function navigateTo(route, params = {}) {
  loadRoute(route, params); 
}
window.navigateTo = navigateTo;
export async function router() {
  // Connecter le socket en premier
  await connectSocket();
  await loadRoute({ path: "/" });
}
