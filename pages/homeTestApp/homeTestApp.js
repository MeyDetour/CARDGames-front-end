import { button } from "../../../components/button/button.js";
import {gameplay_playerImage} from "../../../components/game/game/playerImage/playerImage.js"

export function homePage() {
  return /*html*/ `  <div class="homePage ">

        <main> 
            <h1 class="h1">CARD Studio Tester</h1> 
            <p class="p">
            L'environnement de test agile dédié à l'univers CARD Studio. Une plateforme pensée pour les développeurs et les créateurs afin de simuler, tester et valider des mécaniques de jeux de cartes en temps réel.
            </p>   
        </main>
        <div>
        <div class="loader"></div>
        <span class="span">Connexion en cours...</span>
        </div>
       
    </div>
    `;
}
