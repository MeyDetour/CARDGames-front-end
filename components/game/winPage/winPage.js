import { button } from "../../button/button.js";
import {
  getCurrentPlayer,
  getGameData,
} from "../../../src/controller/game/dataStorage.js";
import { getPlayerOfCurrentView } from "../../../src/controller/game/players.js";
import { environnement } from "../../../main.js";
import { displayError } from "../../../src/controller/error.js";
export function winPage() {
  let currentPlayer;
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  }
  if (environnement == "test-app") {
    currentPlayer = getPlayerOfCurrentView();
  }
  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display win page");
    return "";
  }
  if (!currentPlayer) {
    displayError("No current player found to display win page");
    return "";
  }
  
  
  if (gameData.data.winners.value.length == 0) {
    console.warn("No winners found in game data, not displaying win page");
    return "";
  }
  if (
    !gameData.data?.winners?.value?.some(
      (winner) => winner.id == currentPlayer.id,
    )
  ) {
    console.log(currentPlayer);
    console.warn("Current player is not in the winners list, not displaying win page");
    return "";
  }

  // pas besoin de verifier que la partie soit finie
  // car certains joueuers peuvent gagner avant la fin
  // de la partie 
  const winnersList = gameData.data.winners.value;
  let particlesHTML = "";
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 100 + "vw";
    const y = Math.random() * 100 + "vh";
    const bg = `hsl(${Math.random() * 360}, 100%, 65%)`;
    const duration = 1 + Math.random() + "s";
    const delay = "-" + Math.random() * 2 + "s"; // Délai aléatoire pour désynchroniser

    particlesHTML += `<div class="particle" style="--x: ${x}; --y: ${y}; --bg: ${bg}; --t: ${duration}; --d: ${delay};"></div>`;
  }

  return /*html*/ ` 
    <div class="winPage">
    
       <div  class="particles-container">
      ${particlesHTML}
      </div>
      <img src="/assets/images/victory.png" alt="Victory" class="victory-image">
      ${winnersList && winnersList[0] ? `<img class="firstPlayerOnPodium" src="/assets/images/spooky-skins/${winnersList[0]?.skin.name}.png" alt="Victory" class="victory-image">` : ""}
      ${winnersList && winnersList[1] ? `<img class="secondPlayerOnPodium" src="/assets/images/spooky-skins/${winnersList[1]?.skin.name}.png" alt="Victory" class="victory-image">` : ""}
      ${winnersList && winnersList[2] ? `<img class="thirdPlayerOnPodium" src="/assets/images/spooky-skins/${winnersList[2]?.skin.name}.png" alt="Victory" class="victory-image">` : ""}
      <div class="buttonContainers">
          


        <div class="buttons">
         
          ${ false&&
            gameData.data.state.value == "endOfGame" &&
            gameData.admin.id == currentPlayer.id &&
            gameData.data.players.length >= 2
              ? // on affiche le boutton rejouer que si la partie est vraiment finie
                // le bouton rejouer va reinitialiser la partie et donc faire revenir
                // tous les joueurs dans la salle d'attente, c'est pour ça que je veux
                // pas l'afficher avant que la partie soit vraiment finie
                button(null, null, null, "replay", "Rejouer", "darkBlueButton")
              : ""
          } 
          
        
          ${
            gameData.roomInDb?.params?.globalGame?.autoriseSpectator &&
            gameData.data.state.value != "endOfGame"
              ? // si la partie est pas finie alors on affiche pas le bouton regarder
                // la partie, car ça n'aurait pas de sens de regarder une partie
                // qui est déjà finie
                button(
                  null,
                  null,
                  null,
                  "specTheGame",
                  "Regarder la partie",
                  "",
                )
              : ""
          }
        </div>
        
        ${button(null, null, null, "navigateTo", "Revenir au menu", "linkApparence", { path: "/games" })}
       
    
      </div>

      
    </div>
    `;
}

export function reloadComposant_winPage() {
  console.log("-- reload win page --");
  let content = document.querySelector("#gameplayPage");
  
  let page = winPage();
  if (content && page) {
      if (document.querySelector(".winPage")) {
    document.querySelector(".winPage").remove();
    
  }  if (document.querySelector(".loosePage")) {
    document.querySelector(".loosePage").remove();
    
  } 
    content.innerHTML = page;
    console.log("WIN PAGE LOADED");
  }
}
