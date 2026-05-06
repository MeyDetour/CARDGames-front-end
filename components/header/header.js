import { button } from '../button/button.js'

export function headerComponent(page = "games") {
  return /*html */ ` 
    <header class="headerGames"> 
     ${button("left-arrow-dark", null, "/", null, "Retour", "withoutborder")}
                   
          
        </header>
    `;
}
 