export function gameplay_middleCards(data) {
 
  return /*html */ `
    <div class="gamePlayMiddleCardsContainer ">
  
    </div>
    `;
}

export function reloadComposant_gameplayMiddleCards(selector, data) {

  console.log("-- reload middle cards --");
  const el = document.querySelector(selector);
  if (!el) return;
  const middleCardsContainer = el.querySelector(".gamePlayMiddleCardsContainer");
  if (middleCardsContainer) {
    middleCardsContainer.remove();
  }
  const anchor = el.querySelector(".player, .gameplayGlobalValues, .center");
  if (anchor) {
    anchor.insertAdjacentHTML("beforebegin", gameplay_middleCards(data));
  } else {
    el.insertAdjacentHTML("beforeend", gameplay_middleCards(data));
  }
}
