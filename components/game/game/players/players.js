import { gameplay_playerImage } from "../playerImage/playerImage.js";
export function gameplay_displayAllPlayers(gameData, currentPlayer, params) {
  if (!gameData) {
    displayError("No game data found to display game");
    return "";
  }

  // Afficher tous les joueurs suivant l'ordre de la position du joueur actuel
  let nextPlayers = [];
  let beforePlayers = [];
  let isNextCurrentPlayer = false;
  for (let i = 0; i < gameData.data.players.length; i++) {
    const player = gameData.data.players[i];

    if (player.id == currentPlayer.id) {
      isNextCurrentPlayer = true;
    } else {
      if (isNextCurrentPlayer) {
        nextPlayers.push(player);
      } else {
        beforePlayers.push(player);
      }
    }
  }
  let players = [...nextPlayers, ...beforePlayers];
 
  // on doit séparé le joueur actuel, ca permet d'avoir player1 player2 pour les autres joueurs sans sauté une valeur à cause du joueur actuel

  return /*html */ ` 
        ${
          !gameData.data.spectators.some(
            (spectator) => spectator.id === currentPlayer.id,
          )
            ? gameplay_playerImage(currentPlayer, {
                key: 0,

                totalPlayerCount: players.length + 1,
                isCurrentPlayerTurn:
                  gameData.data.currentPlayerPosition.value ===
                  currentPlayer.position,
              })
            : ""
        }
            ${players
              .map((player, key) =>
                gameplay_playerImage(player, {
                  key: key + 1,

                  totalPlayerCount: players.length + 1,
                  isCurrentPlayerTurn:
                    gameData.data.currentPlayerPosition.value ===
                    player.position,
                }),
              )
              .join("")}
    `;
}

export function reloadComposant_gameplayPlayers(
  selector,
  gameData,
  currentPlayer,
) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.querySelectorAll(".player").forEach((playerElt) => {
    playerElt.remove();
  });
  const anchor = el.querySelector(".gameplayGlobalValues, .center");
  if (anchor) {
    anchor.insertAdjacentHTML(
      "beforebegin",
      gameplay_displayAllPlayers(gameData, currentPlayer),
    );
  } else {
    el.insertAdjacentHTML(
      "beforeend",
      gameplay_displayAllPlayers(gameData, currentPlayer),
    );
  } 
}
