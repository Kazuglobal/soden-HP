import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective]
})
export class HeroComponent implements OnInit, OnDestroy {
  // Industrial/Construction themed high-quality images
  heroImages = [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=2000', // Worker
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000', // Helmet/Safety
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2000'  // Electrical/Tech
  ];

  currentIndex = signal(0);
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.startSlideshow();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startSlideshow() {
    this.intervalId = setInterval(() => {
      this.currentIndex.update(index => (index + 1) % this.heroImages.length);
    }, 5000); // Switch every 5 seconds
  }
}
