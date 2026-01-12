import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface NewsItem {
  date: string;
  dateFormatted: string;
  category: string;
  title: string;
  href: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapSplitTextDirective, GsapScrollAnimateDirective]
})
export class NewsComponent {
  newsItems: NewsItem[] = [
    {
      date: '2026-01-20',
      dateFormatted: '2026.01.20',
      category: 'お知らせ',
      title: 'ホームページをリニューアルしました。',
      href: '#'
    }
  ];
}
