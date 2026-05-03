import { spookySkins } from "../../../../data/spookySkins.js";
import { getGameData } from "./dataStorage.js";
export function isPassifPlayer(player) {
  let gameData = getGameData();
  if (!gameData) {
    console.warn("No game data found to determine if player is passif");
    return false;
  }
  return (
    gameData.data.spectators.some(spectator => spectator.id === player.id) ||
    player.haswin?.value ||
    player.hasloose?.value
  );
}
export function previousChangeSkin(parmas) {
  let skinElement = document.querySelector(".choose-skin-image");

  if (!skinElement) {
    console.error("Cannot find skin element to update");
    return;
  }
  let index = parseInt(skinElement.dataset.skinIndex, 10);
  if (index === 0) {
    index = spookySkins.length;
  }
  let skin = spookySkins[index - 1];
  skinElement.src = `/assets/images/spooky-skins/${skin.name}.png`;
  skinElement.dataset.skin = skin.name;
  skinElement.dataset.skinIndex = index - 1;
  let head = document.querySelector(".choosePseudoPage .head");
  if (head) {
    head.style.backgroundColor = skin.color;
  }
}
export function nextChangeSkin(parmas) {
  const skinElement = document.querySelector(".choose-skin-image");
  if (!skinElement) {
    console.error("Cannot find skin element to update");
    return;
  }
  let index = parseInt(skinElement.dataset.skinIndex, 10);
  if (index === spookySkins.length - 1) {
    index = -1;
  }
  let skin = spookySkins[index + 1];
  skinElement.src = `/assets/images/spooky-skins/${skin.name}.png`;
  skinElement.dataset.skin = skin.name;
  skinElement.dataset.skinIndex = index + 1;

  let head = document.querySelector(".choosePseudoPage .head");
  if (head) {
    head.style.backgroundColor = skin.color;
  }
}
window.previousChangeSkin = previousChangeSkin;
window.nextChangeSkin = nextChangeSkin;
