import { button } from "../../button/button.js";
import { headerComponent } from "../../header/header.js";
import { waitingPagePlayersBlock } from "./waitingPagePlayersBlock/waitingPagePlayersBlock.js";
import { waitingPageCopyBlock } from "./waitingPageCopyBlock/waitingPageCopyBlock.js";
import { messaegerieComponent } from "../../messagerie/messagerie.js";
export function waitingPage(gameData, currentPlayer) {
 
  return /*html */ ` 
      <div class="waitingPage"> 
        ${headerComponent("game")}
        <div class="row">
            <div class="left"  >
                <div class="copyBlock">
                  ${waitingPageCopyBlock()}
                </div>
                <div class="players-container">
                  ${waitingPagePlayersBlock()}
                </div>
            </div>
            <div class="right">
                 
                       ${messaegerieComponent()}
            </div>
        </div>
    `;
}

export function reloadComposant_messagerie_inWaitingPage() {
  let content = document.querySelector(".waitingPage .row .right");
  if (content) {
    content.innerHTML = messaegerieComponent( );
  }
}
