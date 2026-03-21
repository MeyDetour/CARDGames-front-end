export function winPage() {
  // 1. On génère les 400 particules en HTML
  let particlesHTML = "";
  for (let i = 0; i < 400; i++) {
    // On calcule les valeurs aléatoires ici pour les injecter en inline style
    const x = Math.random() * 100 + "vw";
    const y = Math.random() * 100 + "vh";
    const bg = `hsl(${Math.random() * 360}, 100%, 65%)`;
    const duration = 1 + Math.random() + "s";
    const delay = "-" + Math.random() * 2 + "s"; // Délai aléatoire pour désynchroniser

    particlesHTML += `<div class="particle" style="--x: ${x}; --y: ${y}; --bg: ${bg}; --t: ${duration}; --d: ${delay};"></div>`;
  }

  // 2. On retourne le template complet
  return /*html*/ ` 
    <div class="winPage">
      ${particlesHTML}
      <div class="winContent">
        <h1>Félicitations, vous avez gagné !</h1>
      </div>
    </div>
    `;
}
 

export function reloadComposant_winPage() {
  let content = document.querySelector("#content");
  if (content) {  
    content.innerHTML = winPage();
  }
}
