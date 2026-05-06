import { storeGameData } from "../../../../src/controller/game/dataStorage.js";
import { reloadComposant_StatPage } from "../../../components/game/statPage/statPage.js"; 
import { gameChanges } from "../../controller/game/game.js";
import { addMessageInLoadingMessage } from "../../controller/game/messages.js";
// ============= TEST APP =============
export function gameUpdatesListenForTestApp(socket) {

      socket.on("youAreSpectator", (currentPlayer) => {
        console.log("RECEIVE YOU ARE SPECTATOR :>>", { currentPlayer });
    
        reloadComposant_StatPage();
      });
    
      socket.on("playerData", (currentPlayer) => {
        console.log("RECEIVE PLAYER DATA :>>", { currentPlayer });
       
      });
    
      socket.on("gameChanges", ({ gameData, currentPlayer }) => {
        console.log("RECEIVE GAME CHANGES :>>", { gameData, currentPlayer });
        
        storeGameData(gameData);
        reloadComposant_StatPage();
      });
     
}

// ============= Player  APP =============

export function gameUpdatesListen(socket) {

      socket.on("youAreSpectator", (currentPlayer) => {
        console.log("RECEIVE YOU ARE SPECTATOR :>>", { currentPlayer });
        storeDataOfPlayer(currentPlayer);
        reloadComposant_gamePage();
      });
    
      socket.on("playerData", (currentPlayer) => {
        console.log("RECEIVE PLAYER DATA :>>", { currentPlayer });
        storeDataOfPlayer(currentPlayer);
      });
    
      socket.on("gameChanges", ({ gameData, currentPlayer }) => {
        console.log("RECEIVE GAME CHANGES :>>", { gameData, currentPlayer });
        console.log(
          "current player position :",
          gameData.data.currentPlayerPosition.value,
        );
        gameChanges(gameData, currentPlayer);
      });
    
      socket.on("updateGameDataLogs", (message) => {
        addMessageInLoadingMessage(message);
      });
}