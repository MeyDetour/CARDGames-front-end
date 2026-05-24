import { reloadComposant_gameplayPage } from "../../../components/game/game/gameplayPage.js";
import { players } from "../../../main.js";
import { environnement } from "../../../main.js";
import { getCurrentPlayer } from "./dataStorage.js";
import { serializeParams } from "../../helpers/serializer.js";
import { getPlayerOfCurrentView } from "./players.js";
import { socket } from "../../connection.js";
import { getGameData } from "./dataStorage.js";
import { gameplay_actionsButtons_toggle_widget } from "../../../components/game/game/actionsButtons/actionsButtons.js";
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
  if (action.askValueToPlayThisAction) {
    displayAskPlayerWidget(event, params, roomId);
    return;
  }
  let actionType = params.actionType || "default";
  let id = params.playerId;
  let socketToUse = socket;
  if (environnement == "test-app") {
    socketToUse = players.find((player) => player.id == id).socket;
  }
  action = action.id;
  console.log("Do Action :>> ", { action, actionType });
  socketToUse.emit("doAction", { action, actionType });
}

window.doAction = doAction;

export function doActionFromHandDeck() {
  let socketToDoAction = socket;

  // Si c'est déjà un objet, on ne parse pas
  let cardsElement = document.querySelectorAll(
    ".handDeck [data-card-id].selected",
  );

  if (cardsElement.length === 0) {
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
  let cardsId = Array.from(cardsElement).map((card) =>
    card.getAttribute("data-card-id"),
  );
  let action = actionOnHand.id;
  let actionType = action.type || "default";
  let params = { selectedCards: cardsId };
  let id = currentPlayer.id;
  console.log(
    "Do Action :>> ",
    actionOnHand.name + " [" + action + "] with cards : ",
    cardsId,
  );

  socketToDoAction.emit("doAction", { action, actionType, params });
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
  cardElement.addEventListener("dblclick", () => {
    doActionFromHandDeck(card);
  });
  // Ici, vous pouvez stocker la carte sélectionnée dans une variable globale ou l'envoyer au serveur pour traitement
}

window.selectCardForAction = selectCardForAction;

const clickHandlers = new Map();
const dblclickHandlers = new Map();
export function listenActionsOnDeck() {
  let clickTimeout;
  for (const deck of clickHandlers.keys()) {
    if (!document.body.contains(deck)) {
      clickHandlers.delete(deck);
      dblclickHandlers.delete(deck);
    }
  }
  document.querySelectorAll(".handDeck").forEach((deck) => {
    if (clickHandlers.has(deck)) {
      console.log("remove existants action on click on deck");
      deck.removeEventListener("click", clickHandlers.get(deck));
    }
    if (dblclickHandlers.has(deck)) {
      console.log("remove existants action on dbl click on deck");
      deck.removeEventListener("dblclick", dblclickHandlers.get(deck));
    }

    const handleClick = (event) => {
      console.log("click !");
      const card = event.target.closest("[data-card-id]");
      if (!card) {
        console.log(event);
        console.log("Clicked outside of a card, ignoring.");
        return;
      }
      clearTimeout(clickTimeout);

      // time out pour differencier click et dlb click
      clickTimeout = setTimeout(() => {
        console.log("Clic simple sur :", card);
        if (card.classList.contains("hoverable")) {
          card.classList.toggle("selected");
        }
      }, 250);
    };
    const handleDblClick = (event) => {
      console.log("dbl click !");
      clearTimeout(clickTimeout);

      const card = event.target.closest("[data-card-id]");
      if (!card) {
        console.log(event);
        console.log("Clicked outside of a card, ignoring.");
        return;
      }
      console.log("Double-clic sur :", card);

      if (card.classList.contains("selected")) {
        doActionFromHandDeck(card.dataset.cardId);
      } else {
        document.querySelectorAll(".handDeck [data-card-id]").forEach((c) => {
          c.classList.remove("selected");
        });
      }
    };

    deck.addEventListener("click", handleClick);
    deck.addEventListener("dblclick", handleDblClick);
    if (deck) {
      console.log("add on click on deck");
      console.log("add on dblclick on deck");
      console.log(deck);
    } else {
      console.warn(
        "No deck element found to add click listeners for hand/deck actions",
      );
    }
    clickHandlers.set(deck, handleClick);
    dblclickHandlers.set(deck, handleDblClick);
  });
}
