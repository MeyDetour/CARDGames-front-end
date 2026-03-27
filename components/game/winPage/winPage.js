import { button } from "../../button/button.js";
import {
  getCurrentPlayer,
  getGameData,
} from "../../../src/controller/game/dataStorage.js";
export function winPage() {
  let currentPlayer = getCurrentPlayer();
  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display win page");
    return null;
  }
  if (!currentPlayer) {
    displayError("No current player found to display win page");
    return null;
  }
  if (currentPlayer.haswin.value !== true || currentPlayer.isSpectator.value == true) {
    return null;
  }


  // pas besoin de verifier que la partie soit finie
  // car certains joueuers peuvent gagner avant la fin 
  // de la partie

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

      
      <div class="winContent">
         <img src="/assets/images/spooky-victory.png" alt="Image de victoire" class="victoryImage">
       

        ${
          gameData.data.winners && gameData.data.winners.length > 1
            ? `<p>Gagnants : ${gameData.data.winners
                .map((winner) => winner.pseudo)
                .join(", ")}</p>`
            : `<p>Gagnant : ${gameData.data.winners[0].pseudo}</p>`
        }

        


        <div class="buttons">
          ${gameData.data.state.value == "endOfGame" && gameData.admin.id == currentPlayer.id  && gameData.data.players>= 2? 
            // on affiche le boutton rejouer que si la partie est vraiment finie
            // le bouton rejouer va reinitialiser la partie et donc faire revenir 
            // tous les joueurs dans la salle d'attente, c'est pour ça que je veux 
            // pas l'afficher avant que la partie soit vraiment finie
             button(null, null, null, "replay", "Rejouer", "darkBlueButton") : ""}
          
        
          ${gameData.roomInDb?.params?.globalGame?.autoriseSpectator && gameData.data.state.value != "endOfGame" ? 
            // si la partie est pas finie alors on affiche pas le bouton regarder 
            // la partie, car ça n'aurait pas de sens de regarder une partie 
            // qui est déjà finie
            button(null, null, null, "specTheGame", "Regarder la partie", "", ) : ""}
        </div>
        
        ${button(null, null, null, "navigateTo", "Revenir au menu", "linkApparence", { path: "/games" })}
       
    
      </div>

      
    </div>
    `;
}

export function reloadComposant_winPage() {
  let content = document.querySelector("#content");
  let page = winPage(); 
  if (content && page) {
    content.innerHTML = page;
  }
}
