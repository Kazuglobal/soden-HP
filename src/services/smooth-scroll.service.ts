import { Injectable, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * スムーズスクロールサービス
 * バターのように滑らかなスクロール体験を提供
 * Awwwardsサイトで標準的に使用される高級感のあるスクロール
 */
@Injectable({
  providedIn: 'root'
})
export class SmoothScrollService implements OnDestroy {
  private scrollY = 0;
  private currentScrollY = 0;
  private animationId: number | null = null;
  private isEnabled = false;
  private ease = 0.075; // スクロールの滑らかさ (低いほど滑らか)
  private wrapper: HTMLElement | null = null;
  private content: HTMLElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /**
   * スムーズスクロールを初期化
   * @param wrapperSelector ラッパー要素のセレクタ
   * @param contentSelector コンテンツ要素のセレクタ
   */
  init(wrapperSelector = '#smooth-wrapper', contentSelector = '#smooth-content') {
    if (!isPlatformBrowser(this.platformId)) return;

    this.wrapper = document.querySelector(wrapperSelector);
    this.content = document.querySelector(contentSelector);

    if (!this.wrapper || !this.content) {
      console.warn('Smooth scroll: Wrapper or content element not found');
      return;
    }

    this.isEnabled = true;
    this.setupStyles();
    this.bindEvents();
    this.startAnimation();
    this.setupScrollTrigger();
  }

  private setupStyles() {
    if (!this.wrapper || !this.content) return;

    // ラッパースタイル
    this.wrapper.style.position = 'fixed';
    this.wrapper.style.top = '0';
    this.wrapper.style.left = '0';
    this.wrapper.style.width = '100%';
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'hidden';

    // コンテンツスタイル
    this.content.style.willChange = 'transform';
  }

  private bindEvents() {
    window.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onScroll() {
    this.scrollY = window.scrollY;
  }

  private onResize() {
    if (!this.content) return;

    // body の高さをコンテンツに合わせて更新
    document.body.style.height = `${this.content.scrollHeight}px`;
    ScrollTrigger.refresh();
  }

  private startAnimation() {
    const animate = () => {
      if (!this.isEnabled || !this.content) {
        this.animationId = null;
        return;
      }

      // イージング補間
      this.currentScrollY += (this.scrollY - this.currentScrollY) * this.ease;

      // 小数点の誤差を防ぐ
      const roundedScroll = Math.round(this.currentScrollY * 100) / 100;

      gsap.set(this.content, {
        y: -roundedScroll
      });

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  private setupScrollTrigger() {
    if (!this.content) return;

    // body の高さを設定
    document.body.style.height = `${this.content.scrollHeight}px`;

    // ScrollTrigger を現在のスクロール位置に同期
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop: (value?: number) => {
        if (value !== undefined) {
          this.scrollY = value;
          this.currentScrollY = value;
        }
        return this.currentScrollY;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      }
    });

    ScrollTrigger.defaults({
      scroller: document.body
    });

    ScrollTrigger.refresh();
  }

  /**
   * 特定の要素または位置にスムーズスクロール
   */
  scrollTo(target: string | number | HTMLElement, duration = 1.2) {
    if (!isPlatformBrowser(this.platformId)) return;

    let targetY = 0;

    if (typeof target === 'number') {
      targetY = target;
    } else if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        targetY = element.getBoundingClientRect().top + this.currentScrollY;
      }
    } else if (target instanceof HTMLElement) {
      targetY = target.getBoundingClientRect().top + this.currentScrollY;
    }

    gsap.to(window, {
      scrollTo: targetY,
      duration,
      ease: 'power3.inOut'
    });
  }

  /**
   * スムーズスクロールを停止
   */
  disable() {
    this.isEnabled = false;
    if (this.wrapper) {
      this.wrapper.style.position = '';
      this.wrapper.style.top = '';
      this.wrapper.style.left = '';
      this.wrapper.style.width = '';
      this.wrapper.style.height = '';
      this.wrapper.style.overflow = '';
    }
    if (this.content) {
      this.content.style.willChange = '';
      this.content.style.transform = '';
    }
    document.body.style.height = '';
  }

  /**
   * スムーズスクロールを再開
   */
  enable() {
    if (!this.wrapper || !this.content) return;

    this.isEnabled = true;
    this.setupStyles();
    this.startAnimation();
    this.onResize();
  }

  /**
   * イージング値を設定
   */
  setEase(ease: number) {
    this.ease = Math.max(0.01, Math.min(1, ease));
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('scroll', this.onScroll.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
  }
}
