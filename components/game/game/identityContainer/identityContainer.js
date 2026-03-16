import { statsValues } from "../statsValues/statsValues.js";
/*
    displayOtherPlayerCount: boolean to determine if the number of cards in the other players' hands should be displayed. This is useful for games where players have hidden hands, and it adds an element of strategy and suspense to the game. By showing the card count, players can make informed decisions based on how many cards their opponents have left, which can influence their gameplay choices.
    player: the player object containing information about the player, such as their pseudo, id, handDeck, etc.
    key: a unique identifier for the player, often used in rendering lists of players to help with efficient updates and rendering in frameworks like React.
    isCurrentPlayerTurn: a boolean indicating whether it is currently this player's turn, which can be used to highlight the player's identity container or provide visual cues to indicate that it's their turn.
    totalPlayerCount: the total number of players in the game, which can be used for styling purposes (e.g., adjusting the layout based on the number of players).
*/

export function identityContainer(
  player,
  key,
  isCurrentPlayerTurn,
  totalPlayerCount,
  displayOtherPlayerCount,
  gainList,
) {
  return /*html */ `<div  data-player-id="${player.id}" class="player player${key} playerCount${totalPlayerCount}  ${isCurrentPlayerTurn ? "currentPlayerTurn" : ""}">
                 
                <div class="identityContainer">
                    <div class="playerImageContainer">
                        <img src="/assets/images/template-player.png" alt="avatar" />
                    </div>
                    <span>${player.pseudo}</span>
                </div>
                <div class="rightStatContainer">
                           ${statsValues({ displaypoints: displayOtherPlayerCount, gainList: gainList }, player)}                     
                </div>
                    </div>`;
}
