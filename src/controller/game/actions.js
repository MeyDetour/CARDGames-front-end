import { reloadComposant_gameplayPage } from "../../../components/game/game/gameplayPage.js";
import { players } from "../../../main.js";
import { environnement } from "../../../main.js";
import { getCurrentPlayer } from "./dataStorage.js";
import { serializeParams } from "../../helpers/serializer.js";
import { getPlayerOfCurrentView } from "./players.js";
import { socket } from "../../connection.js";
import { getGameData } from "./dataStorage.js";
import {gameplay_actionsButtons_toggle_widget} from "../../../components/game/game/actionsButtons/actionsButtons.js";
import { displayAskPlayerWidget } from "../../../components/game/game/widgetContainerAskPlayer/widgetContainerAskPlayer.js";
import { displayError } from "../error.js";

/* Function to handle player actions in the game
    @param {string} playerId - The ID of the player performing the action
    @param {string} roomId - The ID of the game room
    @param {string} action - The name of action being performed
    @param {string} actionType - The type of action (e.g., "askPlayer")
*/
function doAction(params) {
  gameplay_actionsButtons_toggle_widget();
  let action = params.action;
  if (action.askValueToPlayThisAction){
      displayAskPlayerWidget(event, params, roomId);
      return
  }
  let actionType = params.actionType || "default";
  let id = params.playerId;
  console.log("Do Action :>> ", { action, actionType });
  if (environnement == "test-app") {
    socket = players.find((player) => player.id == id).socket;
  }
  socket.emit("doAction", { action, actionType });
}

window.doAction = doAction;

export function doActionFromHandDeck(card) {
  console.log("ACTION ON CARD", card);
  let socketToDoAction = socket;

  // Si c'est déjà un objet, on ne parse pas
  const cardObj = typeof card === "string" ? JSON.parse(card) : card;

  console.log("Card ID:", cardObj.id);
  if (!card) {
    console.error("No card data provided for action from hand/deck");
    displayError("No card data provided for action from hand/deck");
    return;
  }
  let currentPlayer;
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  }
  if (environnement == "test-app") {
    currentPlayer = getPlayerOfCurrentView();
    socketToDoAction = players.find(
      (player) => player.id == currentPlayer.id,
    ).socket;
  }
  let actionOnHand = currentPlayer.actions.value.find(
    (action) => action.actionOnHand,
  );
  if (!actionOnHand) {
    console.error("No action found for hand/deck interaction");
    displayError("No action found for hand/deck interaction");
    return;
  }
  let action = actionOnHand;
  let actionType = action.type || "default";

  let id = currentPlayer.id;
  console.log("Do Action :>> ");
  console.log(card);
  console.log(action);

  // socketToDoAction.emit("doAction", { action, actionType });
}

window.doActionFromHandDeck = doActionFromHandDeck;

export function selectCardForAction(card) {
  console.log("SELECT ON CARD", card);

  // Si c'est déjà un objet, on ne parse pas
  const cardObj = typeof card === "string" ? JSON.parse(card) : card;

  console.log("Card ID:", cardObj.id);
  if (!card) {
    console.error("No card data provided for action from hand/deck");
    displayError("No card data provided for action from hand/deck");
    return;
  }
  let cardElement = document.querySelector(`[data-card-id="${cardObj.id}"]`);
  if (cardElement) {
    cardElement.classList.add("selected");
  }
}

window.selectCardForAction = selectCardForAction;
