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
 * マグネティック効果ディレクティブ
 * マウスに引き寄せられるようなインタラクティブな効果を提供
 * Awwwards受賞サイトで頻繁に使用される高級感のあるアニメーション
 */
@Directive({
  selector: '[appMagnetic]',
  standalone: true
})
export class MagneticDirective implements AfterViewInit, OnDestroy {
  @Input() magneticStrength = 0.3; // 引力の強さ (0-1)
  @Input() magneticEase = 0.15; // 追従の滑らかさ
  @Input() magneticScale = 1.05; // ホバー時のスケール
  @Input() magneticRotation = true; // 微細な回転を追加
  @Input() magneticGlow = true; // グロー効果を追加

  private boundingRect: DOMRect | null = null;
  private animationId: number | null = null;
  private targetX = 0;
  private targetY = 0;
  private currentX = 0;
  private currentY = 0;
  private isHovering = false;
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

    // スタイル設定
    this.renderer.setStyle(element, 'willChange', 'transform');
    this.renderer.setStyle(element, 'transition', 'box-shadow 0.3s ease');

    // イベントリスナー
    const mouseEnter = () => this.onMouseEnter();
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

  private onMouseEnter() {
    this.isHovering = true;
    this.boundingRect = this.el.nativeElement.getBoundingClientRect();
    this.startAnimation();

    const element = this.el.nativeElement;

    gsap.to(element, {
      scale: this.magneticScale,
      duration: 0.4,
      ease: 'power2.out'
    });

    if (this.magneticGlow) {
      this.renderer.setStyle(element, 'boxShadow', '0 10px 40px rgba(212, 168, 118, 0.3)');
    }
  }

  private onMouseLeave() {
    this.isHovering = false;
    this.targetX = 0;
    this.targetY = 0;

    const element = this.el.nativeElement;

    gsap.to(element, {
      scale: 1,
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.5)'
    });

    if (this.magneticGlow) {
      this.renderer.setStyle(element, 'boxShadow', 'none');
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.boundingRect || !this.isHovering) return;

    const { left, top, width, height } = this.boundingRect;
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    this.targetX = (e.clientX - centerX) * this.magneticStrength;
    this.targetY = (e.clientY - centerY) * this.magneticStrength;
  }

  private startAnimation() {
    const animate = () => {
      if (!this.isHovering && Math.abs(this.currentX) < 0.01 && Math.abs(this.currentY) < 0.01) {
        this.animationId = null;
        return;
      }

      // イージング補間
      this.currentX += (this.targetX - this.currentX) * this.magneticEase;
      this.currentY += (this.targetY - this.currentY) * this.magneticEase;

      const element = this.el.nativeElement;

      if (this.magneticRotation) {
        gsap.set(element, {
          x: this.currentX,
          y: this.currentY,
          rotationY: this.currentX * 0.1,
          rotationX: -this.currentY * 0.1
        });
      } else {
        gsap.set(element, {
          x: this.currentX,
          y: this.currentY
        });
      }

      this.animationId = requestAnimationFrame(animate);
    };

    if (!this.animationId) {
      this.animationId = requestAnimationFrame(animate);
    }
  }

  ngOnDestroy() {
    this.listeners.forEach(fn => fn());
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
