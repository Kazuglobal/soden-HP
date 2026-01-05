import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  Renderer2
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

/**
 * 3Dチルト効果ディレクティブ
 * Apple、Stripeなどの世界的企業が使用する洗練された3D傾斜効果
 * マウス位置に応じてカードが3Dで傾き、奥行き感を演出
 */
@Directive({
  selector: '[appTilt3D]',
  standalone: true
})
export class Tilt3DDirective implements AfterViewInit, OnDestroy {
  @Input() tiltMaxX = 15; // X軸最大傾斜角度
  @Input() tiltMaxY = 15; // Y軸最大傾斜角度
  @Input() tiltPerspective = 1000; // パースペクティブ
  @Input() tiltScale = 1.02; // ホバー時のスケール
  @Input() tiltSpeed = 400; // トランジション速度 (ms)
  @Input() tiltGlare = true; // グレア効果
  @Input() tiltGlareOpacity = 0.2; // グレアの最大透明度
  @Input() tiltReverse = false; // 傾斜を反転

  private glareElement: HTMLElement | null = null;
  private listeners: (() => void)[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => this.init());
  }

  private init() {
    const element = this.el.nativeElement;

    // 親要素にパースペクティブ設定
    const parent = element.parentElement;
    if (parent) {
      this.renderer.setStyle(parent, 'perspective', `${this.tiltPerspective}px`);
    }

    // 要素のスタイル設定
    this.renderer.setStyle(element, 'transformStyle', 'preserve-3d');
    this.renderer.setStyle(element, 'willChange', 'transform');

    // グレア要素を作成
    if (this.tiltGlare) {
      this.createGlare();
    }

    // イベントリスナー
    const mouseEnter = (e: MouseEvent) => this.onMouseEnter(e);
    const mouseLeave = () => this.onMouseLeave();
    const mouseMove = (e: MouseEvent) => this.onMouseMove(e);

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);
    element.addEventListener('mousemove', mouseMove);

    this.listeners.push(
      () => element.removeEventListener('mouseenter', mouseEnter),
      () => element.removeEventListener('mouseleave', mouseLeave),
      () => element.removeEventListener('mousemove', mouseMove)
    );
  }

  private createGlare() {
    const element = this.el.nativeElement;

    // グレアコンテナ
    const glareWrapper = this.renderer.createElement('div');
    this.renderer.setStyle(glareWrapper, 'position', 'absolute');
    this.renderer.setStyle(glareWrapper, 'top', '0');
    this.renderer.setStyle(glareWrapper, 'left', '0');
    this.renderer.setStyle(glareWrapper, 'width', '100%');
    this.renderer.setStyle(glareWrapper, 'height', '100%');
    this.renderer.setStyle(glareWrapper, 'overflow', 'hidden');
    this.renderer.setStyle(glareWrapper, 'borderRadius', 'inherit');
    this.renderer.setStyle(glareWrapper, 'pointerEvents', 'none');

    // グレア要素
    this.glareElement = this.renderer.createElement('div');
    this.renderer.setStyle(this.glareElement, 'position', 'absolute');
    this.renderer.setStyle(this.glareElement, 'top', '50%');
    this.renderer.setStyle(this.glareElement, 'left', '50%');
    this.renderer.setStyle(this.glareElement, 'width', '200%');
    this.renderer.setStyle(this.glareElement, 'height', '200%');
    this.renderer.setStyle(this.glareElement, 'background',
      'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)');
    this.renderer.setStyle(this.glareElement, 'transform', 'rotate(180deg) translate(-50%, -50%)');
    this.renderer.setStyle(this.glareElement, 'transformOrigin', '0% 0%');
    this.renderer.setStyle(this.glareElement, 'opacity', '0');

    this.renderer.appendChild(glareWrapper, this.glareElement);

    // 要素のposition確認
    const computedStyle = window.getComputedStyle(element);
    if (computedStyle.position === 'static') {
      this.renderer.setStyle(element, 'position', 'relative');
    }

    this.renderer.appendChild(element, glareWrapper);
  }

  private onMouseEnter(e: MouseEvent) {
    gsap.to(this.el.nativeElement, {
      scale: this.tiltScale,
      duration: this.tiltSpeed / 1000,
      ease: 'power2.out'
    });

    this.onMouseMove(e);
  }

  private onMouseLeave() {
    gsap.to(this.el.nativeElement, {
      rotationX: 0,
      rotationY: 0,
      scale: 1,
      duration: this.tiltSpeed / 1000,
      ease: 'power2.out'
    });

    if (this.glareElement) {
      gsap.to(this.glareElement, {
        opacity: 0,
        duration: this.tiltSpeed / 1000
      });
    }
  }

  private onMouseMove(e: MouseEvent) {
    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // -0.5 ~ 0.5 の範囲に正規化
    const normalizedX = (x / width) - 0.5;
    const normalizedY = (y / height) - 0.5;

    // 傾斜角度を計算
    const multiplier = this.tiltReverse ? -1 : 1;
    const rotateX = normalizedY * this.tiltMaxX * multiplier * -1;
    const rotateY = normalizedX * this.tiltMaxY * multiplier;

    gsap.to(element, {
      rotationX: rotateX,
      rotationY: rotateY,
      duration: 0.1,
      ease: 'power2.out'
    });

    // グレアの更新
    if (this.glareElement) {
      const glareAngle = Math.atan2(normalizedY, normalizedX) * (180 / Math.PI) - 90;
      const glareOpacity = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY) * this.tiltGlareOpacity;

      gsap.to(this.glareElement, {
        rotation: glareAngle,
        opacity: Math.min(glareOpacity, this.tiltGlareOpacity),
        duration: 0.1
      });
    }
  }

  ngOnDestroy() {
    this.listeners.forEach(fn => fn());
  }
}
