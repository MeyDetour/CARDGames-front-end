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
   
  <details class="statEventsDemonsWithValueSectionParamsSection-params">
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
   <details class="statEventsDemonsWithValueSectionParamsSection-actions">
    <summary>Actions</summary>
    <div class="wrapper"> 
    ${gameData.roomInDb.params?.tours?.actions
      .map(
        (action) => /*html */ `
      <div class="actionConfig">
        <span class="span">Id : ${action.id}</span>
        <span class="span">Name : ${action.name}</span>
        <span class="span">Condition : ${action.condition}</span>
        <span class="span">Apparition au tour: ${action.appearAtPlayerTurn ? "Oui" : "Non"}</span>
        <span class="span">S'applique sur les cartes : ${action.actionOnHand ? "Oui" : "Non"}</span>
       ${
         action.actionOnHand
           ? `
            <span class="span">Condition de selection d'une carte: ${action.conditionOfCardSelection}</span>
            <span class="span">Selection minimale : ${action.numberOfCardToSelectMin}</span>
            <span class="span">Selection maximale : ${action.numberOfCardToSelectMax}</span>
          `
           : ""
       }
        <span class="span">S'applique sur la défausse : ${action.actionOnDiscardDeck ? "Oui" : "Non"}</span>
        <span class="span">S'applique sur le deck : ${action.actionOnDeck ? "Oui" : "Non"}</span>
        <span class="span">Demande une valeur : ${action.askValueToPlayThisAction ? "Oui" : "Non"}</span>
        ${
          action.askValueToPlayThisAction
            ? `
            <span class="span">Type de valeur : ${action.askValueType}</span>
            <span class="span">Valeur minimale : ${action.askValueMin}</span>
            <span class="span">Valeur maximale : ${action.askValueMax}</span>
          `
            : ""
        }
      </div>
    `,
      )
      .join("")}
        
    </div>  
  </details>
  `;
}
