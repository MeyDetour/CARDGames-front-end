import { connectSocket } from "../websocket/connection.js";
import { homePage } from "../../pages/home/home.js";
import { gamesPage } from "../../pages/games/games.js";
import { enterLinkPage } from "../../pages/enterLink/enterLink.js";
import { choosePseudoPage } from "../../pages/choose-pseudo/choose-pseudo.js";
import { gamePage } from "../../pages/game/game.js";
import { gameCodeErrorPage } from "../../pages/gameCodeError/gameCodeError.js";
import { loadingPage } from "../../pages/loading/loading.js";
import {
  deleteRoomId,
  deleteStoreDataOfPlayer,
  getRoomId,
} from "../controller/game/dataOfPlayer.js";
import { getCurrentPlayer } from "../controller/game/dataOfPlayer.js";
import { gameData } from "../../gameData.js";
import gameplayPage from "../../components/game/game/gameplayPage.js";
import { verifyGameId } from "../controller/game/game.js";
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
    deleteStoreDataOfPlayer();
    deleteRoomId();
  }

  let roomId = getRoomId();
  if (roomId && route == "/") {
    console.log(roomId);
    verifyGameId({ roomId: roomId, result: null });
    deleteStoreDataOfPlayer();
    deleteRoomId();
    return;
  }

  switch (route) {
    case "/choose-link":
      html = enterLinkPage(params);
      break;
    case "/game":
      html = loadingPage(params);
      content.innerHTML = html;
      setTimeout(() => {
        if (window.loadingAnimation) {
          clearInterval(window.loadingAnimation);
        }
        html = gamePage(params);
        content.innerHTML = html;
      }, 2000);
      return;
    case "/choose-pseudo":
      window.pseudo = "";
      html = choosePseudoPage(params);
      break;
    case "/game-code-error":
      html = gameCodeErrorPage(params);
      break;
    case "/enter-link":
      window.pseudo = "";
      html = enterLinkPage(params);
      break;
    case "/games":
      html = await gamesPage(params);
      break;
    case "/":
      html = homePage(params);
      break;
    case "/gameplay":
      html = gameplayPage(gameData, {
        position: 1,
        pseudo: "zvml,zv",
        socketID: "FBZRkLFYoBB5onM8AAAJ",
        id: "1q6lvq",
        currentBet: {
          type: "number",
          value: 2,
        },
        attachedEventForTour: {
          type: "array",
          value: [],
        },
        gain: {
          type: "object",
          value: {
            1: {
              value: 6248,
            },
          },
        },
        handDeck: {
          type: "cardList",
          value: [29, 45],
        },
        personalHandDeck: {
          type: "cardList",
          value: [],
        },
        personalHandDiscard: {
          type: "cardList",
          value: [],
        },
        hasPlayed: {
          type: "boolean",
          value: false,
        },
        haswin: {
          type: "boolean",
          value: false,
        },
        actions: {
          type: "array",
          value: [
            {
              id: 1,
              name: "Se coucher",
              condition: null,
              appearAtPlayerTurn: true,
              withValue: [
                {
                  id: 7,
                  player: "{currentPlayer}",
                },
                {
                  id: 1,
                  inputBool: true,
                  player: "{currentPlayer}",
                },
              ],
            },
            {
              id: 2,
              name: "miser",
              type: "askPlayer",
              appearAtPlayerTurn: true,
              condition:
                "comp({currentPlayer#gain#1};isSuperiorNumber;{currentBet})",
              withValue: [
                {
                  id: 11,
                  player: "{currentPlayer}",
                },
              ],
            },
            {
              id: 4,
              name: "Check",
              appearAtPlayerTurn: true,
              condition:
                "comp({currentPlayer#currentBet};isEqualNumber;{currentBet})",
              withValue: [
                {
                  id: 1,
                  inputBool: true,
                  player: "{currentPlayer}",
                },
              ],
            },
            {
              id: 5,
              name: "Tapis",
              appearAtPlayerTurn: true,
              condition:
                "exp(comp({currentPlayer#currentBet};isInferiorOrEqual;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;0))",
              withValue: [
                {
                  id: 14,
                  type: "withValueEvent",
                  player: "{currentPlayer}",
                  inputNumber: "{currentPlayer#gain#1}",
                },
                {
                  id: 3,
                  inputNumber: "{currentPlayer#currentBet}",
                },
                {
                  id: 1,
                  inputBool: true,
                  player: "{currentPlayer}",
                },
                {
                  id: 8,
                  inputBool: true,
                },
              ],
            },
          ],
        },
        roles: {
          type: "array",
          value: [
            {
              nom: "dealer",
              attribution: "{startPlayer}",
            },
          ],
        },
      });
      break;
    default:
      html = homePage(params);
      break;
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
