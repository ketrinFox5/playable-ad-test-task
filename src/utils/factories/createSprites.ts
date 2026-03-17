import { Sprite, Texture } from 'pixi.js';
import { IAppSprites } from '../interfaces/IAppSprites';

export function createSprites(textures: any): IAppSprites {

  return {

    activeCars: [
      new Sprite(textures.redCar),
      new Sprite(textures.yellowCar),
    ],

    inactiveCars: [
      new Sprite(textures.blueCar),
      new Sprite(textures.greenCar),
    ],

    hand: new Sprite(textures.hand),

    fail: new Sprite(textures.fail),

    logo: new Sprite(textures.logo),

    button: new Sprite(textures.button)
  };
}