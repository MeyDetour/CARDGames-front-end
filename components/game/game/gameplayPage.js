import { button } from "../../button/button.js";
import { defaultCard } from "../../defaultCard/defaultCard.js";
import { gameplay_identityContainer } from "./identityContainer/identityContainer.js";
import { reloadComposant_gameplayPlayers } from "./players/players.js";
import {
  getCurrentPlayer,
  getGameData,
} from "../../../src/controller/game/dataStorage.js";
import { displayError } from "../../../src/controller/error.js";
import { removeMessageNotification } from "../../../src/controller/game/messages.js";
import { messaegerieComponent } from "../../messagerie/messagerie.js";
import { gameplay_messageOfLoading } from "./messageOfLoading/messageOfLoading.js";
import { gameplay_displayAllPlayers } from "./players/players.js";
import {
  gameplay_handdeck,
  reloadComposant_gameplayHanddeck,
} from "./handdeck/handdeck.js";
import {
  gameplay_actionsButtons,
  reloadComposant_gameplayActionsButtons,
} from "./actionsButtons/actionsButtons.js";
import { gameplay_menu } from "./menu/menu.js";
import { gameplay_globalValues , reloadComposant_gameplayGlobalValues } from "./globalValues/globalValues.js";



export default function gameplayPage() {
  let currentPlayer = getCurrentPlayer();
  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display game");
    return;
  }
  if (!currentPlayer) {
    displayError("No current player found to display game");
    return;
  }
  let points = 45;
  let actions =
    currentPlayer.actions && currentPlayer.actions.value
      ? currentPlayer.actions.value
      : [];
  let handDeck =
    currentPlayer.handDeck && currentPlayer.handDeck.value
      ? currentPlayer.handDeck.value
      : [];
  let cardList = gameData.roomInDb.assets.cards;

  let params = gameData.roomInDb.params.rendering.game;
  
  return /*html */ `
        <div id="gameplayPage">
         ${gameplay_messageOfLoading(gameData.data.logs)}
         ${gameplay_globalValues(gameData.data)}
         ${gameplay_handdeck(params.displayHandDeck, handDeck, cardList)}
           ${gameplay_actionsButtons(currentPlayer.actions.value, gameData.data.currentPlayerPosition.value === currentPlayer.position, currentPlayer.id, gameData.roomId)}
            ${gameplay_menu(gameData.data.players, currentPlayer)}
                   
            ${params.displayChat ? `<div class="gameplayMessagerie-container"> </div>` : ""}
            <div class="headerButtons">
                    ${params.displayChat ? button("chat", null, null, "gamePlayeToggleMessagerie", null, "whiteButton gameplayChatButton") : ""}
                    ${button("menu", null, null, "toggleGameplayMenu", null, "whiteButton gameplayMenuButton")}
            </div>
          
            ${gameplay_displayAllPlayers(gameData, currentPlayer)}  

            
        </div>
    `;
}

// On fait un rechargement par suppresion-creation car tous les elements sont en position absolute
// dans waiting page on fait un ecrasement de contenu à partir d'une div précise car c'est un contenu en position relative
export function reloadComposant_gameplayPage() {
  if (document.querySelector("#gameplayPage")) {
    let gameData = getGameData();
    let currentPlayer = getCurrentPlayer();
    let content = document.querySelector("#gameplayPage");
    if (!content) {
      displayError("No content found to reload players");
      return;
    }

    if (!gameData) {
      displayError("No game data found to display game");
      return;
    }
    if (!currentPlayer) {
      displayError("No current player found to display game");
      return;
    }

    reloadComposant_gameplayPlayers(content, gameData, currentPlayer);
    reloadComposant_gameplayGlobalValues(content, gameData.data);
    reloadComposant_gameplayHanddeck(
      content,
      gameData.roomInDb.params.rendering.game.displayHandDeck,
      currentPlayer.handDeck.value,
      gameData.roomInDb.assets.cards,
    );
    reloadComposant_gameplayActionsButtons(
      content,
      currentPlayer.actions.value,
      gameData.data.currentPlayerPosition.value === currentPlayer.position,
      currentPlayer.id,
      gameData.roomId,
    );
  }
}
// ===============RELOAD PLAYERS==========

// ===============MESSAGERIE=============
export function gamePlayeToggleMessagerie() {
  if (
    document.querySelector("#gameplayPage .gameplayMessagerie-container .chat")
  ) {
    console.log("remove messagerie");
    let container = document.querySelector(
      "#gameplayPage .gameplayMessagerie-container",
    );
    container.style.display = "none";
    container.innerHTML = "";
  } else {
    console.log("add messagerie");
    removeMessageNotification();
    reloadComposant_messagerie_gameplayPage();
  }
}
window.gamePlayeToggleMessagerie = gamePlayeToggleMessagerie;

export function reloadComposant_messagerie_gameplayPage() {
  let content = document.querySelector(
    "#gameplayPage .gameplayMessagerie-container",
  );
  if (content) {
    content.style.display = "flex";
    content.innerHTML = messaegerieComponent();
  }
}
