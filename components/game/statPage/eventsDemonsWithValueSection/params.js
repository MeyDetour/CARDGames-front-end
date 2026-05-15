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
      <span class="span"><b>Pioche :</b> ${gameData.roomInDb.params.cards.deck.activation}</span>
      <span class="span"><b>Visibilité de la prochaine carte à piocher :</b> ${gameData.roomInDb.params.cards.deck.renderTheNextDeckCard}</span>

      <span class="span"><b>Défausse :</b> ${gameData.roomInDb.params.cards.discard.activation}</span>
      <span class="span"><b>Visibilité de la dernière carte défaussée :</b> ${gameData.roomInDb.params.cards.discard.renderTheLastDiscardedCard}</span>
    
      <span class="span"><b>Main du joueur :</b> ${gameData.roomInDb.params.cards.hand.activation}</span>
      <span class="span"><b>Visibilité de la main du joueur :</b> ${gameData.roomInDb.params.cards.hand.renderAllHandCards}</span>

      <span class="span"><b>Autorise les spectacteurs :</b> ${gameData.roomInDb.params.globalGame.autoriseSpectator}</span>
    </div>  
  </details> 
   <details class="statEventsDemonsWithValueSectionParamsSection-actions">
    <summary>Actions</summary>
    <div class="wrapper"> 
    ${gameData.roomInDb.params?.tours?.actions
      .map(
        (action) => /*html */ `
      <div class="actionConfig">
        <h4 class="span">Name : ${action.name}</h4>
        <span class="span"><b>Id :</b> ${action.id}</span>
        <span class="span"><b>Condition :</b> ${action.condition}</span>
        <span class="span"><b>Apparition au tour :</b> ${action.appearAtPlayerTurn ? "Oui" : "Non"}</span>
        <span class="span"><b>S'applique sur les cartes :</b> ${action.actionOnHand ? "Oui" : "Non"}</span>
       ${
         action.actionOnHand
           ? `
            <span class="span"><b>Condition de selection d'une carte :</b> ${action.conditionOfCardSelection}</span>
            <span class="span"><b>Selection minimale :</b> ${action.numberOfCardToSelectMin}</span>
            <span class="span"><b>Selection maximale :</b> ${action.numberOfCardToSelectMax}</span>
          `
           : ""
       }
        <span class="span"><b>S'applique sur la défausse :</b> ${action.actionOnDiscardDeck ? "Oui" : "Non"}</span>
        <span class="span"><b>S'applique sur le deck :</b> ${action.actionOnDeck ? "Oui" : "Non"}</span>
        <span class="span"><b>Demande une valeur :</b> ${action.askValueToPlayThisAction ? "Oui" : "Non"}</span>
        ${
          action.askValueToPlayThisAction
            ? `
            <span class="span"><b>Type de valeur :</b> ${action.askValueType}</span>
            <span class="span"><b>Valeur minimale :</b> ${action.askValueMin}</span>
            <span class="span"><b>Valeur maximale :</b> ${action.askValueMax}</span>
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
