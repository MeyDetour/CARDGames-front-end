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

export function doActionFromCards(origin) {
  let socketToDoAction = socket;

  // Si c'est déjà un objet, on ne parse pas
  let cardsElement = document.querySelectorAll(
    `.${origin} [data-card-id].selected`,
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
  let actionToDo;
  if (origin == "handDeckOtherPlayer") {
    actionToDo = currentPlayer.actions.value.find(
      (action) => action.actionOnHanddOtherPlayerCards,
    );
  }
  if (origin == "handDeck") {
    actionToDo = currentPlayer.actions.value.find(
      (action) => action.actionOnHand,
    );
  }
  if (!actionToDo) {
    console.error("No action found for hand/deck interaction");
    displayError("No action found for hand/deck interaction");
    return;
  }
  let ownerOfCards
  let cardsId = Array.from(cardsElement).map((card) => {
    ownerOfCards = card.getAttribute("data-origin-player-id");
    return card.getAttribute("data-card-id");
  });
  let action = actionToDo.id;
  let actionType = action.type || "default";
  let params = { selectedCards: cardsId ,selectedPlayer : ownerOfCards};
  let id = currentPlayer.id;
  console.log(
    "Do Action :>> ",
    actionToDo.name + " [" + action + "] with cards : ",
    cardsId,
  );

  socketToDoAction.emit("doAction", { action, actionType, params });
}

window.doActionFromCards = doActionFromCards;

const clickHandlers = new Map();
const dblclickHandlers = new Map();
export function listenActionsOnDeck(classToTarget) {
  let clickTimeout;
  for (const deck of clickHandlers.keys()) {
    if (!document.body.contains(deck)) {
      clickHandlers.delete(deck);
      dblclickHandlers.delete(deck);
    }
  }

  document.querySelectorAll(`.${classToTarget}`).forEach((deck) => {
    
    // enlever les anciens handlers pour éviter les doublons
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

      // recuperer la carte cliquée
      const card = event.target.closest("[data-card-id]");
      if (!card) {
        console.log(event);
        console.log("Clicked outside of a card, ignoring.");
        return;
      }
      // recuperer le type de selection (single/multiple)
      const type = event.target.closest("[data-selection-type]");
      
      // time out pour differencier click et dlb click
      clearTimeout(clickTimeout);
      clickTimeout = setTimeout(() => {

        // selectionné la carte
        console.log("Clic simple sur :", card);
        if (card.classList.contains("hoverable")) {
          card.classList.toggle("selected");

          // déselectionner les autres si le joueur ne peut en sélectionner qu'une
          if (type == "single") {
            document
              .querySelectorAll(`.${classToTarget} [data-card-id]`)
              .forEach((c) => {
                c.classList.remove("selected");
              });
          }
        }
      }, 250);
    };

    // Send cards or unselect all
    const handleDblClick = (event) => {
      console.log("dbl click !");
      clearTimeout(clickTimeout);

      // get card and type (multipole or single selection)
      const card = event.target.closest("[data-card-id]");
      const type = event.target.closest("[data-selection-type]");
      if (!card) {
        return;
      }
      console.log("Double-clic sur :", card);

      if (card.classList.contains("selected")) {
        doActionFromCards(classToTarget);
      } else {
        document
          .querySelectorAll(`.${classToTarget} [data-card-id]`)
          .forEach((c) => {
            c.classList.remove("selected");
          });
      }
    };

    deck.addEventListener("click", handleClick);
    deck.addEventListener("dblclick", handleDblClick);
    if (deck) {
      console.log("add on click on deck");
      console.log("add on dblclick on deck");
    } else {
      console.warn(
        "No deck element found to add click listeners for hand/deck actions",
      );
    }
    clickHandlers.set(deck, handleClick);
    dblclickHandlers.set(deck, handleDblClick);
  });
}
