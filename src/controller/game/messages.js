export function sendMessage() {
  let input = document.querySelector(".waitingPage");
  if (input) {
    if (window.socket) {
      socket.emit("messagerie", input.value);
    } else {
      console.warn("cannot send message because window.socket in undefind");
    }
  } else {
    console.warn("input not found");
  }
}
window.sendMessage = sendMessage;
