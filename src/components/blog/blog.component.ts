import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { Tilt3DDirective } from '../../directives/tilt-3d.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { HoverZoomDirective, HoverLiftDirective } from '../../directives/hover-effects.directive';
import { ImageRevealDirective } from '../../directives/mask-reveal.directive';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [
    CommonModule,
    GsapSplitTextDirective,
    GsapScrollAnimateDirective,
    Tilt3DDirective,
    MagneticDirective,
    HoverZoomDirective,
    HoverLiftDirective,
    ImageRevealDirective
  ],
  templateUrl: './blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent {
  services = [
    {
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
      alt: '電気設備工事',
      category: 'Electrical Works',
      number: '01.',
      title: '電気設備工事',
      href: '#',
    },
    {
      image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=1000&auto=format&fit=crop',
      alt: '空調・換気設備工事',
      category: 'Air-Conditioning Works',
      number: '02.',
      title: '空調・換気設備工事',
      href: '#',
    },
  ];
}
