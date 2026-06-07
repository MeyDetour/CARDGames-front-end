import { getTextualValueOfCard } from "../../../../src/controller/game/cards.js";
import { getGainIdOfGainString } from "../../../../src/helpers/string.js";
import { formatSimpleDate } from "../../../../src/helpers/date.js";
export default function statEventsDemonsWithValueSectionDemonSection(gameData) {
  let data = gameData.data?.testLogs
    .filter(
      (log) => 
        log.testType == "trigger" 
    )
    ?.reverse();
  return ` 
         ${data
           .map((log, index) => {
             if (log.testType == "trigger") {
               let trigger = log;
               return /*html */`
                     <details class="elementDetails">
                        <summary ${index === 0 ? "style='padding-bottom: 24px;'" : ""}>
                           <img src="/assets/violet-right-arrow.svg" alt="Arrow Icon">
                           <span class="span">${trigger.name}</span>
                           ${index === 0 ? "<span class='tooltip span'>(Dernier démon)</span>" : ""}
                        </summary>
                        <div class="elementContent">
                           <div class="elementDetail">
                              <span class="span" style="font-weight: bold;">Détails du démon</span>
                              <div class="detailWrapper">
                                  ${trigger.boucle ? `<div class="rowInWrapper"><span class="span">Boucle :</span><span class="span">${trigger.boucle}</span></div>` : ""}
                                 ${trigger.condition ? `<div  class="rowInWrapper"><span class="span">Condition :</span><span class="span">${trigger.condition.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</span></div>` : ""}
                            
                              </div>
                           </div>
                           

                           <div class="metadonnéeDetail">
                              <span class="span" style="font-weight: bold;">Métadonnées</span>
                              <div class="detailWrapper">
                                  <div class="rowInWrapper"><span class="span">Ordre d'éxécution :</span><span class="span">${data.length - index}</span></div>
                                  <div class="rowInWrapper"><span class="span">Date :</span><span class="span">${formatSimpleDate(log.executionDate)}</span></div>
                                 
                              </div>
                           </div> 

                           ${
                             trigger.events && trigger.events.length > 0
                               ? /*html*/ `
                              <div class=" ">
                                 <span class="span" style="font-weight: bold;">Événement(s) appellé(s)</span>
                                 <div class="detailWrapper">
                                    ${trigger.events
                                      .map(
                                        (eventId, index) => /*html*/ `
                                       <div class="rowInWrapper"><span class="span">Ordre ${index + 1} :</span><span class="span">${gameData.roomInDb.events.events.find((event) => event.id === eventId)?.name || "Unknown Event"}</span></div>
                                    `,
                                      )
                                      .join("")}  
                                 </div>
                              </div> 
                           `
                               : ""
                           }
                        </div>
                     </details>
                     `;
             } 
           })
           .join("")}
   `;
}
