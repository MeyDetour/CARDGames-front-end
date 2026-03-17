export function gameplay_handdeck(displayHandDeck, handDeck, cardList) {
  if (!displayHandDeck) {
    return "";
  }

  return /*html */ `
    <div class="handDeck">
                      ${handDeck
                        .map((cardId) => {
                          let carElt = cardList[cardId];
                          carElt.faceUp = true;
                          const suits = {
                            coeur: "hearts",
                            carreau: "diamonds",
                            treffle: "clubs",
                            pique: "spades",
                          };

                          carElt.suit =
                            suits[carElt.addedAttributs.couleur] || "";
                          carElt.hoverable = true;
                          return defaultCard(carElt);
                        })
                        .join("")}
                </div>
     `;
}

export function reloadComposant_gameplayHanddeck(
    content,
  displayHandDeck,
  handDeck,
  cardList,
) {
  let handDeckContainer = document.querySelector(".handDeck");
  if (handDeckContainer) {
    handDeckContainer.remove();
  }
  content.innerHTML += gameplay_handdeck(displayHandDeck, handDeck, cardList);
}
