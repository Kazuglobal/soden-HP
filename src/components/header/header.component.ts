import { Component, ChangeDetectionStrategy, signal, HostListener, AfterViewInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';

interface NavLink {
  label: string;
  labelEn: string;
  routerLink: string;
  fragment?: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterModule],
  styles: [`
    :host { display: block; }
    .logo-container:hover .logo-img { transform: scale(1.05); }
    .logo-img { transition: transform 0.3s ease; }
  `]
})
export class HeaderComponent implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  isMenuOpen = signal(false);
  isScrolled = signal(false);

  navLinks: NavLink[] = [
    { label: 'ホーム', labelEn: 'HOME', routerLink: '/' },
    { label: '私たちの仕事', labelEn: 'SERVICE', routerLink: '/', fragment: 'what-we-do' },
    { label: '施工事例', labelEn: 'WORKS', routerLink: '/', fragment: 'cases' },
    { label: '会社案内', labelEn: 'COMPANY', routerLink: '/company' },
    { label: '採用情報', labelEn: 'RECRUIT', routerLink: '/recruit' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) {
      this.isScrolled.set(window.scrollY > 20);
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initAnimations();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  private initAnimations(): void {
    gsap.fromTo('.header-logo',
      { opacity: 0, x: -15 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );

    gsap.fromTo('.nav-item',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out', delay: 0.15 }
    );
  }
}
