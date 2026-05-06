import { players } from "../../../main.js";
import { getPlayerOfCurrentView } from "./players.js";
function specTheGameForTestApp() {
    let currentPlayer = getPlayerOfCurrentView();
    let socket = players.find(player => player.id == currentPlayer.id)?.socket || null;
    if (socket){
        socket.emit("specTheGameForTestApp" );
    }
}
window.specTheGameForTestApp = specTheGameForTestApp;

function specTheGame() {
    if (socket){
        socket.emit("specTheGame" );
    }

}
window.specTheGame = specTheGame;

function changeSpectatorToPlayer(){
    let currentPlayer = getPlayerOfCurrentView();
    let socket = players.find(player => player.id == currentPlayer.id)?.socket || null;
    if (socket){
        socket.emit("changeSpectatorToPlayer" );
    }
}
window.changeSpectatorToPlayer = changeSpectatorToPlayer;