import { displayError } from "../controller/error.js";
import { verifyGameId } from "../controller/game/game.js"; 
import { joinRoom } from "../controller/game/louancher.js";
export let socket = null;
export async function connectSocket() {
  if (socket) return;
  socket = io("ws://localhost:8008");

  console.log("CONNECTED TO SOCKET SERVER");
  // expose on window so other legacy code can access it
  window.socket = socket;
  let playerId = null;
 

  socket.on("playerDataId", (id) => {
    playerId = id;
  });

  socket.on("roomCreated", ({ gameData, playerId }) => {
    joinRoom(gameData, playerId);
  });
  socket.on("roomJoined", ({ gameData, playerId }) => {
    joinRoom(gameData, playerId);
  });

  socket.on("error", (err) => {
    console.log(err);
    displayError(err);
  });

  socket.on("isExistingRoomResult", ({ roomId, result }) => {
    verifyGameId(roomId, result);
  });
  socket.on("playerDataId", (playerId) => {
    storePlayerId(playerId);
  });
  socket.on("gameChanges", (room) => {
    console.log(room);
  });
  socket.on("message", (message) => {
    // messages may be handled elsewhere; keep compatibility
    if (window.messages && Array.isArray(window.messages))
      window.messages.push(message);
  });

  socket.on("askPlayer", ({ event, params, roomId }) => {
    // placeholder for compatibility
  });
}
