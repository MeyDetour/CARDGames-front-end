import { button } from "../../../button/button";
export function gameplay_actionsButtons(
  actions,
  isCurrentTurn,
  currentPlayerId,
  roomId
) {
  if (!displayHandDeck) {
    return "";
  }

  return /*html */ `
    ${actions
      .map((action) => {
        let mustAppear =
          !action.appearAtPlayerTurn ||
          (action.appearAtPlayerTurn && isCurrentTurn);

        if (!mustAppear) return "";

        return /*html */ `  <div class="actionsContainer">
                                 ${button(
                                   null,
                                   null,
                                   null,
                                   "doAction",
                                   action.name,
                                   "greyButton",
                                   {
                                     playerId: currentPlayerId,
                                     roomId: roomId,
                                     action: action.name,
                                     actionType: action.type || "default",
                                   },
                                 )}
                            </div>  `;
      })
      .join("")}
     `;
}

export function reloadComposant_gameplayActionsButtons(
  content,
  actions,
  isCurrentTurn,
  currentPlayerId,
  roomId
) {
  let handDeckContainer = document.querySelector(".handDeck");
  if (handDeckContainer) {
    handDeckContainer.remove();
  }
  content.innerHTML += gameplay_actionsButtons(
    displayHandDeck,
    handDeck,
    cardList,
  );
}
