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
 * カウントアップアニメーションディレクティブ
 * 数字が洗練された方法でカウントアップ
 * 統計やKPIの表示に最適
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements AfterViewInit, OnDestroy {
  @Input() countTo = 0; // 目標値
  @Input() countFrom = 0; // 開始値
  @Input() countDuration = 2; // アニメーション時間 (秒)
  @Input() countDecimals = 0; // 小数点以下の桁数
  @Input() countPrefix = ''; // プレフィックス (例: '¥')
  @Input() countSuffix = ''; // サフィックス (例: '%', '+')
  @Input() countSeparator = ','; // 千の位区切り
  @Input() countEase = 'power2.out'; // イージング
  @Input() countThreshold = 0.5; // 開始位置のしきい値

  private scrollTrigger: ScrollTrigger | null = null;
  private counter = { value: 0 };

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
    this.counter.value = this.countFrom;

    // 初期値を設定
    element.textContent = this.formatNumber(this.countFrom);

    // スクロールトリガーでアニメーション
    gsap.to(this.counter, {
      value: this.countTo,
      duration: this.countDuration,
      ease: this.countEase,
      onUpdate: () => {
        element.textContent = this.formatNumber(this.counter.value);
      },
      scrollTrigger: {
        trigger: element,
        start: `top ${(1 - this.countThreshold) * 100}%`,
        once: true
      }
    });

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  private formatNumber(num: number): string {
    // 小数点の処理
    const fixed = num.toFixed(this.countDecimals);

    // 千の位区切り
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.countSeparator);
    const formatted = parts.join('.');

    return `${this.countPrefix}${formatted}${this.countSuffix}`;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}

/**
 * アニメーション数字ディレクティブ
 * 各桁が個別にスロットマシンのようにアニメーション
 */
@Directive({
  selector: '[appAnimatedDigits]',
  standalone: true
})
export class AnimatedDigitsDirective implements AfterViewInit, OnDestroy {
  @Input() targetNumber = 0;
  @Input() digitDuration = 1.5;
  @Input() digitStagger = 0.1;
  @Input() digitPrefix = '';
  @Input() digitSuffix = '';

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
    const numberStr = this.targetNumber.toString();

    // 各桁用のコンテナを作成
    element.innerHTML = '';
    element.style.display = 'inline-flex';
    element.style.overflow = 'hidden';

    // プレフィックス
    if (this.digitPrefix) {
      const prefixSpan = document.createElement('span');
      prefixSpan.textContent = this.digitPrefix;
      prefixSpan.style.opacity = '0';
      element.appendChild(prefixSpan);
    }

    const digitContainers: HTMLElement[] = [];

    // 各桁のコンテナを作成
    numberStr.split('').forEach((char) => {
      const container = document.createElement('span');
      container.style.display = 'inline-block';
      container.style.overflow = 'hidden';
      container.style.height = '1em';
      container.style.lineHeight = '1em';

      const inner = document.createElement('span');
      inner.style.display = 'block';

      if (isNaN(parseInt(char))) {
        // 数字以外（カンマなど）
        inner.textContent = char;
        inner.style.opacity = '0';
      } else {
        // 数字の場合、0-9を含むスロットを作成
        const num = parseInt(char);
        for (let i = 0; i <= num; i++) {
          const digitSpan = document.createElement('span');
          digitSpan.textContent = i.toString();
          digitSpan.style.display = 'block';
          digitSpan.style.height = '1em';
          inner.appendChild(digitSpan);
        }
        inner.style.transform = `translateY(-${num}em)`;
        inner.style.opacity = '0';
      }

      container.appendChild(inner);
      element.appendChild(container);
      digitContainers.push(inner);
    });

    // サフィックス
    if (this.digitSuffix) {
      const suffixSpan = document.createElement('span');
      suffixSpan.textContent = this.digitSuffix;
      suffixSpan.style.opacity = '0';
      element.appendChild(suffixSpan);
    }

    // アニメーション
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        once: true
      }
    });

    // プレフィックスをフェードイン
    if (this.digitPrefix) {
      tl.to(element.firstChild, {
        opacity: 1,
        duration: 0.3
      }, 0);
    }

    // 各桁をアニメーション
    digitContainers.forEach((inner, index) => {
      const char = numberStr[index];
      const num = parseInt(char);

      if (isNaN(num)) {
        tl.to(inner, {
          opacity: 1,
          duration: 0.3
        }, index * this.digitStagger);
      } else {
        tl.fromTo(inner,
          { y: 0, opacity: 0 },
          {
            y: `-${num}em`,
            opacity: 1,
            duration: this.digitDuration,
            ease: 'power2.out'
          },
          index * this.digitStagger
        );
      }
    });

    // サフィックスをフェードイン
    if (this.digitSuffix) {
      tl.to(element.lastChild, {
        opacity: 1,
        duration: 0.3
      }, digitContainers.length * this.digitStagger);
    }

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
  }
}
