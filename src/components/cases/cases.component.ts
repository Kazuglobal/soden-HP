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
    { title: '商業施設 溶接工事', category: 'アーク溶接', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600&q=80' },
    { title: '工場設備 改修工事', category: '施工事例', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=80' },
    { title: '建築鉄骨 溶接加工', category: '鉄骨工事', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80' },
    { title: 'マンション 鉄鋼加工', category: '半自動溶接', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80' },
  ];
}
