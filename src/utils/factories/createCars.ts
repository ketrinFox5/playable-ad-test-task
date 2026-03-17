import { Application, Container, Graphics, Sprite } from 'pixi.js';
import { Car } from '../../Car';
import { GAME_SETTINGS } from '../../setup/gameSettings';
import { DrawingTrajectory } from '../helpers/drawing-trajectory';

export function createCars(activeCarsSprites: Sprite[], layer: Container, app: Application): Car[] {
    const cars = activeCarsSprites.map((carSprite, i) => {
      carSprite.scale.set(0.5);
      carSprite.anchor.set(0.5);
      const color = i === 0 ? GAME_SETTINGS.firstCarColor : GAME_SETTINGS.secondCarColor;
      const trajectory = new DrawingTrajectory(
        GAME_SETTINGS.width,
        GAME_SETTINGS.height,
        new Graphics().circle(0, 0, GAME_SETTINGS.trailWidth / 2).fill({ color }),
        [],
        app,
        color,
        window.devicePixelRatio,
      );
      layer.addChild(trajectory.sprite);
      return new Car(carSprite, color, trajectory);
    });
    return cars;
  }