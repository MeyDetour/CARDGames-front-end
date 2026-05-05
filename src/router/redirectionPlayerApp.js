import { homePage } from "../../pages/home/home.js";
import { gamesPage } from "../../pages/games/games.js";
import { enterLinkPage } from "../../pages/enterLink/enterLink.js";
import { loadingPage } from "../../pages/loading/loading.js";
import { gamePage } from "../../pages/game/game.js";
import { choosePseudoPage } from "../../pages/choosePseudo/choosePseudo.js";
import { gameCodeErrorPage } from "../../pages/gameCodeError/gameCodeError.js";
import { gameplayPage } from "../../pages/gameplay/gameplay.js";
import { deleteAllGameVariablesSaved } from "../../controller/game/dataStorage.js";
 
export async function getPage(route) {
  let html;
  switch (route) {
    case "/choose-link":
      html = enterLinkPage(params);
      break;
    case "/game":
      html = loadingPage(params);

  let content = document.querySelector("#content");
      content.innerHTML = html;
      setTimeout(() => {
        html = gamePage(params);
        content.innerHTML = html;
      }, 2000);
      return;
    case "/choose-pseudo":
      html = choosePseudoPage(params);
      break;
    case "/game-code-error":
      html = gameCodeErrorPage(params);
      break;
    case "/enter-link":
      html = enterLinkPage(params);
      break;
    case "/games":
      deleteAllGameVariablesSaved();
      html = await gamesPage(params);
      break;
    case "/":
      deleteAllGameVariablesSaved();
      html = homePage(params);
      break;
    case "/gameplay":
      html = ` ${gameplayPage()} 
                 <div id="widgetDiv"></div>
        `;
      console.log(html);
      break;
    default:
      html = homePage(params);
      break;
  }
  return html;
}
