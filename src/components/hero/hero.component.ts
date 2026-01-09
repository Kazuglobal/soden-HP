import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
    }
    .hero-image {
      transition: transform 8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .hero-image.active {
      transform: scale(1.05);
    }
    .vertical-text {
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
    .line-reveal {
      overflow: hidden;
    }
    .line-reveal span {
      display: block;
      transform: translateY(100%);
      animation: lineReveal 1s cubic-bezier(0.65, 0, 0.35, 1) forwards;
    }
    @keyframes lineReveal {
      to {
        transform: translateY(0);
      }
    }
    .fade-in-up {
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  isImageLoaded = signal(false);
  private slideInterval: any;

  heroImages = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&h=1000&fit=crop&q=90',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1400&h=1000&fit=crop&q=90',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&h=1000&fit=crop&q=90',
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.isImageLoaded.set(true), 100);
      this.startSlideshow();
    }
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.isImageLoaded.set(false);
      setTimeout(() => {
        this.currentSlide.update(current =>
          (current + 1) % this.heroImages.length
        );
        this.isImageLoaded.set(true);
      }, 100);
    }, 6000);
  }
}
