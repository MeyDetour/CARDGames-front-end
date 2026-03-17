import { button } from "../../../button/button.js";
export function gameplay_menu(players, currentPlayer) {
  return /*html*/ `
    <div class="menu">
        <h2>Menu</h2>
        ${button(null,null,null,"letComment","Laisser un commentaire","whiteButton")}
        ${button(null,null,"/",null,"Retourner au menu","whiteButton")}
    <hr>
        <h3>Joueurs</h3>
        ${players
          .map(
            (player) => /*html */ ` <span>${player.pseudo}</span>   `
          )
          .join("")}
    </div>
    `;
}
  

export function toggleGameplayMenu() {
  let menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    if (menuContainer.style.display === "flex") {
      menuContainer.classList.add("close");
      setTimeout(() => {
        menuContainer.style.display = "none";
        menuContainer.classList.remove("close");
      }, 1000);
    } else {
      menuContainer.style.display = "flex";
      menuContainer.classList.add("open");
      setTimeout(() => {
        menuContainer.classList.remove("open");
      }, 1000);
    }
  }
}
window.toggleGameplayMenu = toggleGameplayMenu;
