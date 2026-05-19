import { button } from "../../../button/button.js";
import { isPassifPlayer } from "../../../../src/controller/game/players.js";
import { environnement } from "../../../../main.js";
export function gameplay_actionButton(actions, isCurrentTurn, currentPlayer) {
  if (isPassifPlayer(currentPlayer)) {
    return "";
  }
  return /*html */ `
   ${button(
     null,
     null,
     null,
     "gameplay_actionsButtons_toggle_widget",
     "Actions",
     "blueButton oepnActionsButton",
   )}
   ${gameplay_actionsButtons(actions, isCurrentTurn, currentPlayer)}

     `;
}
export function gameplay_actionsButtons(actions, isCurrentTurn, currentPlayer) {
  if (isPassifPlayer(currentPlayer)) {
    return "";
  }
  return /*html */ `
   <div class="actionsContainer">
   <div class="wrapper">
        ${actions
          .map((action) => {
            let mustAppear =
              !action.appearAtPlayerTurn ||
              (action.appearAtPlayerTurn && isCurrentTurn);

            if (!mustAppear) return "";

            return button(
              null,
              null,
              null,
              "doAction",
              action.name,
              "greyButton",
              {
                action: action,
                actionType: action.type || "default",
                playerId: currentPlayer.id,
              },
            );
          })
          .join("")}
  </div>  
  <img src="/assets/close-white.svg" class="closeButton" onclick="gameplay_actionsButtons_toggle_widget()"/>
  </div>  
  `;
}
export function gameplay_actionsButtons_toggle_widget() {
  let actionsContainer = document.querySelector(".actionsContainer");
  let button = document.querySelector(".oepnActionsButton");
  if (!actionsContainer || !button) {
    console.error("Actions container or button not found");
    return;
  }
  if (actionsContainer.style.display === "flex") {
    actionsContainer.style.display = "none";
    button.style.opacity = "1";
  } else {
    actionsContainer.style.display = "flex";
    button.style.opacity = "0.5";
  }
}
window.gameplay_actionsButtons_toggle_widget =
  gameplay_actionsButtons_toggle_widget;
export function reloadComposant_gameplayActionsButtons(
  content,
  actions,
  isCurrentTurn,
  currentPlayer,
  roomId,
) {
  let actionsContainer = document.querySelector(".actionsContainer");
  let button = document.querySelector(".oepnActionsButton");

  // si les bouttons d'actions ne sont pas affiché on peut rechargé
  if (actionsContainer && actionsContainer.style.display !== "flex") {
    button.remove();
    content.innerHTML += gameplay_actionButton(
      actions,
      isCurrentTurn,
      currentPlayer,
      roomId,
    );
  } // sinon on laisse l'utisateur faire son choix
}
