import { button } from "../../button/button.js";
import { defaultCard } from "../../defaultCard/defaultCard.js";
import { identityContainer } from "./identityContainer/identityContainer.js";
import { originalGameData } from "../../../gameData.js";
import { statsValues } from "./statsValues/statsValues.js";
export default function gameplayPage() {
  const currentPlayer = {
    position: 1,
    pseudo: "zvml,zv",
    socketID: "FBZRkLFYoBB5onM8AAAJ",
    id: "1q6lvq",
    currentBet: {
      type: "number",
      value: 2,
    },
    attachedEventForTour: {
      type: "array",
      value: [],
    },
    gain: {
      type: "object",
      value: {
        1: {
          value: 6248,
        },
      },
    },
    handDeck: {
      type: "cardList",
      value: [29, 45],
    },
    personalHandDeck: {
      type: "cardList",
      value: [],
    },
    personalHandDiscard: {
      type: "cardList",
      value: [],
    },
    hasPlayed: {
      type: "boolean",
      value: false,
    },
    haswin: {
      type: "boolean",
      value: false,
    },
    actions: {
      type: "array",
      value: [
        {
          id: 1,
          name: "Se coucher",
          condition: null,
          appearAtPlayerTurn: true,
          withValue: [
            {
              id: 7,
              player: "{currentPlayer}",
            },
            {
              id: 1,
              inputBool: true,
              player: "{currentPlayer}",
            },
          ],
        },
        {
          id: 2,
          name: "miser",
          type: "askPlayer",
          appearAtPlayerTurn: true,
          condition:
            "comp({currentPlayer#gain#1};isSuperiorNumber;{currentBet})",
          withValue: [
            {
              id: 11,
              player: "{currentPlayer}",
            },
          ],
        },
        {
          id: 4,
          name: "Check",
          appearAtPlayerTurn: true,
          condition:
            "comp({currentPlayer#currentBet};isEqualNumber;{currentBet})",
          withValue: [
            {
              id: 1,
              inputBool: true,
              player: "{currentPlayer}",
            },
          ],
        },
        {
          id: 5,
          name: "Tapis",
          appearAtPlayerTurn: true,
          condition:
            "exp(comp({currentPlayer#currentBet};isInferiorOrEqual;{currentBet})&&comp({currentPlayer#gain#1};isSuperiorNumber;0))",
          withValue: [
            {
              id: 14,
              type: "withValueEvent",
              player: "{currentPlayer}",
              inputNumber: "{currentPlayer#gain#1}",
            },
            {
              id: 3,
              inputNumber: "{currentPlayer#currentBet}",
            },
            {
              id: 1,
              inputBool: true,
              player: "{currentPlayer}",
            },
            {
              id: 8,
              inputBool: true,
            },
          ],
        },
      ],
    },
    roles: {
      type: "array",
      value: [
        {
          nom: "dealer",
          attribution: "{startPlayer}",
        },
      ],
    },
  };

  let gameData = window.gameData || originalGameData;
  window.gameData = gameData;
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
  let gainList = gameData.roomInDb.assets.gains;
  let players = gameData.data.players;
  let displayOtherPlayerCount =
    gameData.roomInDb.params.rendering.game.displayCountAdversaryHandDeck;
  console.log("actions :>> ", actions);

  return /*html */ `
        <div id="gameplayPage">

            <div class="playerToolBar"  >
                    <div class="leftStat">
                        ${statsValues({displaypoints :displaypoints, gainList : gainList},currentPlayer)}                    
                    </div>
                    <div class="middle">
                      ${actions
                        .map((action) => {
                          let mustAppear =
                            !action.appearAtPlayerTurn ||
                            (action.appearAtPlayerTurn &&
                              gameData.data.currentPlayerPosition.value ===
                                currentPlayer.position);
                                
                          if (!mustAppear) return "";

                          return /*html */ `
                              ${button(null, null, null, "doAction", action.name, "greyButton", {
                                "playerId":currentPlayer.id,
                                "roomId":gameData.roomId,
                                "action":action.name,
                                "actionType":action.type || "default"
                              })}
                          `;
                        })
                        .join("")}
                    </div>
                    <div class="right">
                        <div  data-player-id="${currentPlayer.id}" class="player currentPlayer ${gameData.data.currentPlayerPosition.value == currentPlayer.position ? "currentPlayerTurn" : ""}">  
                          <div class="identityContainer ">
                              <div class="playerImageContainer">
                                  <img src="/assets/images/template-player.png" alt="avatar" />
                              </div>
                              <span>${currentPlayer.pseudo}</span>
                          </div> 
                        </div>
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
                return identityContainer(
                  player,
                  key,
                  gameData.data.currentPlayerPosition.value === player.position,
                  players.length,
                  displayOtherPlayerCount,
                  gainList
                );
              })
              .join("")}
              

            ${button(null, null, null, "changeTour", "changer le tour", "greyButton", {})}
           
        </div>
    `;
}

export function reloadComposant_gameplayPage() {
  let content = document.querySelector("#content");

  content.innerHTML = gameplayPage();
}
