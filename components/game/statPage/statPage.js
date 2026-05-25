import { getView } from "../../../src/controller/game/dataStorage.js";
import { getGameData } from "../../../src/controller/game/dataStorage.js";
import {environnement} from "../../../main.js"
import gameplay_statEventsDemonsWithValueSection from "./eventsDemonsWithValueSection/section.js";
import topRowPlayerInformations from "./topRowPlayerInformations/topRowPlayerInformations.js";
import { reloadComposant_gameplay_statEventsDemonsWithValueSection } from "./eventsDemonsWithValueSection/section.js";
import { reloadComposant_gameplayPage } from "../game/gameplayPage.js";
import { reload_topRowPlayerInformations ,changeCurrentView} from "./topRowPlayerInformations/topRowPlayerInformations.js";
import gameplayPage from "../game/gameplayPage.js";
import { reloadComposant_loosePage } from "../loosePage/loosePage.js";
import { reloadComposant_winPage } from "../winPage/winPage.js";
import { button } from "../../button/button.js";
import { players } from "../../../main.js";

import {  getNextPlayerOfCurrentView } from "../../../src/controller/game/players.js";
export function statPage() {
  let view = getView();
  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display game");
    return "";
  }
  return /*html*/ `
<div class="statGamePage">
    <div class="head" >
              <h2 class="h2">${gameData.roomInDb.name}</h2> 
              <div>
                ${button(null, null, null, "replayForTestApp", "Relancer", "greyBorderButton")}
                ${button(null, null, null, "exit", "Quitter", "greyBorderButton")}
              </div>
          </div> 
        <div class="row">
        <div class="left">
           
            <div class="statEventsDemonsWithValueSection">
            ${gameplay_statEventsDemonsWithValueSection(gameData, view)}
            </div>
          </div>
         
          <div class="right">

           <div class="topRow">
         ${topRowPlayerInformations()}
            
        </div>  
            <div class="gameplayPageContainer">
           ${gameplayPage()}
            </div>
          </div>
        </div>
`;
}
let isTabListenerInitialized = false;
export function reloadComposant_StatPage() {
  console.log("=====RELOAD STATT PAGE=========="); 

// Source - https://stackoverflow.com/a/45823386
// Posted by adeneo
// Retrieved 2026-05-25, License - CC BY-SA 3.0
if (!isTabListenerInitialized) {
    document.addEventListener('keydown', function(event) {
      if (event.keyCode == 9) {
        event.preventDefault();
        changeCurrentView(getNextPlayerOfCurrentView()?.position);
      }
    });
    
    // On passe le drapeau à true pour les prochains rechargements
    isTabListenerInitialized = true;
  }


  let gameData = getGameData(); 
  if (!gameData) {
    displayError("No game data found to display game");
    return;
  } 
  if (gameData.data.state.value!="inProgress"){
  return;
  }
  let content = document.querySelector("#statGamePage");
  if (!content) {
    document.querySelector("#content").innerHTML = statPage();
  }

  reload_topRowPlayerInformations();
  reloadComposant_gameplay_statEventsDemonsWithValueSection(
    gameData,
    getView(),
  );

  reloadComposant_winPage();
  reloadComposant_loosePage();
  reloadComposant_gameplayPage();
}
