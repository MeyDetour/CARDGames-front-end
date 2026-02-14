import './websocket/connection.js'
import './controller/game/game.js'
import './controller/error.js'
import { router } from './router/router.js'

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof router === 'function') router();
  });
} else {
  if (typeof router === 'function') router();
}
