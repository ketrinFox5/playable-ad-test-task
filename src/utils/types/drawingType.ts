import { Application, Rectangle } from 'pixi.js';
import { Car } from '../../Car';

export type DrawingProps = {
    app: Application;
    cars: Car[];
    parkingSpots: Rectangle[];
    onAllCarsFinished: () => void;
    restartTimeout: () => void;
}