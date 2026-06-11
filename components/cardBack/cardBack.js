import { serializeParams} from "../../src/helpers/serializer.js";
import {doActionFromCards } from "../../src/controller/game/actions.js";
export function cardBack( blink=false,hoverable=false,multiselection="single",cardId=null,originPlayerId=null) {
  return /*html */ `
  <div  class="cardBack ${blink ? "blink" : ""} ${hoverable ? "hoverable" : ""}" 
    data-card-id="${cardId}" data-selection-type="${multiselection}" data-origin-player-id="${originPlayerId}">
     <img src="/assets/images/cardBack.png">
     </div>`  
}
