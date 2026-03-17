import { Container, Graphics, Rectangle, Sprite, Text, TextStyle } from 'pixi.js';
import { GAME_SETTINGS } from '../../setup/gameSettings';

export function createParking(inactiveCars: Sprite[], layer: Container): Rectangle[] {
    const spots: Rectangle[] = [];
    const spotsLength = GAME_SETTINGS.spotsLength;
    const spotHeightMulti = GAME_SETTINGS.spotHeightMulti;
    const gap = GAME_SETTINGS.spotsGap;
    const spotWidth = GAME_SETTINGS.width / spotsLength - gap;
    const spotHeight = GAME_SETTINGS.height * spotHeightMulti;
    const totalWidth = spotsLength * spotWidth + (spotsLength - 1) * gap;
    const startX = (GAME_SETTINGS.width - totalWidth) / 2;
    const startY =-layer.getGlobalPosition().y
    const lineRenderY = GAME_SETTINGS.lineRenderY;

    for (let i = 0; i < spotsLength; i++) {

        const x = startX + i * (spotWidth + gap);
        const y = startY;
    
        const bounds = new Rectangle(x, y, spotWidth, spotHeight);
        spots.push(bounds);
    
        createParkingLine(x, y, spotHeight, layer);
    
        if (i === spotsLength - 1) {
            createParkingLine(
                startX + spotsLength * (spotWidth + gap),
                y,
                spotHeight,
                layer
            );
        }
    }

    placeParkingContent(spots, inactiveCars, layer);

    function createParkingLine(
        x: number,
        y: number,
        height: number,
        layer: Container
    ) {
        const line = new Graphics();
        const horizontalWidth = gap * 2.5;
        const horizontalRadius = 15;

        line
        .rect(-gap, -lineRenderY, gap, height + lineRenderY)
        .roundRect(
            -(gap + horizontalWidth) / 2,
            height - gap / 2,
            horizontalWidth,
            gap,
            horizontalRadius
        )
        .fill('white');

        line.x = x;
        line.y = y;
        layer.addChild(line);

    }

    function placeParkingContent(
        spots: Rectangle[],
        inactiveCars: Sprite[],
        layer: Container
    ) {
        spots.forEach((spot, i) => {

            if (i === 0 || i === 3) {
        
                const car = inactiveCars[Number(i === 0)];
        
                car.scale.set(0.5);
                car.anchor.set(0.5);
        
                car.x = spot.x + spot.width / 2;
                car.y = spot.y + spot.height / 2;
        
                car.rotation = Math.PI;
        
                layer.addChild(car);
        
                return;
            }
        
            const label = new Text({
                text: 'P',
                style: new TextStyle({
                fontSize: 80,
                fill:
                    i === 1
                    ? GAME_SETTINGS.secondCarColor
                    : GAME_SETTINGS.firstCarColor,
                fontFamily: 'Tahoma',
                fontWeight: 'bold',
                }),
            });
        
            label.anchor.set(0.5);
        
            label.x = spot.x + spot.width / 2;
            label.y = spot.y + spot.height / 2;
        
            layer.addChild(label);
        });
    }
    
    return spots.slice(1, 3);
}
