import { Container, Point, Sprite } from 'pixi.js';
import { HintHand } from '../../HintHand';

export function createHintHand(sprite: Sprite,start: Point, target: Point, layer: Container ) {
    const hand = new HintHand(sprite);
    hand.init(start, target, layer);
    return hand;
}