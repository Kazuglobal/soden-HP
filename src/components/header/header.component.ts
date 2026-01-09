import { Component, ChangeDetectionStrategy, signal, HostListener, AfterViewInit, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { MagneticDirective } from '../../directives/magnetic.directive';

interface NavLink {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, MagneticDirective],
  styles: [`
    :host {
      display: block;
    }

    .nav-link {
      position: relative;
      color: #374151;
      font-weight: 500;
    }

    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 2px;
      background: #2d8a4e;
      border-radius: 2px;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-link:hover {
      color: #2d8a4e;
    }

    .nav-link:hover::after {
      width: 100%;
    }

    .logo-container:hover .logo-img {
      transform: scale(1.05);
    }

    .logo-img {
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .header-default {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }

    .header-scrolled {
      background: rgba(255, 255, 255, 0.98) !important;
      backdrop-filter: blur(20px) !important;
      -webkit-backdrop-filter: blur(20px) !important;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.03) !important;
    }

    .header-scrolled .header-inner {
      height: 64px !important;
    }

    .glass-dropdown {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(45, 138, 78, 0.1);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .primary-btn {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #2d8a4e 0%, #43a667 100%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .primary-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(45, 138, 78, 0.35);
    }

    .secondary-btn {
      position: relative;
      border: 1.5px solid #2d8a4e;
      color: #2d8a4e;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .secondary-btn:hover {
      background: #2d8a4e;
      color: white;
      transform: translateY(-1px);
    }

    .company-name {
      font-family: 'Noto Serif JP', serif;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: 0.05em;
    }

    .company-tagline {
      font-size: 9px;
      color: #2d8a4e;
      letter-spacing: 0.15em;
      font-weight: 500;
    }

    .mobile-menu {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
  `]
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;

  isMenuOpen = signal(false);
  isContactMenuOpen = signal(false);
  isScrolled = signal(false);

  navLinks: NavLink[] = [
    { label: '会社案内', href: '#' },
    {
      label: '事業内容',
      href: '#',
      dropdown: [
        { label: '電気設備工事', href: '#' },
        { label: '空調設備工事', href: '#' },
        { label: '防災設備工事', href: '#' }
      ]
    },
    {
      label: '採用情報',
      href: '#',
      dropdown: [
        { label: '募集要項', href: '#' },
        { label: '社員の声', href: '#' },
        { label: 'エントリー', href: '#' },
      ],
    },
    { label: '施工実績', href: '#' },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  @HostListener('window:scroll')
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled.set(window.scrollY > 50);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  private initAnimations() {
    // Logo animation - soft entrance
    gsap.fromTo('.header-logo',
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // Nav links stagger animation
    gsap.fromTo('.nav-item',
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
    );

    // CTA buttons animation
    gsap.fromTo('.header-cta',
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.4 }
    );
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  toggleContactMenu() {
    this.isContactMenuOpen.update(value => !value);
  }
}
