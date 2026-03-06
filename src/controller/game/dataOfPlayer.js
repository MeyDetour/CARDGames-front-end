export function storeDataOfPlayer(currentPlayer) {
    console.log("ACTION : STORED DATA OF PLAYER");
  localStorage.setItem("currentPlayer", JSON.stringify(currentPlayer)); 
}
export function deleteStoreDataOfPlayer() {
    console.log("ACTION : DELETE STORED DATA OF PLAYER");
  localStorage.setItem("currentPlayer", ""); 
}

export function getCurrentPlayer() {
  let currentPlayer = localStorage.getItem("currentPlayer");
  return currentPlayer ? JSON.parse(currentPlayer) : null;
}


export function getRoomId() {
  let id = localStorage.getItem("roomId");
  return id;
}

export function storeRoomId(roomId) {
    console.log("ACTION : STORE ROOM ID " + roomId);
  localStorage.setItem("roomId", roomId);
}
export function deleteRoomId() {
    console.log("ACTION : DELETE ROOM ID");
  localStorage.setItem("roomId", "");
}