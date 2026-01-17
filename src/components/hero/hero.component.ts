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
    '/images/firstview1.png',
    '/images/firstview2.png',
    '/images/firstview3.png',
    '/images/firstview_new.jpg'
  ];

  currentIndex = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentIndex.update(index => (index + 1) % this.heroImages.length);
    }, SLIDESHOW_INTERVAL_MS);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
