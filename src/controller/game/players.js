export function isPassifPlayer(player) {
    return player.isSpectator?.value || player.haswin?.value || player.hasloose?.value 
 }