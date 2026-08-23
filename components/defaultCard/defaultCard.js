import { serializeParams} from "../../src/helpers/serializer.js";
import {doActionFromCards } from "../../src/controller/game/actions.js";
export function defaultCard(card,canDoACtion,style='',origin="") {
 
  //  { id: "1", suit: "hearts", value: "9", faceUp: true },
 

  if (!card) {
    return "PLEASE PROVIDE CARD";
  }
  if (!card.addedAttributs.value || !card.addedAttributs?.symbol) {
    return "PLEASE PROVODE SUIT";
  }
  const getSuitColor = (suit) => {
    return suit === "coeur" || suit === "carreau"
      ? "text-red-600"
      : "text-slate-900";
  };
  const getSuitSymbol = (suit) => {
    switch (suit) {
      case "coeur":
        return "♥";
      case "carreau":
        return "♦";
      case "trefle":
        return "♣";
      case "pique":
        return "♠";
      default:
        return "";
    }
  };
    const getValueSymbol = (value) => {
    switch (value) {
      case 11:
        return "V";
      case 12:
        return "D";
      case 13:
        return "R"; 
      default:
        return value
    }
  };

  let suit = getSuitSymbol(card.addedAttributs?.symbol)
  let value = getValueSymbol(card.addedAttributs?.value)

  let color = getSuitColor(card.addedAttributs?.symbol);
   

  return /*html */ ` 
    <div 
    style="${style}
    "
    data-card-id="${card.id}"   class="defaultCardOfGame ${card.hoverable && canDoACtion ? "hoverable" : ""}  ">
        <span class="leftValue">${value}</span> 
        <span class="leftSuit ${color}">${suit}</span> 
        <span class="suit ${color}">${suit}</span> 
        <span class="rightSuit ${color}">${suit}</span> 

        <span class="rightValue">${value}</span> 
    </div>
    `;
}
