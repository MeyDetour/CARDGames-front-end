import { messageComponent } from "../../../components/message/message.js";
import { messageLogComponent } from "../../../components/messageLog/messageLog.js";

export function sendMessageInMessagerie() {
  let input = document.querySelector(".waitingPage .right .send input");
  if (input) {
    if (window.socket) {
      var currentdate = new Date();
      let message = {
        content: input.value,
        playerId: input.dataset.playerid,
        pseudo: input.dataset.pseudo,
        date: currentdate.getHours() + ":" + currentdate.getMinutes(),
      };
      console.log("<<<EMIT MESSAGE : " + JSON.stringify(message) + ">>>");
      window.socket.emit("newMessageOnmessagerie", message);
    } else {
      console.warn("cannot send message because window.socket in undefind");
    }
  } else {
    console.warn("input not found");
  }
}
export function messageSuccessfullySend(message) {
 addNewMessageInMessagerie(message)
  let input = document.querySelector(".waitingPage .right .send input");
  if (input) {
    input.value = "";
  }
}
export function addNewMessageInMessagerie(message) {
  let messagerie = document.querySelector(".waitingPage .right .wrapper");
  if (messagerie) {
      messagerie.innerHTML += messageComponent(message);
     
  }
}
export function updateListOfMessages(messages){
 let gameData = window.gameData
 gameData.data.messages=messages
 window.gameData = gameData
 console.log("NEW GAME DATA ");
 console.log(gameData);
}

window.sendMessageInMessagerie = sendMessageInMessagerie;
