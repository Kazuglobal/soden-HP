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
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RevealDirection = 'left' | 'right' | 'top' | 'bottom' | 'center';

/**
 * マスクリビールアニメーションディレクティブ
 * 画像やコンテンツが洗練された方法でリビール
 * Awwwards、FWA受賞サイトで頻繁に使用される効果
 */
@Directive({
  selector: '[appMaskReveal]',
  standalone: true
})
export class MaskRevealDirective implements AfterViewInit, OnDestroy {
  @Input() revealDirection: RevealDirection = 'left';
  @Input() revealDuration = 1.2;
  @Input() revealDelay = 0;
  @Input() revealEase = 'power4.inOut';
  @Input() revealColor = '#d4a876'; // マスクの色
  @Input() revealThreshold = 0.3;
  @Input() revealScale = true; // 画像のスケールアニメーション

  private overlay: HTMLElement | null = null;
  private scrollTrigger: ScrollTrigger | null = null;

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

    // 要素をラップ
    const wrapper = this.renderer.createElement('div');
    this.renderer.setStyle(wrapper, 'position', 'relative');
    this.renderer.setStyle(wrapper, 'overflow', 'hidden');
    this.renderer.setStyle(wrapper, 'display', 'inline-block');
    this.renderer.setStyle(wrapper, 'width', '100%');

    // 親要素に挿入
    const parent = element.parentElement;
    if (parent) {
      this.renderer.insertBefore(parent, wrapper, element);
      this.renderer.appendChild(wrapper, element);
    }

    // オーバーレイを作成
    this.overlay = this.renderer.createElement('div');
    this.renderer.setStyle(this.overlay, 'position', 'absolute');
    this.renderer.setStyle(this.overlay, 'top', '0');
    this.renderer.setStyle(this.overlay, 'left', '0');
    this.renderer.setStyle(this.overlay, 'width', '100%');
    this.renderer.setStyle(this.overlay, 'height', '100%');
    this.renderer.setStyle(this.overlay, 'background', this.revealColor);
    this.renderer.setStyle(this.overlay, 'zIndex', '10');
    this.renderer.setStyle(this.overlay, 'transformOrigin', this.getTransformOrigin());
    this.renderer.appendChild(wrapper, this.overlay);

    // 初期状態
    gsap.set(element, {
      scale: this.revealScale ? 1.3 : 1,
      opacity: 0
    });

    // アニメーションタイムライン
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: `top ${(1 - this.revealThreshold) * 100}%`,
        once: true
      }
    });

    // オーバーレイアニメーション
    tl.to(this.overlay, {
      scaleX: this.revealDirection === 'left' || this.revealDirection === 'right' ? 0 : 1,
      scaleY: this.revealDirection === 'top' || this.revealDirection === 'bottom' ? 0 : 1,
      duration: this.revealDuration,
      delay: this.revealDelay,
      ease: this.revealEase
    });

    // コンテンツアニメーション
    tl.to(element, {
      scale: 1,
      opacity: 1,
      duration: this.revealDuration * 0.8,
      ease: 'power2.out'
    }, `-=${this.revealDuration * 0.6}`);

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === wrapper
    ) || null;
  }

  private getTransformOrigin(): string {
    switch (this.revealDirection) {
      case 'left': return 'left center';
      case 'right': return 'right center';
      case 'top': return 'center top';
      case 'bottom': return 'center bottom';
      case 'center': return 'center center';
      default: return 'left center';
    }
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}

/**
 * 画像スライドリビールディレクティブ
 * より洗練された画像リビール効果
 */
@Directive({
  selector: '[appImageReveal]',
  standalone: true
})
export class ImageRevealDirective implements AfterViewInit, OnDestroy {
  @Input() imageRevealDirection: 'horizontal' | 'vertical' | 'diagonal' = 'horizontal';
  @Input() imageRevealDuration = 1.5;
  @Input() imageRevealDelay = 0;
  @Input() imageRevealEase = 'expo.inOut';

  private scrollTrigger: ScrollTrigger | null = null;

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

    // オーバーフロー設定
    this.renderer.setStyle(element, 'overflow', 'hidden');

    // 画像要素を取得
    const img = element.tagName === 'IMG' ? element : element.querySelector('img');
    if (!img) return;

    // クリップパスの初期値
    let clipPathFrom = '';
    let clipPathTo = 'inset(0% 0% 0% 0%)';

    switch (this.imageRevealDirection) {
      case 'horizontal':
        clipPathFrom = 'inset(0% 100% 0% 0%)';
        break;
      case 'vertical':
        clipPathFrom = 'inset(100% 0% 0% 0%)';
        break;
      case 'diagonal':
        clipPathFrom = 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)';
        clipPathTo = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
        break;
    }

    // 初期状態
    gsap.set(img, {
      scale: 1.2,
      clipPath: clipPathFrom
    });

    // アニメーション
    gsap.to(img, {
      scale: 1,
      clipPath: clipPathTo,
      duration: this.imageRevealDuration,
      delay: this.imageRevealDelay,
      ease: this.imageRevealEase,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true
      }
    });

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}

/**
 * テキストマスクリビールディレクティブ
 * テキストが一文字ずつリビール
 */
@Directive({
  selector: '[appTextMaskReveal]',
  standalone: true
})
export class TextMaskRevealDirective implements AfterViewInit, OnDestroy {
  @Input() textRevealDuration = 0.8;
  @Input() textRevealStagger = 0.02;
  @Input() textRevealEase = 'power3.out';
  @Input() textRevealDirection: 'up' | 'down' = 'up';

  private scrollTrigger: ScrollTrigger | null = null;

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

    // 元のテキストをクリア
    element.textContent = '';
    this.renderer.setStyle(element, 'display', 'inline-flex');
    this.renderer.setStyle(element, 'flexWrap', 'wrap');

    // 各文字をラップ
    const chars: HTMLElement[] = [];
    text.split('').forEach(char => {
      const wrapper = this.renderer.createElement('span');
      this.renderer.setStyle(wrapper, 'display', 'inline-block');
      this.renderer.setStyle(wrapper, 'overflow', 'hidden');
      this.renderer.setStyle(wrapper, 'verticalAlign', 'top');

      const charSpan = this.renderer.createElement('span');
      this.renderer.setStyle(charSpan, 'display', 'inline-block');
      charSpan.textContent = char === ' ' ? '\u00A0' : char;

      this.renderer.appendChild(wrapper, charSpan);
      this.renderer.appendChild(element, wrapper);
      chars.push(charSpan);
    });

    // 初期状態
    const yOffset = this.textRevealDirection === 'up' ? '110%' : '-110%';
    gsap.set(chars, { y: yOffset });

    // アニメーション
    gsap.to(chars, {
      y: '0%',
      duration: this.textRevealDuration,
      stagger: this.textRevealStagger,
      ease: this.textRevealEase,
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        once: true
      }
    });

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}
