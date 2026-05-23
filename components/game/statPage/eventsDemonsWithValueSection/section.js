import {
  getView,
  storeView
} from "../../../../src/controller/game/dataStorage.js";

import {
  
  getGameData,
} from "../../../../src/controller/game/dataStorage.js";
import statEventsDemonsWithValueSectionParamsSection from "./params.js";
import statEventsDemonsWithValueSectionValueSection from "./value.js";
import statEventsDemonsWithValueSectionEventsSection from "./events.js";
import statEventsDemonsWithValueSectionDemonSection from "./demons.js";
import statEventsDemonsWithValueSectionValuePlayerSection from "./valuePlayer.js";

export default function gameplay_statEventsDemonsWithValueSection(
  gameData,
  view,
) {
  return /*html*/ `
    <div class="statEventsDemonsWithValueSection-navigation">
                   <span class="span ${ view.statEventsDemonsWithValue == "value" ? "selected" :""}" onclick="changeSubpageOfStatEventsDemonsWithValueSection('value')" class="${view.statEventsDemonsWithValue == "value" ? "selected" : ""}">Variable</span>
                   <span class="span ${ view.statEventsDemonsWithValue == "events" ? "selected" :""}" onclick="changeSubpageOfStatEventsDemonsWithValueSection('events')" class="${view.statEventsDemonsWithValue == "events" ? "selected" : ""}">Événements</span>
                   <span class="span ${ view.statEventsDemonsWithValue == "demons" ? "selected" :""}" onclick="changeSubpageOfStatEventsDemonsWithValueSection('demons')" class="${view.statEventsDemonsWithValue == "demons" ? "selected" : ""}">Démons</span>
                   <span class="span ${ view.statEventsDemonsWithValue == "params" ? "selected" :""}" onclick="changeSubpageOfStatEventsDemonsWithValueSection('params')" class="${view.statEventsDemonsWithValue == "params" ? "selected" : ""}">Paramètres</span>
                   <span class="span ${ view.statEventsDemonsWithValue == "valuePlayer" ? "selected" :""}" onclick="changeSubpageOfStatEventsDemonsWithValueSection('valuePlayer')" class="${view.statEventsDemonsWithValue == "valuePlayer" ? "selected" : ""}">Valeur Joueur</span>
                </div>
                <div class="boxContainer">
                        ${
                          view.statEventsDemonsWithValue == "value"
                            ? statEventsDemonsWithValueSectionValueSection(
                                gameData,
                              )
                            : view.statEventsDemonsWithValue == "events"
                              ? statEventsDemonsWithValueSectionEventsSection(
                                  gameData,
                                )
                              : view.statEventsDemonsWithValue == "demons"
                                ? statEventsDemonsWithValueSectionDemonSection(
                                    gameData,
                                  )
                                : view.statEventsDemonsWithValue == "params"
                                  ? statEventsDemonsWithValueSectionParamsSection(
                                      gameData,
                                    )
                                  :  view.statEventsDemonsWithValue == "valuePlayer"
                                  ? statEventsDemonsWithValueSectionValuePlayerSection(
                                      gameData,
                                    )
                                  : ""
                        } 
                        
                </div>
                `;
}
export function changeSubpageOfStatEventsDemonsWithValueSection(subpage) {
  let view = getView();
  view.statEventsDemonsWithValue = subpage;
  storeView(view);
  reloadComposant_gameplay_statEventsDemonsWithValueSection(
    getGameData(),
    view,
  );
}
window.changeSubpageOfStatEventsDemonsWithValueSection =
  changeSubpageOfStatEventsDemonsWithValueSection;

export function reloadComposant_gameplay_statEventsDemonsWithValueSection(
  gameData,
  view,
) {
  console.log("-- reload stat events demons with value section --");
  let content = document.querySelector(".statEventsDemonsWithValueSection");
  if (content) {
    content.innerHTML = gameplay_statEventsDemonsWithValueSection(
      gameData,
      view,
    );
  }
}
