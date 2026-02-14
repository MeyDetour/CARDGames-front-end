import { headerComponent } from '../../components/header/header.js'
import { button } from '../../components/button/button.js'

export function choosePseudoPage(params = {}) { 
  const gameId = params.gameId  
  const name = params.name   
  const roomId = params.roomId  
  console.log(window.socket);
  console.log("gameID : "+gameId)
  console.log('name :>> ', name); 
  console.log('roomId :>> ', roomId);

  return /*html*/ `  <div class="choosePseudoPage">
        ${headerComponent("choose-pseudo")}
        <div class="box">
          <div>
              <h1>${name}</h1>
              <span>Choisissez votre pseudo</span>
          </div>
           <span id="error"></span>
          <input id="pseudo" type="text" placeholder="ANYA"/>
          ${button(null, null, null, "gameLogin", "Créer", "dark-grey", {
            gameId: gameId,
            roomId: roomId, 
          })}
        </div>

    </div>
    `;
}
 
