import gsap from 'gsap';
import {Application, Container, Graphics, Point, Sprite, Texture} from 'pixi.js';

export class FinalScene {
    private background: Sprite;
    private onClick?: () => void;

    constructor(
        public logo: Sprite, 
        public playBtn: Sprite,
        public layer: Container,
        public app:Application
        ){
        this.background = this.createBackground();

        this.logo.anchor.set(0.5);
        this.logo.scale.set(0);

        this.playBtn.anchor.set(0.5);
        this.playBtn.scale.set(0);
        this.playBtn.eventMode = 'static';
        this.playBtn.cursor = 'pointer';
    }

    private createBackground() {
        const background = new Sprite(Texture.WHITE);
        background.tint = 0x000000;
        background.alpha = 0.2;

        background.setSize(window.innerWidth*20, window.innerHeight*20 )
        background.x = -this.layer.parent.x - 2000;
        background.y = -this.layer.parent.y - 2000;
        background.eventMode = 'none';
        return background;
    }

    private btnHover() {
        const baseScale = 0.7;
        const hoverScale = 0.9;

        this.playBtn.on('pointerover', () => {
            gsap.to(this.playBtn.scale, {
              x: hoverScale,
              y: hoverScale,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
        
          this.playBtn.on('pointerout', () => {
            gsap.to(this.playBtn.scale, {
              x: baseScale,
              y: baseScale,
              duration: 0.3,
              ease: 'power2.out'
            });
          });
    }

    private startLogoAnimation() {

        gsap.to(this.logo.scale, {
          x: this.logo.scale.x * 1.05,
          y: this.logo.scale.y * 1.05,
          duration: 1.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1
        });
      
      }

    private handleClick = () => {
        if (this.onClick) this.onClick();
    }

    public showFinalView(pos: Point,onClick?: () => void) {
        this.onClick = onClick;
        this.logo.x = pos.x;
        this.logo.y = pos.y - 100;

        this.playBtn.x = pos.x;
        this.playBtn.y = pos.y + 200 + this.playBtn.y;

        this.layer.addChild(this.background);
        this.layer.addChild(this.logo);
        this.layer.addChild(this.playBtn);

        gsap.to(this.background, { duration: 1, alpha: 0.5, })
        
        gsap.to(this.logo, { pixi: {scale: 0.15}, duration: 1, ease: 'power2.out', onComplete: () => {
            this.startLogoAnimation();
        } });
        
        gsap.to(this.playBtn, {
          pixi: {
              scale: 0.7,
          },
          duration: 1,
          ease: 'power2.out',
          delay: 0.5,
          onComplete: () => {
            this.playBtn.on('pointerdown', this.handleClick);
            this.btnHover();
          },
        });
    }
}