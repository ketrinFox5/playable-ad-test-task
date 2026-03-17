import { Assets } from 'pixi.js';

import redCarImage from '../assets/images/red.png';
import yellowCarImage from '../assets/images/yellow.png';
import greenCarImage from '../assets/images/green.png';
import blueCarImage from '../assets/images/blue.png';
import handImage from '../assets/images/hand.png';
import failImage from '../assets/images/fail3.png';
import logoImage from '../assets/images/gamelogo.png';
import buttonImage from '../assets/images/button.png'

export async function loadAssets() {

  const [
    redCar,
    yellowCar,
    greenCar,
    blueCar,
    hand,
    fail,
    logo, 
    button
  ] = await Promise.all([
    Assets.load(redCarImage),
    Assets.load(yellowCarImage),
    Assets.load(greenCarImage),
    Assets.load(blueCarImage),
    Assets.load(handImage),
    Assets.load(failImage),
    Assets.load(logoImage),
    Assets.load(buttonImage)
  ]);

  return {
    redCar,
    yellowCar,
    greenCar,
    blueCar,
    hand,
    fail,
    logo,
    button
  };
}


