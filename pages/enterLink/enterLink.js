import { headerComponent } from '../../components/header/header.js'
import { button } from '../../components/button/button.js'

export function enterLinkPage() {
  console.log(window.socket);
  return /*html*/ `  <div class="enterLinkPage">
        ${headerComponent("enter-link")}
        <div class="box">
          <div>
              <h1>Lien de la room</h1>
              <span>Entre le code fourni par l'hôte</span>
          </div>
           
          <input type="text" value="enfbk452ezf2fez"/>
          ${button(null,null,null,()=>{},"Rejoindre","dark-grey")}
        </div>

    </div>
    `;
}
 
