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
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #d4a876, #ff8c42);
      transition: width 0.3s ease;
    }
    .nav-link:hover::after {
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
    .header-scrolled {
      background: rgba(12, 28, 45, 0.95) !important;
      backdrop-filter: blur(16px) !important;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3) !important;
    }
    .header-scrolled .header-inner {
      height: 64px !important;
    }
    .glass-dropdown {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .contact-btn {
      position: relative;
      overflow: hidden;
    }
    .contact-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s ease;
    }
    .contact-btn:hover::before {
      left: 100%;
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
    // Logo animation
    gsap.fromTo('.header-logo',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }
    );

    // Nav links stagger animation
    gsap.fromTo('.nav-item',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
    );

    // CTA buttons animation
    gsap.fromTo('.header-cta',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(1.7)', delay: 0.6 }
    );
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  toggleContactMenu() {
    this.isContactMenuOpen.update(value => !value);
  }
}
