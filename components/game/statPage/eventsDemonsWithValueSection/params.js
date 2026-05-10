import { getTextualValueOfCard } from "../../../../src/controller/game/cards.js";
import { button } from "../../../button/button.js";
export default function statEventsDemonsWithValueSectionParamsSection(
  gameData,
) {
  return /*html */ ` 

  
  <details class="statEventsDemonsWithValueSectionParamsSection-logs">
    <summary>Logs de la partie</summary>
    <div class="wrapper"> 
      ${gameData.data.logs.map((message) => /*html */ `<span>${message}</span>`).join("")}
    </div>  
  </details>
 

   
  <details class="statEventsDemonsWithValueSectionParamsSection-players">
    <summary>Joueurs</summary>
    <div class="wrapper"> 
      ${gameData.data.players
        .map(
          (player, index) => /*html */ `<div class="playerConfig">
          <div class="imageContainer">
              <img src="/assets/images/spooky-skins/${player.skin.name}.png"/>
          </div>
          <div>
            <h4 class="h4">${player.pseudo}</h4>
            ${
              gameData.admin.id !== player.id
                ? button(
                    null,
                    null,
                    null,
                    "disconnectSocket",
                    "Remove",
                    "linkApparence",
                    { id: player.id },
                  )
                : ""
            }
          </div>
      </div>`,
        )
        .join("")}
      
      ${gameData.data.spectators
        .map(
          (player, index) => /*html */ `<div class="playerConfig">
          <div class="imageContainer">
              <img src="/assets/images/spooky-skins/${player.skin.name}.png"/>
          </div>
          <div>
            <h4 class="h4">${player.pseudo} (Spectateur)</h4>
            ${
              gameData.admin.id !== player.id
                ? button(
                    null,
                    null,
                    null,
                    "disconnectSocket",
                    "Supprimer",
                    "linkApparence",
                    { id: player.id },
                  )
                : ""
            }
               ${
                 gameData.admin.id !== player.id
                   ? button(
                       null,
                       null,
                       null,
                       "changeSpectatorToPlayer",
                       "Changer en joueur",
                       "linkApparence",
                       { id: player.id },
                     )
                   : ""
               }
          </div>
      </div>`,
        )
        .join("")}
      ${button(null, null, null, "connectSocket", "Ajouter un joueur", "addButton")}
    </div>  
  </details>
   
  <details class="statEventsDemonsWithValueSectionParamsSection-players">
    <summary>Paramètres définis</summary>
    <div class="wrapper"> 
      <span class="span">Pioche : ${gameData.roomInDb.params.cards.deck.activation}</span>
      <span class="span">Visibilité du dessus : ${gameData.roomInDb.params.cards.deck.renderTheNextDeckCard}</span>

      <span class="span">Défausse : ${gameData.roomInDb.params.cards.discard.activation}</span>
      <span class="span">Visibilité de la dernière carte défaussée : ${gameData.roomInDb.params.cards.discard.renderTheLastDiscardedCard}</span>
    
      <span class="span">Main du joueur : ${gameData.roomInDb.params.cards.hand.activation}</span>
      <span class="span">Visibilité de la main du joueur : ${gameData.roomInDb.params.cards.hand.renderAllHandCards}</span>

      <span class="span">Autorise les spectacteurs : ${gameData.roomInDb.params.globalGame.autoriseSpectator}</span>
    </div>  
  </details>
  `;
}
