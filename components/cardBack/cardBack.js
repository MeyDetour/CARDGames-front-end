import { serializeParams} from "../../src/helpers/serializer.js";
import {doActionFromCards } from "../../src/controller/game/actions.js";
export function cardBack( blink=false,card) {
  return /*html */ `
  <div  class="cardBack ${blink ? "blink" : ""}" 
    data-card-id="${card?.id}" >
     <img src="/assets/images/cardBack.png">
     </div>`  
}
