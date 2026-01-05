import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * パララックス効果ディレクティブ
 * Apple、Nikeなどが使用する洗練されたスクロール連動アニメーション
 * 要素が異なる速度でスクロールし、深みのある視覚体験を提供
 */
@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  @Input() parallaxSpeed = 0.5; // 速度倍率 (0.1-2.0推奨)
  @Input() parallaxDirection: 'vertical' | 'horizontal' | 'both' = 'vertical';
  @Input() parallaxScale = false; // スケール変化を追加
  @Input() parallaxScaleRange: [number, number] = [0.8, 1.2];
  @Input() parallaxOpacity = false; // 透明度変化を追加
  @Input() parallaxOpacityRange: [number, number] = [0.3, 1];
  @Input() parallaxRotate = 0; // 回転角度 (0で無効)
  @Input() parallaxScrub = 1; // スクラブの滑らかさ (true, false, または数値)
  @Input() parallaxStart = 'top bottom'; // アニメーション開始位置
  @Input() parallaxEnd = 'bottom top'; // アニメーション終了位置

  private scrollTrigger: ScrollTrigger | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => this.init());
  }

  private init() {
    const element = this.el.nativeElement;

    // アニメーション値を計算
    const yMovement = this.parallaxDirection !== 'horizontal' ? 100 * this.parallaxSpeed : 0;
    const xMovement = this.parallaxDirection !== 'vertical' ? 100 * this.parallaxSpeed : 0;

    // アニメーションプロパティを構築
    const fromVars: gsap.TweenVars = {
      y: -yMovement,
      x: -xMovement
    };

    const toVars: gsap.TweenVars = {
      y: yMovement,
      x: xMovement,
      ease: 'none'
    };

    // オプショナルエフェクト
    if (this.parallaxScale) {
      fromVars['scale'] = this.parallaxScaleRange[0];
      toVars['scale'] = this.parallaxScaleRange[1];
    }

    if (this.parallaxOpacity) {
      fromVars['opacity'] = this.parallaxOpacityRange[0];
      toVars['opacity'] = this.parallaxOpacityRange[1];
    }

    if (this.parallaxRotate !== 0) {
      fromVars['rotation'] = -this.parallaxRotate;
      toVars['rotation'] = this.parallaxRotate;
    }

    // 初期状態を設定
    gsap.set(element, fromVars);

    // ScrollTriggerでアニメーション
    gsap.to(element, {
      ...toVars,
      scrollTrigger: {
        trigger: element,
        start: this.parallaxStart,
        end: this.parallaxEnd,
        scrub: this.parallaxScrub
      }
    });

    // ScrollTriggerの参照を保存
    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}

/**
 * 背景パララックス効果ディレクティブ
 * 背景画像に適用して、洗練された深度効果を実現
 */
@Directive({
  selector: '[appParallaxBg]',
  standalone: true
})
export class ParallaxBgDirective implements AfterViewInit, OnDestroy {
  @Input() parallaxBgSpeed = 0.3;
  @Input() parallaxBgStart = 'top bottom';
  @Input() parallaxBgEnd = 'bottom top';

  private scrollTrigger: ScrollTrigger | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    requestAnimationFrame(() => this.init());
  }

  private init() {
    const element = this.el.nativeElement;
    const movement = 100 * this.parallaxBgSpeed;

    gsap.fromTo(element,
      { backgroundPositionY: `-${movement}px` },
      {
        backgroundPositionY: `${movement}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: this.parallaxBgStart,
          end: this.parallaxBgEnd,
          scrub: true
        }
      }
    );

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}
