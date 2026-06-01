import { environnement } from "../../main.js";
import { doActionFromHandDeck } from "../../src/controller/game/actions.js";
import { serializeParams } from "../../src/helpers/serializer.js";

export function customCard(card, cardParams, action, origine = "hand") {
  //  { id: "1", suit: "hearts", value: "9", faceUp: true },

  if (!card) {
    return "PLEASE PROVIDE CARD";
  }
  if (!card.image || !card.url) {
    return "PLEASE PROVIDE IMAGE";
  }   const calculatedRadius = cardParams?.radius * (origine == "hand" ? 78 : environnement == "player-app" ? 80 : 44) ?? 0;
 
let actionToDo = ""
  if (action) { 
      actionToDo = `selectCardForAction(${serializeParams(card)})`
  
  }

  return /*html */ ` 
    <div 
    data-card-id="${card.id}" 
    style="border-radius: ${calculatedRadius}px;"
     class="  customCardOfGame ${card.hoverable && action ? "hoverable" : ""}">
     <img src="${card.url}" alt="Custom Card Image">
    </div>
    `;
}
