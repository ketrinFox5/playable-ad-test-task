import {
  Application,
  Container,
  Rectangle,
  Sprite,
  Point,
} from 'pixi.js';
import { GAME_SETTINGS } from './setup/gameSettings';
import { Car } from './Car';
import { HintHand } from './HintHand';
import { FailScene } from './FailScene';
import { createCars } from './utils/factories/createCars';
import { createParking } from './utils/factories/createParking';
import { IAppSprites } from './utils/interfaces/IAppSprites';
import { FinalScene } from './FinalScene';
import { createHintHand } from './utils/factories/createHintHand';
import { animateCarsToCollision } from './utils/helpers/animateCollision';
import { PathDraw } from './PathDraw';

export class App {
  private timeout?: ReturnType<typeof setTimeout>;
  private drawing!: PathDraw;
  public readonly app: Application;
  public readonly activeLayer: Container;
  public readonly backgroundLayer: Container;
  public readonly overlayLayer: Container;
  public readonly sprites: IAppSprites;
  public parkingSpots: Rectangle[] = [];
  public cars: Car[] = [];
  public scale: number = 1;
  public hand?: HintHand;
  public failScene?: FailScene;
  public finalScene?: FinalScene;  

  constructor(app: Application, sprites: any) {
    this.app = app;
    this.sprites = sprites;
    this.backgroundLayer = new Container();
    this.app.stage.addChild(this.backgroundLayer);

    this.activeLayer = new Container();
    this.app.stage.addChild(this.activeLayer);

    this.overlayLayer = new Container();
    this.app.stage.addChild(this.overlayLayer);

    this.init();
  }

  public init(): void {
    this.updateScale();

    this.parkingSpots = createParking(
      this.sprites.inactiveCars,
      this.backgroundLayer,
    );
    this.initCars(this.sprites.activeCars, this.activeLayer);
    this.initScenes();
    this.iniHintHand();
    this.initDrawingController();

    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = new Rectangle(0, 0, GAME_SETTINGS.width, GAME_SETTINGS.height);

    this.restartTimeout();

    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, window.innerHeight);
      this.updateScale();
    });
  }

  private updateScale(): void {
    const paddingX = GAME_SETTINGS.paddingX;
    const aviableWidth = this.app.screen.width - paddingX * 2;
    this.scale = Math.min(
      aviableWidth / GAME_SETTINGS.width,
      this.app.screen.height / GAME_SETTINGS.height,
    );
    this.app.stage.scale.set(this.scale);
    this.app.stage.x = (this.app.screen.width - GAME_SETTINGS.width * this.scale) / 2;
    this.app.stage.y =
      (this.app.screen.height - GAME_SETTINGS.height * this.scale) / 2;
  }

  private initScenes(): void {
    this.failScene = new FailScene(this.sprites.fail, this.overlayLayer);
    this.finalScene = new FinalScene(this.sprites.logo, this.sprites.button, this.overlayLayer, this.app);
  }

  private iniHintHand(): void {
    const pointHand = new Point(
      this.parkingSpots[1].x + this.parkingSpots[1].width / 2,
      this.parkingSpots[1].y + this.parkingSpots[1].height / 2,
    );
    const position = this.cars[0].sprite.position;
    this.hand = createHintHand(this.sprites.hand, position, pointHand, this.overlayLayer);
  }

  private initCars(activeCarsSprites: Sprite[], layer: Container): void {
    this.cars = createCars(activeCarsSprites, layer, this.app);

    const carWidth = Math.max(this.cars[0].sprite.width, this.cars[1].sprite.width);
    const carHeight = Math.max(this.cars[0].sprite.height, this.cars[1].sprite.height);
    const carY = GAME_SETTINGS.height - carHeight / 2 - GAME_SETTINGS.carsStartBottom;
    const carsTotalWidth = 2 * carWidth + GAME_SETTINGS.carsStartGap;
    const carsStartX = (GAME_SETTINGS.width - carsTotalWidth) / 2;

    this.cars.forEach((car, i) => {
      const x = carsStartX + i * (carWidth + GAME_SETTINGS.carsStartGap);
      car.sprite.x = x + carWidth / 2;
      car.sprite.y = carY;
      layer.addChild(car.sprite);
      car.sprite.eventMode = 'static';
      car.sprite.cursor = 'pointer';
      car.sprite.on('pointerdown', () => this.onCarClick(car),
      );
    });
  }

  private initDrawingController() {
    this.drawing = new PathDraw({
      app: this.app,
      cars: this.cars,
      parkingSpots: this.parkingSpots,
      onAllCarsFinished: () => {
        clearTimeout(this.timeout);
        animateCarsToCollision(this.cars, () => {
          this.failScene?.showFailView(
            new Point(GAME_SETTINGS.width / 2, GAME_SETTINGS.height / 2),
            () =>
              this.failScene?.hideFailView(
                GAME_SETTINGS.failHideDelay,
                this.showFinalScene,
              ),
          );
        });
      },
      restartTimeout: this.restartTimeout.bind(this)
    })
  }

  private restartTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.hand?.hideHand();
      this.showFinalScene();
    },GAME_SETTINGS.inactivityTime);
  }

  private onCarClick( car: Car): void {
    this.restartTimeout();
    this.hand?.hideHand();
    this.drawing.startDrawing(car);
  }

  public showFinalScene = (): void => {
    this.finalScene?.showFinalView(
      new Point(GAME_SETTINGS.width / 2, GAME_SETTINGS.height / 2),
    () => {
      // window.open(`${GAME_SETTINGS.buttonURL}`, '_blank');
      window.location.href = GAME_SETTINGS.buttonURL;
    });
  };
}
