import { players } from "../../../../main.js";
 
// ============ PLAYER
export function storePlayerPlayedGame(id) {
  let playerPlayedGame = JSON.parse(
    localStorage.getItem("playerPlayedGame") || "[]",
  );
  if (!playerPlayedGame.includes(id)) {
    playerPlayedGame.push(id);
    localStorage.setItem("playerPlayedGame", JSON.stringify(playerPlayedGame));
  }
}
export function deletePlayerPlayedGame() {
  localStorage.setItem("playerPlayedGame", JSON.stringify([]));
}
export function storeDataOfPlayer(currentPlayer) {
  console.log("ACTION : STORED DATA OF PLAYER");
  window.currentPlayer = currentPlayer;
}

export function getCurrentPlayer() {
  return window.currentPlayer || null;
}


// ============ GAME DATA

export function storeGameData(gameData) {
  //console.log("ACTION : STORED GAME DATA");
  window.gameData = gameData;
}

export function getGameData() {
  return window.gameData || null;
}



// ============ TOKEN

export function getToken() {
  return localStorage.getItem("jwt") || null;
}
export function setToken(token) {
  localStorage.setItem("jwt", token);
}

export function deleteToken() {
  localStorage.removeItem("jwt");
}

// ============ ROOM ID

export function getRoomId() {
  let id = localStorage.getItem("roomId");
  return id;
}

export function storeRoomId(roomId) {
  console.log("ACTION : STORE ROOM ID " + roomId);
  localStorage.setItem("roomId", roomId);
}
export function deleteRoomId() {
  console.log("delete room id");
  //console.log("ACTION : DELETE ROOM ID");
  localStorage.setItem("roomId", "");
}



// ============ GAME ID
export function getGameId() {
  return localStorage.getItem("gameId") || null;
}
export function setGameId(gameId) {
  localStorage.setItem("gameId", gameId);
}
export function deleteGameId() {
  localStorage.removeItem("gameId");
}


// ============ CARD SORT

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


// ============ VIEW

export function storeView(obj) {
  localStorage.setItem("view", JSON.stringify(obj));
}
export function getView() {
  return (
    JSON.parse(localStorage.getItem("view")) || {
      statEventsDemonsWithValue: "value",
      playerView: players.length > 0 ? players[0].position : "1",
    }
  );
}export function setPlayerView(number) {
  let view = getView();
  view.playerView = number;
  storeView(view);
}
export function initView() {
  console.log(players);
  localStorage.setItem(
    "view",
    JSON.stringify({
      statEventsDemonsWithValue: "value",
      playerView: players.length > 0 ? players[0].position : "1",
    }),
  );
}



// ============ RESET
export function deleteAllGameVariablesSaved() {
  storeRoomId("");
  storeGameData("");
  storeDataOfPlayer("");
  deletePlayerPlayedGame();
}

export function deleteAllGameVariablesSavedForTestApp() {
  storeGameData("");
  deletePlayerPlayedGame();
  initView();
}
