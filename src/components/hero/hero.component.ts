import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

const SLIDESHOW_INTERVAL_MS = 5000;

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective]
})
export class HeroComponent implements OnInit, OnDestroy {
  readonly heroImages = [
    // 鍛冶工事 - Dramatic welding with bright sparks in dark environment
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&q=80',
    // 半自動溶接 - Industrial welder at work with protective gear
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80',
    // 鉄骨工事 - Steel structure construction work
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
    // アーク溶接 - Welding sparks flying in workshop
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80'
  ];

  currentIndex = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  /**
   * Navigate to specific slide and restart auto-play
   */
  goToSlide(index: number): void {
    this.currentIndex.set(index);
    this.restartAutoPlay();
  }

  private startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex.update(index => (index + 1) % this.heroImages.length);
    }, SLIDESHOW_INTERVAL_MS);
  }

  private stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}
