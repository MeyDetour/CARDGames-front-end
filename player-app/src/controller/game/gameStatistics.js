import { storePlayerPlayedGame } from "./dataStorage.js";

import { apiClient } from "../../../src-shared/helpers/api.js";
export function incrementePlayerCount(gameId) {
  apiClient("game/" + gameId + "/one/more/player");
  storePlayerPlayedGame(gameId);
}
