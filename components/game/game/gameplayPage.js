import { button } from "../../button/button.js";
import { defaultCard } from "../../defaultCard/defaultCard.js";

export default function gameplayPage(gameData, currentPlayer) {
  if (!gameData) {
    displayError("No game data found to display game");

    return;
  }
  console.log(gameData);
  let points = 45;
  let displaypoints = gameData.roomInDb.params.rendering.game.displayStatistics;
  let actions =
    currentPlayer.actions && currentPlayer.actions.value
      ? currentPlayer.actions.value
      : [];
  let handDeck =
    currentPlayer.handDeck && currentPlayer.handDeck.value
      ? currentPlayer.handDeck.value
      : [];
  let cardList = gameData.roomInDb.assets.cards;
  let players = gameData.data.players;
  let displayOtherPlayerCount =
    gameData.roomInDb.params.rendering.game.displayCountAdversaryHandDeck;
  console.log("actions :>> ", actions);
  console.log("displaypoints :>> ", displaypoints);
  return /*html */ `
        <div id="gameplayPage">
            <div class="playerToolBar"  >
              ${displaypoints ? `<span class="points">${points} pts</span>` : ""}
            
              <div class="actions">
                ${actions
                  .map((action) => {
                    let mustAppear =
                      (action.actionOnlyAtPlayerTour &&
                        gameData.data.currentPlayerPosition.value ==
                          currentPlayer.id) ||
                      !action.actionOnlyAtPlayerTour;

                    if (!mustAppear) return "";

                    return /*html */ `
                        ${button(null, null, null, () => {}, action.name, "greyButton", {})}
                    `;
                  })
                  .join("")}
              </div>
            </div>
            <div class="handDeck">
                  ${handDeck
                    .map((cardId) => {
                      let carElt = cardList[cardId];
                      carElt.faceUp = true;
                      const suits = {
                        coeur: "hearts",
                        carreau: "diamonds",
                        treffle: "clubs",
                        pique: "spades",
                      };

                      carElt.suit = suits[carElt.addedAttributs.couleur] || "";
                      carElt.hoverable = true;
                      return defaultCard(carElt);
                    })
                    .join("")}
            </div>
            ${players
              .map((player, key) => {
                if (player.id === currentPlayer.id) {
                  return "";
                }

                return /*html */ `<div key=${key} data-player-id="${player.id}" class="player player${key} playerCount${players.length}">
                 
                <div class="identityContainer">
                    <div class="playerImageContainer">
                        <img src="/assets/images/template-player.png" alt="avatar" />
                    </div>
                    <span>${player.pseudo}</span>
                </div>
                <div class="rightStatContainer">
                       ${
                         displayOtherPlayerCount
                           ? /*html */`<div class="playerHandDeck">
                                            <span class="handDeckCount">${player.handDeck.value.length} cartes</span>
                                        </div>
                                  `
                           : ""
                       }
                </div>
                    </div>`;
              })
              .join("")}
          
           
        </div>
    `;
}
