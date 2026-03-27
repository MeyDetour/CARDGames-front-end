import './websocket/connection.js'
import './controller/game/messages.js'
import './controller/game/game.js'
import './controller/error.js'
import './controller/game/actions.js'
import "./helpers/copy.js"
import './controller/game/spectactor.js'
import { router } from './router/router.js'

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof router === 'function') router();
  });
} else {
  if (typeof router === 'function') router();
}
