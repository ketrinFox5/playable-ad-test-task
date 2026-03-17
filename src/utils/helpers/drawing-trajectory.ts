import { Application, Graphics, Point, RenderTexture, Sprite } from 'pixi.js';
import {  GAME_SETTINGS } from '../../setup/gameSettings';
import { getSegmentsIntersection } from './getSegmentsIntersection';
import gsap from 'gsap';
import { CarColorType } from '../types/carColorType';

export class DrawingTrajectory {
  private interpolatingLine: Graphics;

  public readonly texture: RenderTexture;
  public readonly sprite: Sprite;
  public path: Point[];
  public brush: Graphics;
  public app: Application;
  public color: CarColorType;

  constructor(
    width: number,
    height: number,
    brush: Graphics,
    path: Point[],
    app: Application,
    color: CarColorType,
    resolution?: number,
  ) {
    this.texture = RenderTexture.create({ width, height, resolution, scaleMode: 'linear' });
    this.path = path;
    this.brush = brush;
    this.sprite = new Sprite(this.texture);
    this.app = app;
    this.interpolatingLine = new Graphics();
    this.color = color;
  }

  public clear(): void {
    this.app.renderer.render({
      container: new Graphics()
        .rect(0, 0, this.texture.width, this.texture.height)
        .fill({ color: 0x00000, alpha: 0 }),
      target: this.texture,
      clear: true,
    });
    this.path = [];
  }

  public drawDot(x: number, y: number): void {
    this.brush.position.set(x, y);
    this.app.renderer.render({
      container: this.brush,
      target: this.texture,
      clear: false,
    });
  }

  public drawInterpolatingLine(from: Point, to: Point): void {
    this.interpolatingLine
      .clear()
      .moveTo(from.x, from.y)
      .lineTo(to.x, to.y)
      .stroke({ width: GAME_SETTINGS.trailWidth, color: this.color });
    this.app.renderer.render({
      container: this.interpolatingLine,
      target: this.texture,
      clear: false,
    });
  }

  public static getPathLength(path: Point[]): number {
    let dist = 0;
    for (let i = 1; i < path.length; i++) {
      const a = path[i-1];
      const b = path[i];
      dist += Math.hypot(b.x - a.x, b.y - a.y);
    }
    return dist;
  }

  public static calculatePathStep(length: number): number {
    const density = Math.ceil(length / 50);
    return Math.max(1, density);
  }

  public static cutPathsToIntersection(
    pathA: Point[],
    pathB: Point[],
  ): { pathANew: Point[]; pathBNew: Point[] } | null {
    for (let i = 0; i < pathA.length - 1; i++) {
      const a = pathA[i];
      const b = pathA[i + 1];

      for (let j = 0; j < pathB.length - 1; j++) {
        const c = pathB[j];
        const d = pathB[j + 1];

        const intersection = getSegmentsIntersection(a, b, c, d);
        if (intersection) {
          const pathANew = pathA.slice(0, i + 1);
          pathANew.push(intersection);
          const pathBNew = pathB.slice(0, j + 1);
          pathBNew.push(intersection);
          return {
            pathANew,
            pathBNew,
          };
        }
      }
    }
    return null;
  }

  public animateSpriteAlongPath(
    sprite: Sprite,
    duration = 2,
    rotationOffset: number,
    onComplete?: () => void,
    onUpdate?: () => void,
  ): void {
    const step = DrawingTrajectory.calculatePathStep(this.path.length);
    const smoothPath = this.path.filter(
      (_, i) => i % step === 0 || i === this.path.length - 1,
    );
    gsap.to(sprite, {
      motionPath: {
        path: smoothPath,
        autoRotate: rotationOffset,
        curviness: 1,
        useRadians: true,
      },
      duration,
      ease: 'none',
      onComplete,
      onUpdate,
    });
  }
  public static stopAnimations(sprite: Sprite): void {
    gsap.killTweensOf(sprite);
  }
}
