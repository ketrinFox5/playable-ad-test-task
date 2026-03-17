import { Point } from 'pixi.js';
import { Car } from './Car';
import { GAME_SETTINGS } from './setup/gameSettings';
import { DrawingProps } from './utils/types/drawingType';
import { getLocalBounds } from './utils/helpers/getLocalBounds';

export class PathDraw {
    private currentCar?: Car

    constructor(private deps: DrawingProps) {}

    public startDrawing(car: Car) {
        if (car.isPathPainted) return;
    
        this.currentCar = car;
    
        window.addEventListener('pointermove', this.onDraw);
        window.addEventListener('pointerup', this.endDraw);
    }
    
    private onDraw = (event: PointerEvent) => {
        this.deps.restartTimeout();
        const car = this.currentCar;
        if (!car) return;
    
        const point = this.getPoint(event);
        const path = car.trajectory.path;
        const lastPoint = path.at(-1);
    
        path.push(point);
    
        if (!this.canDraw(point)) {
            this.endDraw();
            return;
        }
    
        car.trajectory.drawDot(point.x, point.y);
    
        if (lastPoint) {
            car.trajectory.drawInterpolatingLine(lastPoint, point);
        }
    };
    
    private endDraw = () => {
        this.deps.restartTimeout();
        const car = this.currentCar;
        if (!car) return;
    
        this.removeListeners();
    
        const lastPoint = car.trajectory.path.at(-1);
    
        if (!this.isCorrectParking(car, lastPoint)) {
            car.trajectory.clear();
            this.currentCar = undefined;
            return;
        }
    
        car.isPathPainted = true;
        car.sprite.eventMode = 'none';
    
        if (this.deps.cars.every(c => c.isPathPainted)) {
            this.deps.onAllCarsFinished();
        }
    };
    
    private removeListeners() {
        window.removeEventListener('pointermove', this.onDraw);
        window.removeEventListener('pointerup', this.endDraw);
    }
    
    private getPoint(event: PointerEvent): Point {
        const rect = this.deps.app.canvas.getBoundingClientRect();
    
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
    
        return this.deps.app.stage.toLocal({ x, y });
    }
    
    private canDraw(point: Point): boolean {
        const { x, y } = point;
    
        const isInside = this.deps.app.stage.hitArea?.contains(x, y);
    
        const isAboveParking = this.deps.parkingSpots[1].bottom < y;
    
        const isBelowCars =
            getLocalBounds(this.deps.cars[0].sprite.getBounds(), this.deps.app).bottom > y;
    
        const otherCar = this.deps.cars.find(c => c !== this.currentCar)!;
    
        const isNotOnOtherCar = !getLocalBounds(
            otherCar.sprite.getBounds(),
            this.deps.app
        ).contains(x, y);
    
        return Boolean(isInside && isAboveParking && isBelowCars && isNotOnOtherCar);
    }
    
    private isCorrectParking(car: Car, point?: Point): boolean {
        if (!point) return false;
    
        const index = car.color === GAME_SETTINGS.firstCarColor ? 1 : 0;
    
        return this.deps.parkingSpots[index].contains(point.x, point.y);
    }
}