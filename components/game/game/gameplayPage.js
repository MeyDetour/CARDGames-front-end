import { button } from "../../button/button.js";
import { defaultCard } from "../../defaultCard/defaultCard.js";
import { gameplay_playerImage } from "./playerImage/playerImage.js";
import { reloadComposant_gameplayPlayers } from "./players/players.js";
import { environnement } from "../../../main.js";
import { getPlayerOfCurrentView } from "../../../src/controller/game/players.js";
import {
  getCurrentPlayer,
  getGameData,
} from "../../../src/controller/game/dataStorage.js";
import { getView } from "../../../src/controller/game/dataStorage.js";
import { displayError } from "../../../src/controller/error.js";
import { removeMessageNotification } from "../../../src/controller/game/messages.js";
import { messaegerieComponent } from "../../messagerie/messagerie.js";
import {
  gameplay_messageOfLoading,
  reloadComposant_gameplayMessageOfLoading,
} from "./messageOfLoading/messageOfLoading.js";
import { gameplay_displayAllPlayers } from "./players/players.js";
import { 
  gameplay_middleCards,
  reloadComposant_gameplayMiddleCards,
} from "./middleCards/middleCards.js";

import {
  gameplay_handdeck,
  reloadComposant_gameplayHanddeck,
} from "./handdeck/handdeck.js";
import {
  gameplay_actionsButtons,
  gameplay_actionButton,
  reloadComposant_gameplayActionsButtons,
} from "./actionsButtons/actionsButtons.js";
import { gameplay_menu, hideGameplayMenu } from "./menu/menu.js";
import {
  gameplay_playerValues,
  reloadComposant_gameplayPlayerValues,
} from "./playerValues/playerValues.js";
import {
  gameplay_globalValues,
  reloadComposant_gameplayGlobalValues,
} from "./globalValues/globalValues.js";
import {
  gameplay_cardPile,
  autoreloadComposant_gameplayCardPile
} from "./cardPile/cardPile.js";
import {
  reloadComposant_gameplaySpectatorBanniere,
  gameplay_spectatorBanniere,
} from "./spectatorBanniere/spectatorBanniere.js";
import { serializeParams } from "../../../src/helpers/serializer.js";
import { listenActionsOnDeck } from "../../../src/controller/game/actions.js";
export default function gameplayPage() {
  let currentPlayer;
  let view;
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  }
  if (environnement == "test-app") {
    currentPlayer = getPlayerOfCurrentView();
    view = getView();
  }
  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display game");
    return "";
  }
  if (gameData.data.state.value !== "inProgress") {
    console.warn("room is not in progress");
    return "";
  }
  if (!currentPlayer) {
    displayError("No current player found to display game");
    console.warn("No current player found");
    return "";
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
  let gainList = gameData.roomInDb.assets.gains;

  let params = gameData.roomInDb.params.rendering.game;
  let cardParams = gameData.roomInDb.params.cards;

  let playerActions = currentPlayer.actions.value;
  let actionOnDeck = playerActions.find((action) => action.actionOnDeck);
  let actionOnHand = playerActions.find((action) => action.actionOnHand);
  let actionOnDiscardDeck = playerActions.find(
    (action) => action.actionOnDiscardDeck,
  );
  setTimeout(() => {
    listenActionsOnDeck();
  }, 1000);

  return /*html */ `
        <div id="gameplayPage" class="${environnement}">

       ${gameplay_messageOfLoading(gameData.data.logs)}
       ${gameplay_handdeck(
         params.displayHandDeck,
         handDeck,
         cardList,
         currentPlayer.cardsSelectableForActionOnHand?.value??[],
         gameData.roomInDb.params.rendering.playerHand,
         gameData.roomInDb.params.cards,
         actionOnHand,
       )}
         ${gameplay_spectatorBanniere(currentPlayer)}
         

    
     
         
         ${gameplay_actionButton(
           playerActions.filter(
             (a) => !a.actionOnDeck && !a.actionOnDiscardDeck,
           ),
           gameData.data.currentPlayerPosition.value === currentPlayer.position,
           currentPlayer,
           gameData.roomId,
         )}
        ${gameplay_menu(gameData.data.players, currentPlayer)} 
                   
            ${params.displayChat ? `<div class="gameplayMessagerie-container"> </div>` : ""}
         
          <div class="headerButtons">
                    ${environnement == "test-app" ? button("scale-white", null, null, "testAppOpenLargeScreen", null, "whiteButton gameplayScreenButton") : ""}
                    ${params.displayChat ? button("chat", null, null, "gamePlayeToggleMessagerie", null, "whiteButton gameplayChatButton") : ""}
                    ${button("menu", null, null, "toggleGameplayMenu", null, "whiteButton gameplayMenuButton")}
            </div>
        ${gameplay_playerValues(getPlayerOfCurrentView(), {
          key: 0,
          displayPoints: params.displayStatistics,
          dislayCardCount: params.displayCountAdversaryHandDeck,
          gainList: gainList,
        })}
          

            <div class="table">

            ${gameplay_middleCards(gameData)}  
            ${gameplay_displayAllPlayers(gameData, currentPlayer, params)}  
            ${environnement == "player-app" ? gameplay_globalValues({ ...gameData.data, ...gameData.data.globalValueStatic }) : ""}
              
              <div class="center">
                  ${gameplay_cardPile(
                    cardParams,
                    actionOnDeck
                      ? {
                          playerId: currentPlayer.id,
                          roomId: gameData.roomId,
                          action: actionOnDeck ? actionOnDeck : null,
                          actionType: actionOnDeck
                            ? actionOnDeck.type || "default"
                            : "default",
                        }
                      : null,
                    "deck",
                    "Pioche",
                    gameData.roomInDb.params?.cards?.deck
                      ?.renderTheNextDeckCard,
                    gameData.data.deck.value.map((cardId) => {
                      return gameData.data.cards[cardId];
                    }),
                  )}
                ${gameplay_cardPile(
                  cardParams,
                  actionOnDiscardDeck
                    ? {
                        playerId: currentPlayer.id,
                        roomId: gameData.roomId,
                        action: actionOnDiscardDeck
                          ? actionOnDiscardDeck
                          : null,
                        actionType: actionOnDiscardDeck
                          ? actionOnDiscardDeck.type || "default"
                          : "default",
                      }
                    : null,
                  "discardDeck",
                  "Défausse",
                  gameData.roomInDb.params.cards.discard
                    .renderTheLastDiscardedCard,
                  gameData.data.discardDeck.value.map((cardId) => {
                    return gameData.data.cards[cardId];
                  }),
                )}
               
            </div>
            </div>
        </div>
    `;
}

// On fait un rechargement par suppresion-creation car tous les elements sont en position absolute
// dans waiting page on fait un ecrasement de contenu à partir d'une div précise car c'est un contenu en position relative
export function reloadComposant_gameplayPage() {
  console.log("========RELOAD GAME PLAY PAGE============");

  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display game");
    return;
  }
  if (gameData.data.state.value !== "inProgress") {
    return;
  }

  let content = document.querySelector("#gameplayPage");
  if (!content) {
    if (environnement == "test-app") {
      document.querySelector("#gamePlayPageContainer").innerHTML =
        gameplayPage();
      return;
    } else {
      document.querySelector("#content").innerHTML = gameplayPage();
    }
    return;
  }
  let table = content.querySelector(".table");
  if (!table) {
    return;
  }
  let center = table.querySelector(".center");
  if (!center) {
    return;
  }
  let params = gameData.roomInDb.params.rendering.game;
  let gainList = gameData.roomInDb.assets.gains;

  let currentPlayer;
  if (environnement == "player-app") {
    currentPlayer = getCurrentPlayer();
  }
  if (environnement == "test-app") {
    currentPlayer = getPlayerOfCurrentView();
  }
  if (!currentPlayer) {
    displayError("No current player found to display game");
    return;
  } 
  let playerActions = currentPlayer.actions.value;
  let actionOnHand = playerActions.find((action) => action.actionOnHand);
  let actionOnDeck = playerActions.find((action) => action.actionOnDeck);
  let actionOnDiscardDeck = playerActions.find(
    (action) => action.actionOnDiscardDeck,
  );

  reloadComposant_gameplayMessageOfLoading("#gameplayPage", gameData.data.logs);
  reloadComposant_gameplayPlayers(
    "#gameplayPage .table",
    gameData,
    currentPlayer,
  );
  reloadComposant_gameplayGlobalValues("#gameplayPage .table", {
    ...gameData.data,
    ...gameData.data.globalValueStatic,
  });
  reloadComposant_gameplayMiddleCards("#gameplayPage .table", {});
  reloadComposant_gameplaySpectatorBanniere(content, currentPlayer);
  reloadComposant_gameplayPlayerValues(content, getPlayerOfCurrentView(), {
    key: 0,
    displayPoints: params.displayStatistics,
    dislayCardCount: params.displayCountAdversaryHandDeck,
    gainList: gainList,
  });
  reloadComposant_gameplayHanddeck(
    content,
    gameData.roomInDb.params.rendering.game.displayHandDeck,
    currentPlayer.handDeck.value,
    gameData.roomInDb.assets.cards,
    currentPlayer.cardsSelectableForActionOnHand?.value?? [],
    gameData.roomInDb.params.rendering.playerHand,
    gameData.roomInDb.params.cards,
    actionOnHand,
  );
  listenActionsOnDeck();
  reloadComposant_gameplayActionsButtons(
    content,
    playerActions.filter((a) => !a.actionOnDeck && !a.actionOnDiscardDeck),
    gameData.data.currentPlayerPosition.value === currentPlayer.position,
    currentPlayer,
    gameData.roomId,
  );
   
    autoreloadComposant_gameplayCardPile("deck")
    autoreloadComposant_gameplayCardPile("discardDeck")
}
// ===============TEST APP - SCALE SCREEN==========

export function testAppOpenLargeScreen() {
  console.log("Open large screen");
  document
    .querySelector(".gameplayPageContainer")
    .classList.toggle("fullScreen");
  let img = document.querySelector(
    ".gameplayPageContainer #gameplayPage .headerButtons .gameplayScreenButton img",
  );
  if (img) {
    let newImage = img.src.includes("/assets/scale-white.svg")
      ? "/assets/unscale-white.svg"
      : "/assets/scale-white.svg";
    img.src = newImage;
  } else {
    console.warn("No image found to change in testAppOpenLargeScreen");
  }
}
window.testAppOpenLargeScreen = testAppOpenLargeScreen;

// ===============MESSAGERIE=============
export function gamePlayeToggleMessagerie() {
  if (
    document.querySelector("#gameplayPage .gameplayMessagerie-container .chat")
  ) {
    hideGamePlayMessagerie();
  } else {
    console.log("add messagerie");
    hideGameplayMenu();
    removeMessageNotification();
    reloadComposant_messagerie_gameplayPage();
  }
}
window.gamePlayeToggleMessagerie = gamePlayeToggleMessagerie;

export function hideGamePlayMessagerie() {
  console.log("remove messagerie");
  let container = document.querySelector(
    "#gameplayPage .gameplayMessagerie-container",
  );
  if (container) {
    container.style.display = "none";
    container.innerHTML = "";
  }
}

export function reloadComposant_messagerie_gameplayPage() {
  let content = document.querySelector(
    "#gameplayPage .gameplayMessagerie-container",
  );
  if (content) {
    content.style.display = "flex";
    content.innerHTML = messaegerieComponent();
  }
}
