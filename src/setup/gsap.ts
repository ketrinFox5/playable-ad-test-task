import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { PixiPlugin } from 'gsap/PixiPlugin'
import * as PIXI from 'pixi.js'

gsap.registerPlugin(MotionPathPlugin, PixiPlugin)

PixiPlugin.registerPIXI(PIXI)