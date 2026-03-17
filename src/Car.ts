import { Sprite } from 'pixi.js';
import { GAME_SETTINGS } from './setup/gameSettings';
import { DrawingTrajectory } from './utils/helpers/drawing-trajectory';
import { CarColorType } from './utils/types/carColorType';

export class Car {
  public isPathPainted: boolean = false;
  public sprite: Sprite;
  public color: CarColorType;
  public trajectory: DrawingTrajectory;

  constructor(
    sprite: Sprite,
    color: CarColorType,
    trajectory: DrawingTrajectory,
  ) {
    this.sprite = sprite;
    this.color = color;
    this.trajectory = trajectory;
  }

  public checkCarIntersect(car: Car): boolean {
    const posA = this.sprite.position;
    const posB = car.sprite.position;

    const dx = posB.x - posA.x
    const dy = posB.y - posA.y

    const distanceSq = dx * dx + dy * dy;
    const minDistance = this.getMinCollisionDistance(car);
    const minDistanceSq = minDistance * minDistance;

    return distanceSq <= minDistanceSq;
  }

  private getMinCollisionDistance(car: Car): number {
    return (
      (GAME_SETTINGS.carIntersectWithMulti * (this.sprite.width + car.sprite.width)) / 2
    );
  }
}
