import { button } from "../../button/button.js";
import { headerComponent } from "../../header/header.js";
import { messageComponent } from "../../message/message.js";
import { waitingPagePlayersBlock } from "./waitingPagePlayersBlock/waitingPagePlayersBlock.js";
import { waitingPageCopyBlock } from "./waitingPageCopyBlock/waitingPageCopyBlock.js";
export function waitingPage(gameData, currentPlayer) {
  console.log(gameData);

  
  let messagehtml = "";
  gameData.data.messages.forEach((message) => {
    messagehtml += messageComponent(message);
  });

 
  setTimeout(() => {
    scrollToBottom();
  }, 100);
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
                 <div class="chat">
                    <div class="chat-header">
                        <h3>Chat</h3>
                    </div>
                    <div class="wrapper">
                        ${messagehtml}
                    </div>
                    
                    <div class="send">
                        <input type="text" data-pseudo="${window.pseudo}" data-playerid="${currentPlayer.id}" placeholder="Ecrivez un message">
                        <div class="sendIcon" onclick="sendMessageInMessagerie()">
                            <img src="./assets/send.svg">
                        </div>
                    </div>
                </div>
                       
            </div>
        </div>
    `;
}
function scrollToBottom() {
  const chatContainer = document.querySelector(".chat .wrapper"); // Remplace par ton ID
  if (chatContainer) {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  } else {
    console.warn("dont find chat");
  }
}
