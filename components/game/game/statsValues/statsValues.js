export function statsValues(params, player) {
  return /*html */ `
      ${params.displaypoints ? /*html */ `<div class="cardCount-stat"><img src="/assets/cards-count.svg" alt="Cartes"> <span>${player.handDeck.value.length}</span></div>` : ""}
      ${
        params.gainList && params.gainList.length > 0
          ? params.gainList
              .map(
                (gain) =>
                  /*html */ `<span class="gain">${gain.nom} : ${player.gain.value[gain.id].value}</span>`,
              )
              .join("")
          : ""
      } 
    ${
      player.roles && player.roles.value.length > 0
        ? player.roles.value
            .map(
              (role) =>
                /*html */ `<span class="role">Role : ${role.nom}</span>`,
            )
            .join("")
        : ""
    } 
  `;
}
