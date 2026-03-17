import './style.css';
import './setup/gsap';
import { Application } from 'pixi.js';
import { App } from './App';
import { PIXI_CONFIG } from './setup/pixiApp.config';
import { loadAssets } from './setup/loadAssets';
import { createSprites } from './utils/factories/createSprites';

async function bootstrap() {
  const pixiApp = new Application();

  await pixiApp.init(PIXI_CONFIG);

  const rootElement = document.getElementById('game-root');
  if (!rootElement) {
    throw new Error('game-root not found');
  }

  rootElement.appendChild(pixiApp.canvas);

  const textures = await loadAssets();

  const sprites = createSprites(textures);

  new App(pixiApp, sprites);
}

bootstrap();
