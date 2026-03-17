export function gameplay_menu(players, currentPlayer) {
  return /*html*/ `
    <div class="menu">
        <h2>Menu</h2>
        <button id="resumeGame" class="whiteButton">Laisser un commentaire</button>
        <button id="leaveGame" class="whiteButton">Retourner au menu</button>
        <hr>
        <h3>Joueurs</h3>
        
    </div>
    `;
}
 
window.closeGameplayMenu = closeGameplayMenu;

export function toggleGameplayMenu() {
  let menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    if (menuContainer.style.display === "flex") {
      menuContainer.classList.add("remove");
      setTimeout(() => {
        menuContainer.style.display = "none";
        menuContainer.classList.remove("remove");
      }, 3000);
    } else {
      menuContainer.style.display = "flex";
      menuContainer.classList.add("open");
      setTimeout(() => {
        menuContainer.classList.remove("open");
      }, 3000);
    }
  }
}
window.toggleGameplayMenu = toggleGameplayMenu;
