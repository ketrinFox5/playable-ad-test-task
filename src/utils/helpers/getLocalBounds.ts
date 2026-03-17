import { Application, Bounds, Rectangle } from 'pixi.js';

export function getLocalBounds(bounds: Bounds, app: Application): Rectangle {
    if (!bounds) return new Rectangle();
    const topLeft = app.stage.toLocal({ x: bounds.left, y: bounds.top });
    const bottomRight = app.stage.toLocal({ x: bounds.right, y: bounds.bottom });

    return new Rectangle(
        topLeft.x,
        topLeft.y,
        bottomRight.x - topLeft.x,
        bottomRight.y - topLeft.y,
    );
}