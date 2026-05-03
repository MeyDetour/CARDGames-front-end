export function storeDataOfPlayer(currentPlayer) {
  console.log("ACTION : STORED DATA OF PLAYER");
  window.currentPlayer = currentPlayer;
}

export function getCurrentPlayer() {
  return window.currentPlayer || null;
}
export function storeGameData(gameData) {
  //console.log("ACTION : STORED GAME DATA");
  window.gameData = gameData;
}

export function getGameData() {
  return window.gameData || null;
} 


export function getRoomId() {
  let id = localStorage.getItem("roomId");
  return id;
}

export function storeRoomId(roomId) {
  //console.log("ACTION : STORE ROOM ID " + roomId);
  localStorage.setItem("roomId", roomId);
}
export function deleteRoomId() {
  //console.log("ACTION : DELETE ROOM ID");
  localStorage.setItem("roomId", "");
}

export function getCardSort() {
  let sort = localStorage.getItem("CardSort");
  return sort;
}

export function storeCardSort(CardSort) {
  //console.log("ACTION : STORE CardSort);
  localStorage.setItem("CardSort", CardSort);
}
export function deleteCardSort() {
  //console.log("ACTION : DELETE Carort");
  localStorage.setItem("CardSort", "");
} 

