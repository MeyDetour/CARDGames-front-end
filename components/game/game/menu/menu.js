import { button } from "../../../button/button.js";
import {
  storeCardSort,
  getCardSort,
} from "../../../../src/controller/game/dataStorage.js";
import { autoReloadComposant_gameplayHanddeck } from "../handdeck/handdeck.js";
import { hideGamePlayMessagerie } from "../gameplayPage.js";

export function gameplay_menu(players, currentPlayer) {
  let sort = getCardSort();
  return /*html*/ `
    <div class="menu">
      <div class="headOfMenu">
        <h2>Menu</h2>
        <img class="closeMenuButton" src="/assets/close-white.svg" onclick="toggleGameplayMenu()"/>
      </div>
      <hr>
      <div class="paramsSection">
        <h3>AUDIO</h3>
        <div class="innerParamsSection">
            <h4>Musique</h4>
            <input type="range" min="0" max="100" value="50" class="slider" id="musicVolumeSlider"/>
            <h4>Sons</h4>
            <input type="range" min="0" max="100" value="50" class="slider" id="sfxVolumeSlider"/>
        </div>
      </div>

      <div class="paramsSection">
          <h3>Avis</h3>
          ${button(null, null, null, "displayLetCommentWidget", "Laisser un commentaire", "linkApparence")}
     
          </div>
      <div class="paramsSection">
          <h3>Paramètres de jeu</h3>
             <div class="innerParamsSection">
          <h4>Tri des cartes</h4>
            <select name="cardSort" id="card-sort" onchange="changeCardSort(event)">
              <option ${sort === "value" ? "selected" : ""} value="value">Par valeur</option>
              <option ${sort === "color" ? "selected" : ""} value="color">Par couleur</option> 
            </select>
        </div>
           
      </div>
    
      <hr> 
      ${button(null, null, "/", null, "Retourner au menu", "exitButton")}
 
    </div>
    `;
}
export function changeCardSort(e) {
  const sortValue = e.target.value;
  storeCardSort(sortValue);

  autoReloadComposant_gameplayHanddeck();
  toggleGameplayMenu();
  reloadSortSeleciton();
}
function reloadSortSeleciton() {
  let sort = getCardSort();
  let selectElement = document.getElementById("card-sort");
  if (selectElement) {
    selectElement.value = sort;
  }
}
window.changeCardSort = changeCardSort;
export function hideGameplayMenu() {
  let menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    if (menuContainer.style.display === "flex") {
      menuContainer.classList.add("close");
      setTimeout(() => {
        menuContainer.style.display = "none";
        menuContainer.classList.remove("close");
      }, 1000);
    }
  }
}

export function toggleGameplayMenu() {
  const allRanges = document.querySelectorAll('input[type="range"]');

  allRanges.forEach((range) => {
    range.addEventListener("input", (e) => {
      const min = e.target.min || 0;
      const max = e.target.max || 100;
      const val = e.target.value;

      // Calcul du pourcentage pour le dégradé de fond
      const percentage = ((val - min) * 100) / (max - min);
      e.target.style.setProperty("--progress", `${percentage}%`);
    });

    // Initialisation au chargement
    const percentage =
      ((range.value - range.min) * 100) / (range.max - range.min);
    range.style.setProperty("--progress", `${percentage}%`);
  });

  let menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    if (menuContainer.style.display === "flex") {
      hideGameplayMenu();
    } else {
      hideGamePlayMessagerie();
      menuContainer.style.display = "flex";
      menuContainer.classList.add("open");
      setTimeout(() => {
        menuContainer.classList.remove("open");
      }, 1000);
    }
  }
}
window.toggleGameplayMenu = toggleGameplayMenu;
