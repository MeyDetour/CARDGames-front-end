import { button } from "../../button/button.js";
import { headerComponent } from "../../header/header.js";
export function waitingPage(gameData, playerId) {
  console.log(gameData);
  return /*html */ ` 
      <div class="waitingPage"> 
        ${headerComponent("game")}
        <div class="row">
            <div class="left">
                <div class="copyBlock">
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
                        ${gameData.roomInDb.params.globalGame.minPlayer < gameData.data.players.length ? button(null, null, null, "startGame", "Lancer la partie", "dark-grey", { roomId: gameData.roomId }) : "En attente de joueurs..."}
                    </div>
                </div>

                <div class="players-container">
                        <div class="players-container-header">
                            <img src="./assets/players-dark.svg"> 
                            <h3>Joueurs (${gameData.data.players.length})</h3>
                        </div>
                        <div class="wrapper">
                         
                        ${gameData.data.players.map((player) => {
                          return /*html */ `
                                <div class="playerCard">
                                    <div class="letter">${player.pseudo.charAt(0)}</div>
                                    <div>

                                    <span>${player.pseudo} ${playerId}</span>
                                    ${gameData.admin.id === player.id ? "<span>Hôte</span>" : ""}
                                    </div>
                                </div>
                                `;
                        })}
                        </div>

                </div>
            </div>
            <div class="right">
                 <div class="chat">
                 <div class="chat-header">
                    <h3>Chat</h3>
                 </div>
                 <div class="message">
                  ${gameData.data.players.map((player) => {
                    return /*html */ `
                                <div class="playerCard">
                                    <div class="letter">${player.pseudo.charAt(0)}</div>
                                    <span>${player.pseudo} ${playerId}</span>
                                    ${gameData.admin.id === player.id ? "<span>Hôte</span>" : ""}
                                </div>
                                `;
                  })}

                   </div> 
                    <div class="send">
                        <input type="text" placeholder="Ecrivez un message">
                        <div class="send" onclick="sendMessage()">
                            <img src="./assets/send.svg">
                        </div>
                    </div>
                 </div>       
            </div>
        </div>

       
   

     
    
    `;
}
