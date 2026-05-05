import './src/websocket/game/connections.js'
import './src/controller/game/messages.js'
import './src/controller/game/game.js'
import './src/controller/error.js'
import './src/controller/game/actions.js'
import "./src/helpers/copy.js"
import './src/controller/game/spectactor.js'
import './components/game/widgetLetCommentaire/widgetLetCommentaire.js'
import './src/controller/game/players.js'

import { router } from './src/router/router.js'
export let players=[];
export const environnement = "player-app";
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof router === 'function') router();
  });
} else {
  if (typeof router === 'function') router();
}
