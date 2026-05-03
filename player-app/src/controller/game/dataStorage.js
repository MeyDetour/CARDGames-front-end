 import { storeDataOfPlayer,storeRoomId } from "../../../../src-shared/controller/game/dataStorage";
export function getGameData() {
  return window.gameData || null;
} 

 
  

 
export function storePlayerPlayedGame(id){
  let playerPlayedGame = JSON.parse(localStorage.getItem("playerPlayedGame") || "[]");
  if (!playerPlayedGame.includes(id)) {
    playerPlayedGame.push(id);
    localStorage.setItem("playerPlayedGame", JSON.stringify(playerPlayedGame));
  }
}
export function deletePlayerPlayedGame(){
  localStorage.setItem("playerPlayedGame", JSON.stringify([]));
}


export function deleteAllGameVariablesSaved(){
  storeRoomId("")
  storeGameData("")
  storeDataOfPlayer("")
  deletePlayerPlayedGame()
}