import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type AnimationType = 'fadeUp' | 'fadeIn' | 'fadeDown' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn';

@Directive({
  selector: '[appGsapAnimate]',
  standalone: true
})
export class GsapScrollAnimateDirective implements AfterViewInit, OnDestroy {
  @Input() animation: AnimationType = 'fadeUp';
  @Input() duration = 0.8;
  @Input() delay = 0;
  @Input() ease = 'power3.out';
  @Input() stagger = 0;
  @Input() staggerFrom: 'start' | 'center' | 'end' = 'start';
  @Input() threshold = 0.2;
  @Input() distance = 60;
  @Input() scale = 0.8;
  @Input() rotation = 10;

  private tween: gsap.core.Tween | null = null;
  private scrollTrigger: ScrollTrigger | null = null;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Small delay to ensure DOM is ready
    requestAnimationFrame(() => this.initAnimation());
  }

  private getAnimationConfig(): { from: gsap.TweenVars; to: gsap.TweenVars } {
    const base = { opacity: 0 };
    const toBase = { opacity: 1 };

    switch (this.animation) {
      case 'fadeUp':
        return {
          from: { ...base, y: this.distance },
          to: { ...toBase, y: 0 }
        };
      case 'fadeDown':
        return {
          from: { ...base, y: -this.distance },
          to: { ...toBase, y: 0 }
        };
      case 'fadeIn':
        return {
          from: base,
          to: toBase
        };
      case 'slideLeft':
        return {
          from: { ...base, x: this.distance },
          to: { ...toBase, x: 0 }
        };
      case 'slideRight':
        return {
          from: { ...base, x: -this.distance },
          to: { ...toBase, x: 0 }
        };
      case 'scaleIn':
        return {
          from: { ...base, scale: this.scale },
          to: { ...toBase, scale: 1 }
        };
      case 'rotateIn':
        return {
          from: { ...base, rotation: this.rotation, y: this.distance / 2 },
          to: { ...toBase, rotation: 0, y: 0 }
        };
      default:
        return {
          from: { ...base, y: this.distance },
          to: { ...toBase, y: 0 }
        };
    }
  }

  private initAnimation() {
    const element = this.el.nativeElement;
    const { from, to } = this.getAnimationConfig();

    // Determine targets (children if stagger > 0, else element itself)
    let targets: Element | Element[] = element;
    if (this.stagger > 0) {
      const children = Array.from(element.children);
      if (children.length > 0) {
        targets = children;
      }
    }

    // Set initial state
    gsap.set(targets, { ...from, willChange: 'transform, opacity' });

    // Calculate start position
    const startPct = (1 - this.threshold) * 100;

    // Create animation
    this.tween = gsap.to(targets, {
      ...to,
      duration: this.duration,
      delay: this.delay,
      ease: this.ease,
      stagger: this.stagger > 0 ? {
        each: this.stagger,
        from: this.staggerFrom
      } : 0,
      scrollTrigger: {
        trigger: element,
        start: `top ${startPct}%`,
        once: true
      },
      clearProps: 'willChange'
    });

    this.scrollTrigger = ScrollTrigger.getAll().find(
      st => st.trigger === element
    ) || null;
  }

  ngOnDestroy() {
    this.scrollTrigger?.kill();
    this.tween?.kill();
  }
}
