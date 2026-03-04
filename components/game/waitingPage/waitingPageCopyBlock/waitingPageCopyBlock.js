import { getPlayerId } from "../../../../src/controller/game/dataOfPlayer.js";
import { button } from "../../../button/button.js";
export function waitingPageCopyBlock() {
  let playerId = getPlayerId()
 let gameData = window.gameData
  return /*html*/ `
 
      <div class="top">
        <h1>${gameData.roomInDb.name}</h1>
        <h3>Le salon est prêt !</h3>
        <div class="code">
            <span>Code de la room</span>
          
            <span onclick="copy('${gameData.roomId}')" class="linkToCopy">${gameData.roomId}
                  <img src="./assets/copy.svg">
            </span>
        </div>
      </div>
      <div class="bottom">
          <p>Pour commencer la partie, vous devez être au moins ${gameData.roomInDb.params.globalGame.minPlayer} joueurs. Partagez le lien d'invitation ci-dessous avec vos amis pour qu'ils puissent rejoindre la table instantanément.</p>
          ${
            gameData.roomInDb.params.globalGame.minPlayer <=
            gameData.data.players.length
              ? gameData.admin.id === playerId
                ? button(
                    null,
                    null,
                    null,
                    "startGame",
                    "Lancer la partie",
                    "green",
                    { roomId: gameData.roomId },
                  )
                : "En attente du lancement de la partie..."
              : "En attente de joueurs..."
          }
      </div>

  `;
}


export function reloadComposant_waitingPageCopyBlock(){
  let div = document.querySelector(".waitingPage .left .copyBlock")
  if(div){
  div.innerHTML = waitingPageCopyBlock()
  }
}