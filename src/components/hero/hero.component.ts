import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapSplitTextDirective, ScrollAnimateDirective]
})
export class HeroComponent {
  // Particles for floating effect
  particles = Array.from({ length: 20 }, (_, i) => i);

  sliders = [
    { type: 'left', images: this.generateImageUrls(7, 400, 300) },
    { type: 'right', images: this.generateImageUrls(7, 300, 400) },
    { type: 'left', images: this.generateImageUrls(7, 450, 250) },
    { type: 'right', images: this.generateImageUrls(7, 250, 450) },
    { type: 'left', images: this.generateImageUrls(7, 350, 350) },
    { type: 'right', images: this.generateImageUrls(7, 380, 280) },
  ];

  generateImageUrls(count: number, width: number, height: number): string[] {
    return Array.from({ length: count * 2 }, (_, i) => `https://picsum.photos/${width}/${height}?random=${i + (width * height)}`);
  }
}
