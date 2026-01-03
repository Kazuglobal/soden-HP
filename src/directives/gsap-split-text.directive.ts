import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type SplitType = 'chars' | 'words' | 'lines';

@Directive({
  selector: '[appGsapSplitText]',
  standalone: true
})
export class GsapSplitTextDirective implements AfterViewInit, OnDestroy {
  @Input() splitType: SplitType = 'chars';
  @Input() delay = 50; // ms between each element
  @Input() duration = 0.6;
  @Input() ease = 'power3.out';
  @Input() from: gsap.TweenVars = { opacity: 0, y: 40 };
  @Input() to: gsap.TweenVars = { opacity: 1, y: 0 };
  @Input() threshold = 0.1;
  @Input() rootMargin = '-100px';
  @Output() animationComplete = new EventEmitter<void>();

  private splitElements: HTMLElement[] = [];
  private scrollTrigger: ScrollTrigger | null = null;
  private tween: gsap.core.Tween | null = null;
  private animationCompleted = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Wait for fonts to load
    if (document.fonts.status === 'loaded') {
      this.initAnimation();
    } else {
      document.fonts.ready.then(() => this.initAnimation());
    }
  }

  private initAnimation() {
    const text = this.el.nativeElement.textContent?.trim();
    if (!text) return;

    this.splitText();
    this.setupAnimation();
  }

  private splitText() {
    const element = this.el.nativeElement;
    const text = element.textContent || '';
    element.innerHTML = '';
    element.style.overflow = 'hidden';
    element.style.display = 'inline-block';

    let items: string[] = [];

    switch (this.splitType) {
      case 'chars':
        items = text.split('');
        break;
      case 'words':
        items = text.split(/\s+/).filter(w => w.length > 0);
        break;
      case 'lines':
        items = [text]; // Single line for now
        break;
    }

    items.forEach((item, index) => {
      const span = document.createElement('span');
      span.textContent = item;
      span.className = `split-${this.splitType.slice(0, -1)}`;
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';

      // Preserve whitespace for chars
      if (this.splitType === 'chars' && item === ' ') {
        span.style.width = '0.3em';
      }

      // Add space after words
      if (this.splitType === 'words' && index < items.length - 1) {
        span.innerHTML = item + '&nbsp;';
      }

      element.appendChild(span);
      this.splitElements.push(span);
    });
  }

  private setupAnimation() {
    const element = this.el.nativeElement;

    // Calculate scroll trigger start position
    const startPct = (1 - this.threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(this.rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? (marginMatch[2] || 'px') : 'px';
    const sign = marginValue === 0 ? '' :
      marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` :
      `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    // Set initial state
    gsap.set(this.splitElements, { ...this.from });

    // Create animation with ScrollTrigger
    this.tween = gsap.to(this.splitElements, {
      ...this.to,
      duration: this.duration,
      ease: this.ease,
      stagger: this.delay / 1000,
      scrollTrigger: {
        trigger: element,
        start,
        once: true
      },
      onComplete: () => {
        if (!this.animationCompleted) {
          this.animationCompleted = true;
          this.animationComplete.emit();
        }
      }
    });

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
    this.tween?.kill();
    this.splitElements = [];
  }
}
