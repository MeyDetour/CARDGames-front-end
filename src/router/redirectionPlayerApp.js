import { homePage } from "../../pages/home/home.js";
import { gamesPage } from "../../pages/games/games.js";
import { enterLinkPage } from "../../pages/enterLink/enterLink.js";
import { loadingPage } from "../../pages/loading/loading.js";
import { gamePage } from "../../pages/game/game.js";
import { choosePseudoPage } from "../../pages/choosePseudo/choosePseudo.js";
import { gameCodeErrorPage } from "../../pages/gameCodeError/gameCodeError.js";
import gameplayPage from "../../components/game/game/gameplayPage.js";
import { deleteAllGameVariablesSaved } from "../controller/game/dataStorage.js";

export async function getPage(route, params) {
  let html;
  switch (route) {
    case "/choose-link":
      html = enterLinkPage();
      break;
    case "/game":
      html = loadingPage();
      console.log(html);

      let content = document.querySelector("#content");
      content.innerHTML = html;
      setTimeout(() => {
        html = gamePage();
        content.innerHTML = html;
      }, 2000);
      break;
    case "/choose-pseudo":
      html = choosePseudoPage(params);
      break;
    case "/game-code-error":
      html = gameCodeErrorPage();
      break;
    case "/enter-link":
      html = enterLinkPage();
      break;
    case "/games":
      deleteAllGameVariablesSaved();
      html = await gamesPage();
      break;
    case "/":
      deleteAllGameVariablesSaved();
      html = homePage();
      break;
    case "/gameplay":
      html = ` ${gameplayPage()} 
                 <div id="widgetDiv"></div>
        `;
      console.log(html);
      break;
    default:
      html = homePage();
      break;
  }
  return html;
}
