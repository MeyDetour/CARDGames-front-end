 
import { storeGameData } from "../../../../src-shared/controller/game/dataStorage.js";
import { reloadComposant_gamePage } from "../../../../pages/game/game.js";
import { addMessageInLoadingMessage } from "../../../../../components/game/game/messageOfLoading/messageOfLoading.js";
import { gameChanges } from "../../controller/game/game.js";


export function gameUpdatesListen(socket) {

      
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