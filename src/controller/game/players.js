import { spookySkins } from "../../../data/spookySkins.js";
import { getGameData, getView } from "./dataStorage.js";
import { players } from "../../../main.js";
import { getTextualValueOfCard } from "./cards.js";
export function isPassifPlayer(player) {
  let gameData = getGameData();
  if (!gameData) {
    console.warn("No game data found to determine if player is passif");
    return false;
  }
  if (!player){
  
    console.warn("No player provided to determine if player is passif");
  console.warn("Player parameter:", player);
    return false;
  }
  return (
    gameData.data.spectators.some((spectator) => spectator.id === player.id) ||
    player.haswin?.value ||
    player.hasloose?.value
  );
}
export function getPlayerStat(player, gameData) {
  let arrayOfStat = [];
  for (let key in player) {
    if (key == "skin" ||   key == "socketID") {
      continue;
    }
    if (key == "actions") {
      arrayOfStat.push({
        name: key,
        type: "Action Array",
        value: player[key].value.map((action) => action.name).join(", "),
      });
      continue;
    }
    if (
      key == "handDeck" ||
      key == "cardsSelectableForActionOnHand" ||
      key == "personalHandDeck" ||
      key == "personalHandDiscard"
    ) {
      arrayOfStat.push({
        name: key =="cardsSelectableForActionOnHand"?"Cartes sélectionnables" : key,
        type: "Card Array",
        value: player[key].value.map((cardId) =>
          gameData.roomInDb.assets.cards[cardId].type == "french_standard"
            ? getTextualValueOfCard(gameData.roomInDb.assets.cards[cardId])
            : gameData.roomInDb.assets.cards[cardId].name,
        ).join(", "),
      });
      continue;
    }
    if (key == "roles") {
      arrayOfStat.push({
        name: "Roles",
        type: "Role Array",
        value: player.roles.value.map((role) => role.name).join(", "),
      });
      continue;
    }

    if (key == "gain") {
      for (let gainKey of Object.keys(player.gain?.value)) {
        let gainObject = gameData.roomInDb.assets.gains.find(
          (elt) => elt.id == gainKey,
        );
        if (!gainObject) continue;
        arrayOfStat.push({
          name: gainObject.name,
          type: "Gain",
          value: player.gain.value[gainKey].value,
        });
      }

      continue;
    }

    if (player[key]) {
      arrayOfStat.push({
        name: key,
        type: typeof player[key].type ?? typeof player[key],
        value: player[key].value != undefined ?? player[key],
      });
    }
  }

  return arrayOfStat;
}
export function getPlayerWhoHasToPlayer() {
  let gameData = getGameData();
  if (!gameData || !gameData.data || !gameData.data.players) {
    console.warn("Invalid gameData structure:", gameData);
    return null;
  }
  return gameData.data.players.find(
    (player) => player.position === gameData.data.currentPlayerPosition.value,
  );
}

// change skin of player
export function getRandomSkin() {
  let index = Math.floor(Math.random() * spookySkins.length);
  return spookySkins.splice(index, 1)[0];
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

// use to get player of current view
export function getPlayerOfCurrentView() {
  let gameData = getGameData();
  if (!gameData) {
    console.warn("No game data found to get player of current view");
    return null;
  }
  if (!gameData || !gameData.data || !gameData.data.players) {
    console.warn("Invalid gameData structure:", gameData);
    return null;
  }
  let view = getView(); 
  let player = gameData.data.players.find(
    (player) => player.position == view.playerView,
  );
  if (player) return player;
  player =
    gameData.data.spectators.find(
      (spectator) => spectator.position == view.playerView,
    ) 
  if (player) return player;
 
  return null;
}
export function getSocketOfPlayerOfCurrentView() {
  let gameData = getGameData();
  let view = getView();
  if (!gameData || !gameData.data || !gameData.data.players) {
    console.warn("Invalid gameData structure:", gameData);
    return null;
  }
  let currentPlayer = gameData.data.players.find(
    (player) => player.position == view.playerView,
  );
  return (
    players.find((player) => player.id == currentPlayer.id)?.socket || null
  );
}
