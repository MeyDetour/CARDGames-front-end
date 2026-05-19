import { getPlayerOfCurrentView, getPlayerStat } from "../../../../src/controller/game/players.js"
import { getGameData } from "../../../../src/controller/game/dataStorage.js";
 
export default function statEventsDemonsWithValueSectionValuePlayerSection(){
    let currentPlayer = getPlayerOfCurrentView();  
    let gameData = getGameData();
  return /*html*/ `
        ${getPlayerStat(currentPlayer, gameData)
                         .map(
                           (stat) => /*html*/ `
                             <div class="statValueElement"><div class="spanTop"><span>${stat.name}</span><span>${stat.type}</span></div><span>${stat.value}</span></div>
     
                                       `,
                         )
                         .join("")}  
        
   `
}
