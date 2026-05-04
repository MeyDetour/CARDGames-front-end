import { button } from "../../../button/button.js";
import { serializeParams } from "../../../../src-shared/helpers/serializer.js";
import { getGameData ,getCurrentPlayer} from "../../../../src-shared/controller/game/dataStorage.js";

export function gameplay_cardPile(
  cardsParams,
  actionParams,
  type,
  label,
  classname = "",
) {
   let gameData = getGameData();
  let currentPlayer = getCurrentPlayer();
  if (
    gameData.data.spectators.some(
      (spectator) => spectator.id == currentPlayer.id,
    )
  ) {
    return "";
  }
  if (type == "deck" && !cardsParams?.deck?.activation) {
    return "";
  }
  if (type == "discardDeck" && !cardsParams?.discard?.activation) {
    return "";
  }

  return /*html */ `
   <div onclick="${actionParams && actionParams.action ? `doAction(${serializeParams(actionParams)})` : ""}" class="gameplayPile ${classname}" id="pile-type-${type}">
   <img src="/assets/images/cardBack.png">
  ${actionParams ? /*html */ `<span class="actionLabel">${actionParams.action}</span>` : ""}
 
   ${label ? /*html */ `<span class="pileLabel">${label}</span>` : ""}
   </div>
     `;
}

export function reloadComposant_gameplayCardPile(
  content,
  cardsParams,
  actionParams,
  type,
  label,
  classname = "",
) {
  let actionsContainer = document.querySelector(`#pile-type-${type}`);
  if (actionsContainer) {
    actionsContainer.remove();
  }
  content.innerHTML += gameplay_cardPile(
    cardsParams,
    actionParams,
    type,
    label,
    classname,
  );
}
