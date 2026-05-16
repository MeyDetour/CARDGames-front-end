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
  }
  // x*78/200 = actuel radius
  // x is the defined radius parameter on a card of 200px
  // to adjuste it with card of 78px of height, we do x*78/200
  const calculatedRadius = cardParams?.radius * (origine == "hand" ? 78 : environnement == "player-app" ? 80 : 44)/ 200 ?? 0;
 
let actionToDo = ""
  if (action) { 
      actionToDo = `selectCardForAction(${serializeParams(card)})`
  
  }

  return /*html */ ` 
    <div 
    data-card-id="${card.id}" 
    style="border-radius: ${calculatedRadius}px;"
     class=" ${action ? "blink" : ""} customCardOfGame ${card.hoverable ? "hoverable" : ""}">
     <img src="${card.url}" alt="Custom Card Image">
    </div>
    `;
}
