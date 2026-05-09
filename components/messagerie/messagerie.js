import { messageComponent } from "../message/message.js";
import { getGameData , getCurrentPlayer} from "../../../src/controller/game/dataStorage.js";
import { displayError } from "../../../src/controller/error.js";
import { getPlayerOfCurrentView } from "../../../src/controller/game/players.js";
import { environnement } from "../../../main.js";
import {sendMessageInMessagerie} from "../../../src/controller/game/messages.js";
// obligé d'ajouter et de supprimer le composant et 
// de la mettre dans la page de base car la gameplay page est rechargé
// et supprimer le composant


export function messaegerieComponent( ) {
  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display game");
    return;
  }
  let currentPlayer;
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  } else {
    currentPlayer = getPlayerOfCurrentView();
  }

  let messagehtml = "";
  let messages = gameData.data.messages || [];
  messages.forEach((message) => {
    messagehtml += messageComponent(message);
  });
  setTimeout(() => {
    scrollToBottom();
  }, 100);
  return /*html */ `
    <div class="chat">
                    <div class="chat-header">
                        <h3>Chat</h3>
                    </div>
                    <div class="wrapper">
                        ${messagehtml}
                    </div>
                    
                    <div class="send">
                        <input type="text" data-pseudo="${currentPlayer.pseudo}" data-playerid="${currentPlayer.id}" placeholder="Ecrivez un message">
                        <div class="sendIcon" onclick="sendMessageInMessagerie()">
                            <img src="./assets/send.svg">
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
