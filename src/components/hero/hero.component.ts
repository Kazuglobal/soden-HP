import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapSplitTextDirective, GsapScrollAnimateDirective, MagneticDirective]
})
export class HeroComponent {
  sliders = [
    { type: 'left', images: this.generateImageUrls(7, 'architecture') },
    { type: 'right', images: this.generateImageUrls(7, 'tech') },
    { type: 'left', images: this.generateImageUrls(7, 'industrial') },
  ];

  generateImageUrls(count: number, category: string): string[] {
    return Array.from({ length: count * 2 }, (_, i) => `https://loremflickr.com/400/300/${category}?lock=${i}`);
  }
}
