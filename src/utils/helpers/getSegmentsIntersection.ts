import { Point } from 'pixi.js';
import { GAME_SETTINGS } from '../../setup/gameSettings';

export function getSegmentsIntersection(
    a: Point,
    b: Point,
    c: Point,
    d: Point,
): Point | null {
    const bax = b.x - a.x;
    const bay = b.y - a.y;
    const cdx = c.x - d.x;
    const cdy = c.y - d.y;
    const cax = c.x - a.x;
    const cay = c.y - a.y;
    const det = bax * cdy - bay * cdx;
    if (Math.abs(det) < GAME_SETTINGS.Eps) return null;

    const t = (cax * cdy - cdx * cay) / det;
    const u = (bax * cay - bay * cax) / det;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        const x = a.x + t * bax;
        const y = a.y + t * bay;
        return new Point(x, y);
    }
    return null;
}
