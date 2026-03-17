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
