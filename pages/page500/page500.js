import { button } from "../../components/button/button.js";

export function page500() {
  return /*html*/ `  <div class="page500">

        <main> 
            <h1 class="h1">Server inactif</h1> 
            <p class="p">
                Votre session a expiré ou est invalide. Veuillez retourner sur Card Studio pour relancer la session de test. 
                </p>  
            ${button(null,null,null, "redirectToCardStudio", "Retourner sur Card Studio",null)}
            
            
            </div>
        </main>
      
      
    </div>
    `;
}
