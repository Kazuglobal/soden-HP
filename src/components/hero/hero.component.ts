import { Component, ChangeDetectionStrategy, signal, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapSplitTextDirective, ScrollAnimateDirective],
  styles: [`
    .hero-slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 1.5s ease-in-out;
    }
    .hero-slide.active {
      opacity: 1;
    }
    .hero-slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transform: scale(1);
      transition: transform 8s ease-out;
    }
    .hero-slide.active img {
      transform: scale(1.08);
    }
    .hero-gradient {
      background: linear-gradient(
        135deg,
        rgba(34, 197, 94, 0.15) 0%,
        rgba(16, 185, 129, 0.1) 50%,
        rgba(20, 184, 166, 0.15) 100%
      );
    }
    .hero-overlay {
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.3) 0%,
        rgba(255, 255, 255, 0.5) 40%,
        rgba(240, 253, 244, 0.7) 100%
      );
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private slideInterval: any;

  // 会社の雰囲気に合う明るい業務風景画像
  heroImages = [
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&h=1080&fit=crop', // 電気工事
    'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=1920&h=1080&fit=crop', // チームワーク
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop', // 技術者
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=1080&fit=crop', // モダンな建物
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
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
      this.currentSlide.update(current =>
        (current + 1) % this.heroImages.length
      );
    }, 5000);
  }
}
