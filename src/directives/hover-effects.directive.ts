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
 * 画像ホバーズームディレクティブ
 * 洗練された画像ホバーズーム効果
 */
@Directive({
  selector: '[appHoverZoom]',
  standalone: true
})
export class HoverZoomDirective implements AfterViewInit, OnDestroy {
  @Input() zoomScale = 1.1;
  @Input() zoomDuration = 0.6;
  @Input() zoomEase = 'power2.out';

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

    // オーバーフローを隠す
    this.renderer.setStyle(element, 'overflow', 'hidden');

    // 画像を取得
    const img = element.querySelector('img') || element;

    // イベントリスナー
    const mouseEnter = () => {
      gsap.to(img, {
        scale: this.zoomScale,
        duration: this.zoomDuration,
        ease: this.zoomEase
      });
    };

    const mouseLeave = () => {
      gsap.to(img, {
        scale: 1,
        duration: this.zoomDuration,
        ease: this.zoomEase
      });
    };

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);

    this.listeners.push(
      () => element.removeEventListener('mouseenter', mouseEnter),
      () => element.removeEventListener('mouseleave', mouseLeave)
    );
  }

  ngOnDestroy() {
    this.listeners.forEach(fn => fn());
  }
}

/**
 * テキストホバースプリットディレクティブ
 * ホバー時にテキストが分割してアニメーション
 */
@Directive({
  selector: '[appHoverTextSplit]',
  standalone: true
})
export class HoverTextSplitDirective implements AfterViewInit, OnDestroy {
  @Input() splitDuration = 0.4;
  @Input() splitStagger = 0.02;
  @Input() splitColor = '#d4a876';

  private originalHTML = '';
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
    const text = element.textContent || '';
    this.originalHTML = element.innerHTML;

    // テキストをスパンでラップ
    element.innerHTML = '';
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.setStyle(element, 'overflow', 'hidden');
    this.renderer.setStyle(element, 'display', 'inline-block');

    // オリジナルテキストレイヤー
    const originalLayer = this.renderer.createElement('span');
    this.renderer.setStyle(originalLayer, 'display', 'inline-block');
    this.renderer.addClass(originalLayer, 'original-text');

    // ホバーテキストレイヤー
    const hoverLayer = this.renderer.createElement('span');
    this.renderer.setStyle(hoverLayer, 'position', 'absolute');
    this.renderer.setStyle(hoverLayer, 'top', '0');
    this.renderer.setStyle(hoverLayer, 'left', '0');
    this.renderer.setStyle(hoverLayer, 'color', this.splitColor);
    this.renderer.addClass(hoverLayer, 'hover-text');

    const originalChars: HTMLElement[] = [];
    const hoverChars: HTMLElement[] = [];

    // 各文字をスパンでラップ
    text.split('').forEach(char => {
      const oSpan = this.renderer.createElement('span');
      oSpan.textContent = char === ' ' ? '\u00A0' : char;
      this.renderer.setStyle(oSpan, 'display', 'inline-block');
      this.renderer.setStyle(oSpan, 'transition', 'transform 0.4s ease');
      this.renderer.appendChild(originalLayer, oSpan);
      originalChars.push(oSpan);

      const hSpan = this.renderer.createElement('span');
      hSpan.textContent = char === ' ' ? '\u00A0' : char;
      this.renderer.setStyle(hSpan, 'display', 'inline-block');
      this.renderer.setStyle(hSpan, 'transform', 'translateY(100%)');
      this.renderer.appendChild(hoverLayer, hSpan);
      hoverChars.push(hSpan);
    });

    this.renderer.appendChild(element, originalLayer);
    this.renderer.appendChild(element, hoverLayer);

    // イベントリスナー
    const mouseEnter = () => {
      gsap.to(originalChars, {
        y: '-100%',
        duration: this.splitDuration,
        stagger: this.splitStagger,
        ease: 'power2.inOut'
      });
      gsap.to(hoverChars, {
        y: '0%',
        duration: this.splitDuration,
        stagger: this.splitStagger,
        ease: 'power2.inOut'
      });
    };

    const mouseLeave = () => {
      gsap.to(originalChars, {
        y: '0%',
        duration: this.splitDuration,
        stagger: this.splitStagger,
        ease: 'power2.inOut'
      });
      gsap.to(hoverChars, {
        y: '100%',
        duration: this.splitDuration,
        stagger: this.splitStagger,
        ease: 'power2.inOut'
      });
    };

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);

    this.listeners.push(
      () => element.removeEventListener('mouseenter', mouseEnter),
      () => element.removeEventListener('mouseleave', mouseLeave)
    );
  }

  ngOnDestroy() {
    this.listeners.forEach(fn => fn());
  }
}

/**
 * ボタンホバーフィルディレクティブ
 * ホバー時にボタンが塗りつぶされるアニメーション
 */
@Directive({
  selector: '[appHoverFill]',
  standalone: true
})
export class HoverFillDirective implements AfterViewInit, OnDestroy {
  @Input() fillColor = '#d4a876';
  @Input() fillDirection: 'left' | 'right' | 'top' | 'bottom' | 'center' = 'left';
  @Input() fillDuration = 0.4;

  private fillElement: HTMLElement | null = null;
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

    // 要素の設定
    this.renderer.setStyle(element, 'position', 'relative');
    this.renderer.setStyle(element, 'overflow', 'hidden');
    this.renderer.setStyle(element, 'zIndex', '1');

    // 塗りつぶし要素を作成
    this.fillElement = this.renderer.createElement('span');
    this.renderer.setStyle(this.fillElement, 'position', 'absolute');
    this.renderer.setStyle(this.fillElement, 'top', '0');
    this.renderer.setStyle(this.fillElement, 'left', '0');
    this.renderer.setStyle(this.fillElement, 'width', '100%');
    this.renderer.setStyle(this.fillElement, 'height', '100%');
    this.renderer.setStyle(this.fillElement, 'background', this.fillColor);
    this.renderer.setStyle(this.fillElement, 'zIndex', '-1');
    this.renderer.setStyle(this.fillElement, 'transformOrigin', this.getTransformOrigin());

    // 初期スケールを設定
    const initialScale = this.fillDirection === 'center' ? 'scale(0)' :
      (this.fillDirection === 'left' || this.fillDirection === 'right') ? 'scaleX(0)' : 'scaleY(0)';
    this.renderer.setStyle(this.fillElement, 'transform', initialScale);

    this.renderer.appendChild(element, this.fillElement);

    // イベントリスナー
    const mouseEnter = () => {
      gsap.to(this.fillElement, {
        scaleX: 1,
        scaleY: 1,
        duration: this.fillDuration,
        ease: 'power2.out'
      });
    };

    const mouseLeave = () => {
      const targetScale = this.fillDirection === 'center' ? { scale: 0 } :
        (this.fillDirection === 'left' || this.fillDirection === 'right') ? { scaleX: 0 } : { scaleY: 0 };
      gsap.to(this.fillElement, {
        ...targetScale,
        duration: this.fillDuration,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);

    this.listeners.push(
      () => element.removeEventListener('mouseenter', mouseEnter),
      () => element.removeEventListener('mouseleave', mouseLeave)
    );
  }

  private getTransformOrigin(): string {
    switch (this.fillDirection) {
      case 'left': return 'left center';
      case 'right': return 'right center';
      case 'top': return 'center top';
      case 'bottom': return 'center bottom';
      case 'center': return 'center center';
      default: return 'left center';
    }
  }

  ngOnDestroy() {
    this.listeners.forEach(fn => fn());
  }
}

/**
 * カードホバーリフトディレクティブ
 * ホバー時にカードが浮き上がるような効果
 */
@Directive({
  selector: '[appHoverLift]',
  standalone: true
})
export class HoverLiftDirective implements AfterViewInit, OnDestroy {
  @Input() liftDistance = -10;
  @Input() liftDuration = 0.3;
  @Input() liftShadow = true;

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

    this.renderer.setStyle(element, 'transition', `box-shadow ${this.liftDuration}s ease`);

    const mouseEnter = () => {
      gsap.to(element, {
        y: this.liftDistance,
        duration: this.liftDuration,
        ease: 'power2.out'
      });
      if (this.liftShadow) {
        this.renderer.setStyle(element, 'boxShadow', '0 20px 40px rgba(0, 0, 0, 0.15)');
      }
    };

    const mouseLeave = () => {
      gsap.to(element, {
        y: 0,
        duration: this.liftDuration,
        ease: 'power2.out'
      });
      if (this.liftShadow) {
        this.renderer.setStyle(element, 'boxShadow', 'none');
      }
    };

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);

    this.listeners.push(
      () => element.removeEventListener('mouseenter', mouseEnter),
      () => element.removeEventListener('mouseleave', mouseLeave)
    );
  }

  ngOnDestroy() {
    this.listeners.forEach(fn => fn());
  }
}

/**
 * グリッチホバーディレクティブ
 * サイバーパンク風のグリッチ効果
 */
@Directive({
  selector: '[appHoverGlitch]',
  standalone: true
})
export class HoverGlitchDirective implements AfterViewInit, OnDestroy {
  @Input() glitchIntensity = 5;
  @Input() glitchDuration = 0.5;

  private originalText = '';
  private glitchInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: (() => void)[] = [];

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
    this.originalText = element.textContent || '';

    const mouseEnter = () => {
      let iterations = 0;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

      this.glitchInterval = setInterval(() => {
        element.textContent = this.originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return this.originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        iterations += 1 / this.glitchIntensity;

        if (iterations >= this.originalText.length) {
          element.textContent = this.originalText;
          if (this.glitchInterval) {
            clearInterval(this.glitchInterval);
          }
        }
      }, 30);
    };

    const mouseLeave = () => {
      if (this.glitchInterval) {
        clearInterval(this.glitchInterval);
      }
      element.textContent = this.originalText;
    };

    element.addEventListener('mouseenter', mouseEnter);
    element.addEventListener('mouseleave', mouseLeave);

    this.listeners.push(
      () => element.removeEventListener('mouseenter', mouseEnter),
      () => element.removeEventListener('mouseleave', mouseLeave)
    );
  }

  ngOnDestroy() {
    this.listeners.forEach(fn => fn());
    if (this.glitchInterval) {
      clearInterval(this.glitchInterval);
    }
  }
}
