import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule, GsapScrollAnimateDirective],
  styles: [`
    :host {
      display: block;
    }
    .footer-link {
      position: relative;
      display: inline-flex;
      align-items: center;
    }
    .footer-link::before {
      content: '';
      position: absolute;
      left: -12px;
      width: 4px;
      height: 4px;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      border-radius: 50%;
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease;
    }
    .footer-link:hover::before {
      opacity: 1;
      transform: scale(1);
    }
    .footer-link:hover span {
      transform: translateX(4px);
    }
    .logo-container:hover .logo-img {
      transform: scale(1.05) translateY(-2px);
      filter: brightness(1.1) drop-shadow(0 5px 10px rgba(56, 189, 248, 0.2));
    }
    .logo-img {
      transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
  `]
})
export class FooterComponent {
  navLinks1 = [
    { label: 'ホーム', routerLink: '/' },
    { label: '会社案内', routerLink: '/company' },
    { label: '事業内容', routerLink: '/', fragment: 'what-we-do' },
    { label: '採用情報', routerLink: '/recruit' },
  ];

  navLinks2 = [
    { label: '施工実績', routerLink: '/', fragment: 'cases' },
    { label: 'お知らせ', routerLink: '/', fragment: 'news' },
    { label: 'サイトマップ', routerLink: '/' },
    { label: 'プライバシーポリシー', routerLink: '/' },
  ];
}
