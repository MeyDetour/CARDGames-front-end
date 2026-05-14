/*
    displayOtherPlayerCount: boolean to determine if the number of cards in the other players' hands should be displayed. This is useful for games where players have hidden hands, and it adds an element of strategy and suspense to the game. By showing the card count, players can make informed decisions based on how many cards their opponents have left, which can influence their gameplay choices.
    player: the player object containing information about the player, such as their pseudo, id, handDeck, etc.
    key: a unique identifier for the player, often used in rendering lists of players to help with efficient updates and rendering in frameworks like React.
    isCurrentPlayerTurn: a boolean indicating whether it is currently this player's turn, which can be used to highlight the player's identity container or provide visual cues to indicate that it's their turn.
    totalPlayerCount: the total number of players in the game, which can be used for styling purposes (e.g., adjusting the layout based on the number of players).
*/

export function gameplay_playerImage(player, params) {
  return /*html */ `
            <div  data-player-id="${player.id}" class="player player${params.key} playerCount${params.totalPlayerCount}  ${params.isCurrentPlayerTurn ? "currentPlayerTurn" : ""} ${params.className ? params.className : ""}">               
            
                <div class="playerImageContainer ${player.skin ? "withSkin" : ""}">
                    <img src="${player.skin ? "/assets/images/spooky-skins/" + player.skin.name + ".png" : "/assets/images/template-player.png"}" alt="avatar" />
                </div> 
                ${params.isCurrentPlayerTurn? (Array(15).fill().map((_, index) => `
                    <div class="light-${index + 1}"></div>
                `).join('')) : ""}
                   
                    <span class="pseudo">${player.pseudo}</span>   
                  
            </div>`;
}
