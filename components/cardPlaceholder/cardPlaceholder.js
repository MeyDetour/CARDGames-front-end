import { environnement } from "../../main.js";
export function cardPlaceholder(cardParams) {
  return /*html */ ` 
   <div style="border-radius: ${cardParams?.radius * (environnement == "player-app" ? 78 : 44)/200 ?? ""}px" class="cardPlaceholder ${environnement }" >
     
   </div>
     `;
}