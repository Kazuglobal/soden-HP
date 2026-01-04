import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective],
  styles: [`
    :host {
      display: block;
    }
    .footer-link {
      position: relative;
    }
    .footer-link::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: linear-gradient(90deg, #d4a876, #ff8c42);
      transition: width 0.3s ease;
    }
    .footer-link:hover::after {
      width: 100%;
    }
    .logo-container:hover .logo-img {
      transform: scale(1.08);
      filter: brightness(1.15) drop-shadow(0 0 8px rgba(212, 168, 118, 0.5));
    }
    .logo-img {
      transition: transform 0.3s ease, filter 0.3s ease;
      mix-blend-mode: multiply;
      filter: brightness(1.1);
    }
  `]
})
export class FooterComponent {
  navLinks1 = [
    { label: 'ホーム', href: '#' },
    { label: '会社案内', href: '#' },
    { label: '事業内容', href: '#' },
    { label: '採用情報', href: '#' },
  ];

  navLinks2 = [
    { label: '施工実績', href: '#' },
    { label: 'お知らせ', href: '#' },
    { label: 'サイトマップ', href: '#' },
    { label: 'プライバシーポリシー', href: '#' },
  ];
}
