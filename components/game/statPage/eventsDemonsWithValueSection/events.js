import { getTextualValueOfCard } from "../../../../src/controller/game/cards.js";
import { getGainIdOfGainString } from "../../../../src/helpers/string.js";
import { formatSimpleDate } from "../../../../src/helpers/date.js";
export default function statEventsDemonsWithValueSectionEventSection(gameData) {
 let data = gameData.data?.testLogs
           .filter((log) => log.testType == "event" || log.testType == "demon" || log.testType == "withValue")
           ?.reverse()
   return ` 
         ${
           data.map((log, index) => {
             if (log.testType == "event" ) {
               let event = log; 
               return /*html */ `
                     <details class="elementDetails">
                        <summary ${index === 0 ? "style='padding-bottom: 24px;'" : ""}>
                           <img src="/assets/violet-right-arrow.svg" alt="Arrow Icon">
                           <span class="span">${event.name}${!event.conditionResult ? ` (ne rempli pas la condition)` : ""}</span>
                           ${index===0 ? "<span class='tooltip span'>(Dernier événement)</span>" : ""}
                        </summary>
                        <div class="elementContent">
                           <div class="elementDetail">
                              <span class="span" style="font-weight: bold;">Détails de l'événement</span>
                              <div class="detailWrapper">
                                  ${event.boucle ? `<div class="rowInWrapper"><span class="span">Boucle :</span><span class="span">${event.boucle}</span></div>` : ""}
                                 ${event.condition ? `<div  class="rowInWrapper"><span class="span">Condition :</span><span class="span">${event.condition.replaceAll('<', '&lt;').replaceAll('>', '&gt;') }</span></div>` : ""}
                                 ${event.event.condition ? `<div  class="rowInWrapper"><span class="span">Condition dans la boucle :</span><span class="span">${event.event.condition.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}</span></div>` : ""}
                                 ${
                                   event.event.give
                                     ? Object.keys(event.event.give)
                                         .map((string) =>
                                           string.includes("gain#")
                                             ? `<div  class="rowInWrapper"><span class="span">Don de ${gameData.data.gains.find((elt) => elt.id == getGainIdOfGainString(string))?.name} :</span><span class="span" >${event.event.give[string]}</span></div>`
                                             : string.includes("cards")
                                             ? `<div  class="rowInWrapper"><span class="span">Don de cartes :</span><span class="span">${event.event.give[string]}</span></div>`
                                             : `<div  class="rowInWrapper"><span class="span">Don de ${string} :</span><span class="span">${event.event.give[string]}</span></div>`
                                             
                                         )
                                         .join("")
                                     : ""
                                 }
                                 ${event.event.from ? `<div  class="rowInWrapper"><span class="span">Source :</span><span class="span">${event.event.from}</span></div>` : ""}
                                 ${event.event.for ? `<div  class="rowInWrapper"><span class="span">Cible :</span><span class="span">${event.event.for}</span></div>` : ""}
                                 ${event.event.action ? `<div  class="rowInWrapper"><span class="span">Action :</span><span class="span">${event.event.action}</span></div>` : ""}
                                 ${event.event.value !== undefined && event.event.value !== null ? `<div  class="rowInWrapper"><span class="span">Valeur :</span><span class="span">${event.event.value}</span></div>` : ""}
                                 ${event.loadMessage ? `<div  class="rowInWrapper"><span class="span">Message :</span><span class="span">${event.loadMessage}</span></div>` : ""}
                                 
                              </div>
                           </div>
                           ${
                             event.diffs.length > 0
                               ? /* html*/ `
                           <div class="modificationDetail">
                              <span class="span" style="font-weight: bold;">Détails de l'événement</span>
                             
                              <div class="detailWrapper">
                              ${event.diffs.map(
                                (diff) => /* html*/ `
                                 <div class="diffDetail">
                                     <span class="span">${diff.key}</span>
                                      ${diff.message ? `<p class="span">${diff.message}</p>` : ""}
                                     <div>
                                       <span class="beforeValue span">${ (diff.type.includes("array")|| diff.type.includes("List")  )&& diff.before.length=="0" ? "Liste de vide" :  diff.type == "cardList" ? diff.before.map((id) => getTextualValueOfCard(gameData.roomInDb.assets.cards[id])).join(", ") :diff.before}</span>
                                       <img src="/assets/grey-right-arrow.svg" alt="Arrow Icon">
                                       <span class="afterValue span">${ (diff.type.includes("array")|| diff.type.includes("List")  )&& diff.after.length=="0" ? "Liste de vide" :  diff.type == "cardList" ? diff.after.map((id) => getTextualValueOfCard(gameData.roomInDb.assets.cards[id])).join(", ") :diff.after}</span>
                                     </div>
                                 </div>
                                `
                              ).join("")}
                              </div>
                           </div> 
                           `
                               : ""
                           }

                           <div class="metadonnéeDetail">
                              <span class="span" style="font-weight: bold;">Métadonnées</span>
                              <div class="detailWrapper">
                                  <div class="rowInWrapper"><span class="span">Ordre d'éxécution :</span><span class="span">${data.length -  index}</span></div>
                                  <div class="rowInWrapper"><span class="span">Date :</span><span class="span">${formatSimpleDate(log.executionDate)}</span></div>
                                 
                              </div>
                           </div> 

                           ${event.event?.withValue && event.event?.withValue.length > 0 ? /*html*/ `
                              <div class=" ">
                                 <span class="span" style="font-weight: bold;">Événement(s) appellé(s)</span>
                                 <div class="detailWrapper">
                                    ${event.event.withValue.map((withValueEventObject,index) => /*html*/ `
                                       <div class="rowInWrapper"><span class="span">Ordre ${index+1} :</span><span class="span">${gameData.roomInDb.events.withValueEvent.find(event => event.id === withValueEventObject.id)?.name || "Unknown Event"}</span></div>
                                    `).join("")}  
                                 </div>
                              </div> 
                           ` : ""}
                        </div>
                     </details>
                     `;
             }
             if (log.testType == "demon") {
               let demon = log;
               return /*html */ `
                  <div class="demonLine"><hr> <span class="span">Démon : ${demon.name}</span> <hr></div>
                  `;
             }
           })
           .join("")}
   `;
}
