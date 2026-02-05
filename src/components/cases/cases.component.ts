import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface CaseItem {
  title: string;
  category: string;
  image: string;
}

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective]
})
export class CasesComponent {
  cases: CaseItem[] = [
    { title: '商業施設 溶接工事', category: 'アーク溶接', image: '/images/elct1.png' },
    { title: '小久保保育園 改修工事', category: '施工事例', image: '/images/kokubo_nursery.jpg' },
    { title: '市立小中学校 改修', category: '鉄骨工事', image: '/images/sportroom.png' },
    { title: 'マンション 鉄鋼加工', category: '半自動溶接', image: '/images/building.png' },
  ];
}
