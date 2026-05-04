import { players } from "../../../main.js";

   import { storeGameData } from "../../../../src-shared/controller/game/dataStorage.js";
 
  

 
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

export function getToken(){
  return localStorage.getItem("jwt") || null;
}
export function setToken(token){
  localStorage.setItem("jwt", token);
}

export function getGameId(){
  return localStorage.getItem("gameId") || null;
}
export function setGameId(gameId){
  localStorage.setItem("gameId", gameId);
}
export function deleteGameId(){
  localStorage.removeItem("gameId");
}
export function deleteToken(){
  localStorage.removeItem("jwt");
}


export function storeView(obj){
  localStorage.setItem("view", JSON.stringify(obj));
}
export function getView(){

  return JSON.parse(localStorage.getItem("view")) || {
    statEventsDemonsWithValue: "value",
    playerView: players.length > 0 ? players[0].position : "1",    
  };
}export function initView(){
  console.log(players);
  localStorage.setItem("view", JSON.stringify({
    statEventsDemonsWithValue: "value",
    playerView: players.length > 0 ? players[0].position : "1",      
  })); 
}

 
export function deleteAllGameVariablesSaved(){
 
  storeGameData("") 
  deletePlayerPlayedGame()
  initView()
}