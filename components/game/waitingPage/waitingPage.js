import { button } from "../../button/button.js";
import { headerComponent } from "../../header/header.js";
import { waitingPagePlayersBlock } from "./waitingPagePlayersBlock/waitingPagePlayersBlock.js";
import { waitingPageCopyBlock } from "./waitingPageCopyBlock/waitingPageCopyBlock.js";
import { messaegerieComponent } from "../../messagerie/messagerie.js";
export function waitingPage() {
 
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

export function reloadComposant_waitingPage() {
  console.log("-- reload waiting page --");
  let content = document.querySelector("#content");
  if (!content) {
    return;
  }
  content.innerHTML = waitingPage();
}

export function reloadComposant_messagerie_inWaitingPage() {
  console.log("-- reload messagerie in waiting page --");
  let content = document.querySelector(".waitingPage .row .right");
  if (content) {
    content.innerHTML = messaegerieComponent( );
  }
}
