 
export default function statEventsDemonsWithValueSectionValuePlayerSection(gameData){
    return /*html*/ `
        ${playerStat1
                         .map(
                           (stat) => /*html*/ `
                             <div class="statValueElement"><div class="spanTop"><span>${stat.name}</span><span>${stat.type}</span></div><span>${stat.value}</span></div>
     
                                       `,
                         )
                         .join("")}  
        
   `
}
