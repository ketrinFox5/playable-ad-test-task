import { Car } from '../../Car';
import { GAME_SETTINGS } from '../../setup/gameSettings';
import { DrawingTrajectory } from './drawing-trajectory';

export function animateCarsToCollision(cars: Car[], onCollision: () => void): void {
    const firstCar = cars[0];
    const secondCar = cars[1];
    const intersectionPaths = DrawingTrajectory.cutPathsToIntersection(
        firstCar.trajectory.path,
        secondCar.trajectory.path,
    );
    if (!intersectionPaths) return;

    const { pathANew: firstPath, pathBNew: secondPath } = intersectionPaths;
    firstCar.trajectory.path = firstPath;
    secondCar.trajectory.path = secondPath;
    const firstPathDistance = DrawingTrajectory.getPathLength(firstPath);
    const secondPathDistance = DrawingTrajectory.getPathLength(secondPath);
    const maxDuration = Math.max(firstPathDistance, secondPathDistance) / GAME_SETTINGS.carAnimationSpeed;

    firstCar.trajectory.animateSpriteAlongPath(
        firstCar.sprite,
        maxDuration,
        Math.PI / 2,
    );

    secondCar.trajectory.animateSpriteAlongPath(
        secondCar.sprite,
        maxDuration,
        Math.PI / 2,
        onCollision,
        (): void => {
            if (secondCar.checkCarIntersect(firstCar)) {
                DrawingTrajectory.stopAnimations(firstCar.sprite);
                DrawingTrajectory.stopAnimations(secondCar.sprite);
                onCollision();
            }
        },
    );
}
