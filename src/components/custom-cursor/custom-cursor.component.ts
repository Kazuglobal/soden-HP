import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  signal,
  HostListener
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { gsap } from 'gsap';

/**
 * カスタムカーソルコンポーネント
 * Awwwards受賞サイトで頻繁に見られる洗練されたカーソル効果
 * マウスに追従する2つの円で構成され、インタラクション時に変化
 */
@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isBrowser && !isTouchDevice()) {
      <div class="cursor-wrapper">
        <div #cursorDot class="cursor-dot"></div>
        <div #cursorOutline class="cursor-outline"></div>
        <div #cursorText class="cursor-text">{{ cursorLabel() }}</div>
      </div>
    }
  `,
  styles: [`
    :host {
      pointer-events: none;
      z-index: 99999;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .cursor-wrapper {
      pointer-events: none;
    }

    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, #d4a876 0%, #ff8c42 100%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 100001;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
    }

    .cursor-outline {
      position: fixed;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      border: 2px solid rgba(212, 168, 118, 0.5);
      border-radius: 50%;
      pointer-events: none;
      z-index: 100000;
      transform: translate(-50%, -50%);
      transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
    }

    .cursor-text {
      position: fixed;
      top: 0;
      left: 0;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      pointer-events: none;
      z-index: 100002;
      transform: translate(-50%, -50%);
      opacity: 0;
      white-space: nowrap;
    }

    :host-context(body.cursor-hover) .cursor-outline {
      width: 60px;
      height: 60px;
      border-color: rgba(212, 168, 118, 0.8);
      background-color: rgba(212, 168, 118, 0.1);
    }

    :host-context(body.cursor-active) .cursor-dot {
      transform: translate(-50%, -50%) scale(0.5);
    }

    :host-context(body.cursor-active) .cursor-outline {
      width: 30px;
      height: 30px;
    }

    :host-context(body.cursor-hidden) .cursor-dot,
    :host-context(body.cursor-hidden) .cursor-outline {
      opacity: 0;
    }
  `]
})
export class CustomCursorComponent implements OnInit, OnDestroy {
  isBrowser = false;
  cursorLabel = signal('');
  isTouchDevice = signal(false);

  private cursorDot: HTMLElement | null = null;
  private cursorOutline: HTMLElement | null = null;
  private cursorText: HTMLElement | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private outlineX = 0;
  private outlineY = 0;
  private animationId: number | null = null;
  private mutationObserver: MutationObserver | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    // タッチデバイス検出
    this.isTouchDevice.set(
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );

    if (this.isTouchDevice()) return;

    // デフォルトカーソルを非表示に
    document.body.style.cursor = 'none';

    requestAnimationFrame(() => {
      this.cursorDot = document.querySelector('.cursor-dot');
      this.cursorOutline = document.querySelector('.cursor-outline');
      this.cursorText = document.querySelector('.cursor-text');

      if (this.cursorDot && this.cursorOutline) {
        this.initCursor();
        this.initHoverListeners();
      }
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  @HostListener('document:mousedown')
  onMouseDown() {
    document.body.classList.add('cursor-active');
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    document.body.classList.remove('cursor-active');
  }

  @HostListener('document:mouseleave')
  onMouseLeave() {
    document.body.classList.add('cursor-hidden');
  }

  @HostListener('document:mouseenter')
  onMouseEnter() {
    document.body.classList.remove('cursor-hidden');
  }

  private initCursor() {
    const animate = () => {
      // ドットはマウスに直接追従
      gsap.set(this.cursorDot, {
        x: this.mouseX,
        y: this.mouseY
      });

      // アウトラインはイージングで追従
      this.outlineX += (this.mouseX - this.outlineX) * 0.15;
      this.outlineY += (this.mouseY - this.outlineY) * 0.15;

      gsap.set(this.cursorOutline, {
        x: this.outlineX,
        y: this.outlineY
      });

      gsap.set(this.cursorText, {
        x: this.outlineX,
        y: this.outlineY
      });

      this.animationId = requestAnimationFrame(animate);
    };

    this.animationId = requestAnimationFrame(animate);
  }

  private initHoverListeners() {
    // インタラクティブ要素にホバーリスナーを追加
    const setupHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [data-cursor], input[type="submit"], .cursor-hover'
      );

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => this.handleHoverEnter(el as HTMLElement));
        el.addEventListener('mouseleave', () => this.handleHoverLeave());
      });
    };

    setupHoverListeners();

    // DOM変更を監視して新しい要素にもリスナーを追加
    this.mutationObserver = new MutationObserver(() => {
      setupHoverListeners();
    });

    this.mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private handleHoverEnter(element: HTMLElement) {
    document.body.classList.add('cursor-hover');

    // data-cursor属性でカスタムラベルを設定可能
    const label = element.getAttribute('data-cursor');
    if (label) {
      this.cursorLabel.set(label);
      gsap.to(this.cursorText, {
        opacity: 1,
        duration: 0.3
      });
      gsap.to(this.cursorOutline, {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(212, 168, 118, 0.9)',
        duration: 0.3
      });
    }

    // 要素にカーソルスタイルを設定
    element.style.cursor = 'none';
  }

  private handleHoverLeave() {
    document.body.classList.remove('cursor-hover');
    this.cursorLabel.set('');

    gsap.to(this.cursorText, {
      opacity: 0,
      duration: 0.3
    });
    gsap.to(this.cursorOutline, {
      width: 40,
      height: 40,
      backgroundColor: 'transparent',
      duration: 0.3
    });
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    if (this.isBrowser) {
      document.body.style.cursor = '';
      document.body.classList.remove('cursor-hover', 'cursor-active', 'cursor-hidden');
    }
  }
}
