import { getPlayerId } from "../../src/controller/game/dataOfPlayer.js"

export function playerCard(admin,player) {
  let playerId = getPlayerId()

  if (!player){
    console.warn("please provide player to playerCard")
    return
  }  if (!player.id){
    console.warn("please provide id to playerCard")
    return
  } if (!player.pseudo){
    console.warn("please provide pseudo to playerCard")
    return
  }
   
  return /*html */`
         <div class="playerCard">
                <div class="letter">${player.pseudo.charAt(0)}</div>
                <div>

                <span class="pseudo">${player.pseudo} ${playerId==player.id ? "(vous)":""}</span>
                ${admin.id === player.id ? "<span>Hôte</span>" : ""}
                </div>
            </div>
  `
}
 