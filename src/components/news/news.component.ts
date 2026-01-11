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
      date: '2025-04-15',
      dateFormatted: '2025.04.15',
      category: 'お知らせ',
      title: 'ホームページをリニューアルしました。',
      href: '#'
    },
    {
      date: '2025-03-01',
      dateFormatted: '2025.03.01',
      category: '採用情報',
      title: '2026年度新卒採用を開始しました。',
      href: '#'
    },
    {
      date: '2025-01-10',
      dateFormatted: '2025.01.10',
      category: '施工実績',
      title: '八戸市立〇〇小学校の電気設備工事が完了しました。',
      href: '#'
    }
  ];
}
