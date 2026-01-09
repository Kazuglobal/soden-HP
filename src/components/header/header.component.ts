import { Component, ChangeDetectionStrategy, signal, HostListener, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { MagneticDirective } from '../../directives/magnetic.directive';

interface NavLink {
  label: string;
  labelEn: string;
  href: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MagneticDirective],
  styles: [`
    :host {
      display: contents;
    }
    .nav-link {
      position: relative;
    }
    .logo-container:hover .logo-img {
      transform: scale(1.05);
    }
    .logo-img {
      transition: transform 0.3s ease;
    }
    .header-cta {
      position: relative;
      overflow: hidden;
    }
    .header-cta::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s ease;
    }
    .header-cta:hover::before {
      left: 100%;
    }
  `]
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;

  isMenuOpen = signal(false);
  isScrolled = signal(false);

  navLinks: NavLink[] = [
    { label: 'ホーム', labelEn: 'HOME', href: '#' },
    { label: '創電の強み', labelEn: 'FEATURE', href: '#feature' },
    { label: '事業案内', labelEn: 'SERVICE', href: '#what-we-do' },
    { label: '施工事例', labelEn: 'WORKS', href: '#cases' },
    { label: '会社案内', labelEn: 'COMPANY', href: '#company' },
    { label: '採用情報', labelEn: 'RECRUIT', href: '#recruit' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 20);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  private initAnimations() {
    // Logo animation
    gsap.fromTo('.header-logo',
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    );

    // Nav links stagger animation
    gsap.fromTo('.nav-item',
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
    );

    // CTA button animation
    gsap.fromTo('.header-cta',
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)', delay: 0.5 }
    );
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }
}
