import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective],
  templateUrl: './what-we-do.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatWeDoComponent {
  // アーク溶接 - Arc welding with bright sparks
  work1 = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&q=80';
  // 半自動溶接 - Semi-automatic welding industrial work
  work2 = 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80';
  // Tig溶接 - TIG welding precision craftsmanship
  work3 = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80';
  // 鍛冶工事・鉄骨工事 - Steel frame construction site
  work4 = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80';
}
