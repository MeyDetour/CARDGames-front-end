export function customCard(card,cardParams) {
  //  { id: "1", suit: "hearts", value: "9", faceUp: true },

  if (!card) {
    return "PLEASE PROVIDE CARD";
  }
  if (!card.image || !card.url) {
    return "PLEASE PROVIDE IMAGE";
  }
  // x*78/200 = actuel radius
  // x is the defined radius parameter on a card of 200px
  // to adjuste it with card of 78px of height, we do x*78/200
  return /*html */ ` 
    <div style="${cardParams?.radius * 78/200 ?? ""}" class="customCardOfGame ${card.hoverable ? "hoverable" : ""}">
     <img src="${card.url}" alt="Custom Card Image">
    </div>
    `;
}
