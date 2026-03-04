export function storeDataOfPlayer(playerId, roomId) {
    console.log("ACTION : : STORED DATA OF PLAYER");
  localStorage.setItem("playerId", playerId);
  localStorage.setItem("roomId", roomId);
}
export function deleteStoreDataOfPlayer() {
    console.log("ACTION : DELETE STORED DATA OF PLAYER");
  localStorage.setItem("playerId", "");
  localStorage.setItem("roomId", "");
}

export function getPlayerId() {
  let id = localStorage.getItem("playerId");
  return id;
}
export function getRoomId() {
  let id = localStorage.getItem("roomId");
  return id;
}
