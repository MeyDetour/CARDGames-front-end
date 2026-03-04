import { getPlayerId } from "../../src/controller/game/dataOfPlayer.js";
import { messageLogComponent } from "../messageLog/messageLog.js";

export function messageComponent(message) {

let playerId = getPlayerId()

  if (!message) {
    console.warn("please provide message");
    return;
  } 

  if (!message.playerId) { 
    return messageLogComponent(message)
  }
  if (!message.content) {
    console.warn("please provide content");
    return;
  }
  return /*html */ ` 
        <div class="message ${message.playerId === playerId? "messageRight" : "messageLeft"}">

            <div class="letter">${message.pseudo.charAt(0)}</div>
            <div> 
                <span class="pseudo">${ message.playerId == playerId ?"Vous" : message.pseudo} ${message.date}</span>
                <p>${message.content}</p>
            </div>
        </div>
        `;
}

