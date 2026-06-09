import { defaultCard } from "../../../defaultCard/defaultCard.js";
import { customCard } from "../../../customCard/customCard.js";
import {
  getCurrentPlayer,
  getGameData,
} from "../../../../src/controller/game/dataStorage.js";
import { displayError } from "../../../../src/controller/error.js";
import { getCardSort } from "../../../../src/controller/game/dataStorage.js";
import { isPassifPlayer } from "../../../../src/controller/game/players.js";
import { getPlayerOfCurrentView } from "../../../../src/controller/game/players.js";
import { environnement } from "../../../../main.js";
import { listenActionsOnDeck } from "../../../../src/controller/game/actions.js";

// Separate component for the player's hand deck in the gameplay page
// Separe les cartes du joueurs en plusieurs tas de 11 cartes
// maximum pour éviter les problèmes d'affichage et de superposition
export function gameplay_handdeck(
  displayHandDeck,
  handDeck,
  cardList,
  cardListToSelect,
  paramsPlayerHand,
  cardsParams,
  canDoAction,
  currentPlayer,
) {
  if (!displayHandDeck) {
    return "";
  }
  if (!handDeck || handDeck.length === 0) {
    return "";
  }
  if (isPassifPlayer(currentPlayer)) {
    return "";
  }
  if (
    paramsPlayerHand?.template
      ? paramsPlayerHand.template.includes("grid")
      : false
  ) {
    const rows = parseInt(
      paramsPlayerHand.template.split("grid")[1].split("x")[0],
    ); // Extrait le nombre de colonnes du template
    const cols = parseInt(
      paramsPlayerHand.template.split("grid")[1].split("x")[1],
    ); // Extrait le nombre de lignes du template
    let html = `<div class="handDeck handDeck-grid" style="grid-template-rows: repeat(${rows}, 1fr); grid-template-columns: repeat(${cols}, 1fr);" id="${new Date().getTime()}">`;
    for (let i = 0; i < handDeck.length; i++) {
      const cardId = handDeck[i];
      let carElt = cardList[cardId];
      carElt.faceUp = true;
      carElt.hoverable = cardListToSelect.includes(cardId);
      if (carElt.type == "french_standard") {
        const suits = {
          coeur: "hearts",
          carreau: "diamonds",
          trefle: "clubs",
          pique: "spades",
        };

        carElt.suit = suits[carElt.addedAttributs.couleur] || "";

        html += defaultCard(carElt, canDoAction, "", "handDeck");
      } else {
        html += customCard(carElt, cardsParams, canDoAction, "", "handDeck");
      }
    }
    html += `</div>`;
    return html;
  } else {
    let sort = getCardSort();
    let sortedHandDeck = [...handDeck];

    // TRI PAR COULEUR
    if (sort === "value") {
      sortedHandDeck.sort((a, b) => {
        const cardA = cardList[a];
        const cardB = cardList[b];

        if (!cardA || !cardB) return 0;

        if (
          cardA.value === cardB.value &&
          cardA.type == "french_standard" &&
          cardB.type == "french_standard"
        ) {
          const colorOrder = { coeur: 1, carreau: 2, trefle: 3, pique: 4 };
          return (
            (colorOrder[cardA.addedAttributs.couleur] || 0) -
            (colorOrder[cardB.addedAttributs.couleur] || 0)
          );
        }

        return (cardA.value || 0) - (cardB.value || 0);
      });
    }

    // TRI PAR VALEUR
    if (sort === "color") {
      const colorOrder = {
        coeur: 1,
        carreau: 2,
        trefle: 3,
        pique: 4,
      };

      sortedHandDeck.sort((a, b) => {
        const cardA = cardList[a];
        const cardB = cardList[b];

        if (cardA.type != "french_standard" || cardB.type != "french_standard")
          return 0;
        if (!cardA || !cardB) return 0;

        const orderA = colorOrder[cardA.addedAttributs.couleur] || 0;
        const orderB = colorOrder[cardB.addedAttributs.couleur] || 0;

        // Si les couleurs sont les mêmes, on trie par valeur
        if (orderA === orderB) {
          return (cardA.value || 0) - (cardB.value || 0);
        }

        return orderA - orderB;
      });
    }

    // AFFICHAGE DES CARTES LIMITÉES À 11 PAR RANGÉE
    let html = "";
    const chunkSize = 11;
    const indexMax = Math.ceil(sortedHandDeck.length / chunkSize);
    for (let i = 0; i < sortedHandDeck.length; i += chunkSize) {
      const chunk = sortedHandDeck.slice(i, i + chunkSize);
      const index = Math.floor(i / chunkSize) + 1;
      html += getHandDeckLine(
        chunk,
        cardList,
        cardListToSelect,
        index,
        indexMax,
        cardsParams,
        canDoAction,
      );
    }
    return html;
  }
}
// affiche une rangée de carte
function getHandDeckLine(
  cards,
  cardList,
  cardListToSelect,
  index,
  max,
  cardsParams,
  canDoAction,
) {
  const inclinaisonMin = -15;
  return /*html */ `
    <div class="handDeck handDeck-${index}" style="z-index: ${max - index}; transform: translate(-50%,-${index * 40}px);" id="handDeck-${new Date().getTime()}">
      ${cards
        .map((cardId,key) => {
          let carElt = cardList[cardId]; 
          if (!carElt) {
            console.warn(
              `Card with ID ${cardId} not found in cardList.`,
            );
            return "";
          }
          carElt.faceUp = true;
          carElt.hoverable = cardListToSelect.includes(cardId);
          const style=`
                margin-bottom: ${Math.abs(key-(cards.length-1)/2)*(-9.5)}px; 
                scale: ${1-(Math.abs(key-(cards.length-1)/2)/(cards.length-1)*0.2)}; 
                rotate: ${inclinaisonMin+(Math.abs(inclinaisonMin)*2/(cards.length-1))*key}deg; 
                box-shadow: ${key==0 ? "-11px" : "11px"} 13px  6px -6px #191717; 
          `
          if (carElt.type == "french_standard") {
            const suits = {
              coeur: "hearts",
              carreau: "diamonds",
              trefle: "clubs",
              pique: "spades",
            };

            carElt.suit =
              suits[carElt.addedAttributs.couleur] || "";

            return defaultCard(carElt, canDoAction,  style ,"handDeck");
          } else {
            return customCard(
              carElt,
              cardsParams,
              canDoAction,
              "hand",style,"handDeck");
          }
        })
        .join("")}
                </div>
     `;
}
// use to re sort hand deck
export function autoReloadComposant_gameplayHanddeck() {
  console.log("--autoreload handdeck  --");
  let content = document.querySelector("#gameplayPage");
  if (!content) {
    displayError("No content found to reload players");
    return;
  }

  let gameData = getGameData();
  if (!gameData) {
    displayError("No game data found to display game");
    return;
  }
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
  reloadComposant_gameplayHanddeck(
    content,
    gameData.roomInDb.params.rendering.game.displayHandDeck,
    currentPlayer.handDeck.value,
    gameData.roomInDb.assets.cards,
    currentPlayer.cardsSelectableForActionOnHand?.value,
    gameData.roomInDb.params.rendering.playerHand,
    actionOnHand,
    currentPlayer,
  );
}

// reload game deck
export function reloadComposant_gameplayHanddeck(
  content,
  displayHandDeck,
  handDeck,
  cardList,
  cardListToSelect,
  playerHandParams,
  cardsParams,
  canDoAction,
  currentPlayer,
) {
  console.log("-- reload handdeck --");
  document.querySelectorAll(".handDeck").forEach((elt) => {
    console.log("remove ");
    console.log(elt);
    elt.remove();
  });
  if (!currentPlayer) {
    displayError("No current player found to display game");
    console.warn("params : ", {
      content,
      displayHandDeck,
      handDeck,
      cardList,
      playerHandParams,
      cardsParams,
      canDoAction,
      currentPlayer,
    });
    return;
  }
  console.log(currentPlayer);
  console.log(canDoAction);
  content.innerHTML += gameplay_handdeck(
    displayHandDeck,
    handDeck,
    cardList,
    cardListToSelect,
    playerHandParams,
    cardsParams,
    canDoAction,
    currentPlayer,
  );

  setTimeout(() => {
    listenActionsOnDeck("handDeck");
  }, 1000);
}
