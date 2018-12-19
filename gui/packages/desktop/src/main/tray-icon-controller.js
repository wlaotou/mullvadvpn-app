// @flow

import path from 'path';
import KeyframeAnimation from './keyframe-animation';
import { nativeImage } from 'electron';
import type { NativeImage, Tray } from 'electron';

export type TrayIconType = 'unsecured' | 'securing' | 'secured';

export default class TrayIconController {
  _animation: ?KeyframeAnimation;
  _iconType: TrayIconType;
  _iconImages: Array<NativeImage>;

  constructor(tray: Tray, initialType: TrayIconType) {
    this._loadImages();
    this._iconType = initialType;

    const initialFrame = this._targetFrame();
    const animation = new KeyframeAnimation();
    animation.speed = 100;
    animation.onFrame = (frameNumber) => tray.setImage(this._iconImages[frameNumber]);
    animation.play({ start: initialFrame, end: initialFrame });

    this._animation = animation;
  }

  dispose() {
    if (this._animation) {
      this._animation.stop();
      this._animation = null;
    }
  }

  get iconType(): TrayIconType {
    return this._iconType;
  }

  animateToIcon(type: TrayIconType) {
    if (this._iconType === type || !this._animation) {
      return;
    }

    this._iconType = type;

    const animation = this._animation;
    const frame = this._targetFrame();

    animation.play({ end: frame });
  }

  _loadImages() {
    const basePath = path.resolve(path.join(__dirname, '../assets/images/menubar icons'));
    const frames = Array.from({ length: 10 }, (_, i) => i + 1);

    this._iconImages = frames.map((frame) =>
      nativeImage.createFromPath(path.join(basePath, `lock-${frame}.png`)),
    );
  }

  _targetFrame(): number {
    switch (this._iconType) {
      case 'unsecured':
        return 0;
      case 'securing':
        return 9;
      case 'secured':
        return 8;
      default:
        throw new Error(`Unknown tray icon type: ${(this._iconType: empty)}`);
    }
  }
}
