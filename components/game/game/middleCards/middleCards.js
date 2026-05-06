export function gameplay_middleCards(data) {
 
  return /*html */ `
    <div class="gamePlayMiddleCardsContainer ">
  
    </div>
    `;
}

export function reloadComposant_gameplayMiddleCards(content, data) {
  let middleCardsContainer = document.querySelector(".gamePlayMiddleCardsContainer");
  if (middleCardsContainer) {
    middleCardsContainer.remove();
  }
  content.innerHTML += gameplay_middleCards(data);
}
