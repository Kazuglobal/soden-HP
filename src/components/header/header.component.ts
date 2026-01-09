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
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 3px;
      background: linear-gradient(90deg, #22c55e, #4ade80);
      border-radius: 2px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-link:hover::after {
      width: 100%;
    }
    .logo-container:hover .logo-img {
      transform: scale(1.08) rotate(-3deg);
      filter: brightness(1.1);
    }
    .logo-img {
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s ease;
    }
    .header-scrolled {
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(20px) saturate(180%) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(34, 197, 94, 0.1) !important;
    }
    .header-scrolled .nav-link,
    .header-scrolled .logo-text {
      color: #1f2937 !important;
    }
    .header-scrolled .nav-link:hover {
      color: #16a34a !important;
    }
    .header-inner {
      height: 88px;
    }
    .header-scrolled .header-inner {
      height: 72px !important;
    }
    .glass-dropdown {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(34, 197, 94, 0.1);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 24px rgba(34, 197, 94, 0.08);
    }
    .contact-btn {
      position: relative;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .contact-btn::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }
    .contact-btn:hover::before {
      width: 300%;
      height: 300%;
    }
    .brand-accent {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .menu-line {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .menu-open .menu-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .menu-open .menu-line:nth-child(2) {
      opacity: 0;
      transform: translateX(-10px);
    }
    .menu-open .menu-line:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  `]
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('headerEl') headerEl!: ElementRef<HTMLElement>;

  isMenuOpen = signal(false);
  isContactMenuOpen = signal(false);
  isScrolled = signal(false);

  navLinks: NavLink[] = [
    { label: '会社案内', href: '#company' },
    {
      label: '事業内容',
      href: '#business',
      dropdown: [
        { label: '電気設備工事', href: '#' },
        { label: '空調設備工事', href: '#' },
        { label: '防災設備工事', href: '#' }
      ]
    },
    {
      label: '採用情報',
      href: '#recruit',
      dropdown: [
        { label: '募集要項', href: '#' },
        { label: '社員の声', href: '#members' },
        { label: 'エントリー', href: '#contact' },
      ],
    },
    { label: '施工実績', href: '#works' },
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
    // Logo animation with bounce
    gsap.fromTo('.header-logo',
      { opacity: 0, x: -40, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
    );

    // Nav links stagger animation with playful effect
    gsap.fromTo('.nav-item',
      { opacity: 0, y: -30, rotationX: 45 },
      { opacity: 1, y: 0, rotationX: 0, duration: 0.7, stagger: 0.08, ease: 'back.out(1.7)', delay: 0.3 }
    );

    // CTA buttons animation
    gsap.fromTo('.header-cta',
      { opacity: 0, scale: 0.8, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'back.out(2)', delay: 0.7 }
    );
  }

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  toggleContactMenu() {
    this.isContactMenuOpen.update(value => !value);
  }
}
