import { Component, ChangeDetectionStrategy, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  styles: [`
    :host {
      display: block;
    }

    .hero-section {
      position: relative;
      min-height: 100vh;
      overflow: hidden;
    }

    .slide-container {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      transform: scale(1.1);
      transition: opacity 1.5s ease, transform 8s ease;
    }

    .slide.active {
      opacity: 1;
      transform: scale(1);
      z-index: 1;
    }

    .slide.prev {
      opacity: 0;
      transform: scale(1.05);
      z-index: 0;
    }

    .slide-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .slide-mask {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.95) 0%,
        rgba(255, 255, 255, 0.85) 30%,
        rgba(240, 253, 244, 0.7) 60%,
        rgba(34, 197, 94, 0.15) 100%
      );
    }

    .content-wrapper {
      position: relative;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100vh;
      padding: 120px 0 80px;
    }

    .main-title {
      font-size: clamp(2.5rem, 8vw, 5rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .highlight-text {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: clamp(1rem, 2vw, 1.25rem);
      opacity: 0.8;
    }

    .slide-indicator {
      width: 60px;
      height: 3px;
      background: rgba(34, 197, 94, 0.2);
      border-radius: 2px;
      overflow: hidden;
    }

    .slide-indicator-fill {
      height: 100%;
      background: linear-gradient(90deg, #22c55e, #16a34a);
      border-radius: 2px;
      animation: progress 6s linear infinite;
    }

    @keyframes progress {
      from { width: 0%; }
      to { width: 100%; }
    }

    .floating-card {
      animation: float 6s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }

    .floating-card-delay {
      animation-delay: -3s;
    }

    .stat-card {
      backdrop-filter: blur(20px);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(34, 197, 94, 0.1);
    }

    .photo-grid {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 45%;
      height: 80%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(3, 1fr);
      gap: 16px;
      padding: 20px;
    }

    .photo-item {
      position: relative;
      overflow: hidden;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }

    .photo-item:nth-child(1) {
      grid-row: span 2;
    }

    .photo-item:nth-child(4) {
      grid-column: span 2;
    }

    .photo-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .photo-item:hover img {
      transform: scale(1.1);
    }

    .photo-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(34, 197, 94, 0.3) 0%, transparent 50%);
      opacity: 0;
      transition: opacity 0.5s ease;
    }

    .photo-item:hover .photo-overlay {
      opacity: 1;
    }

    @media (max-width: 1024px) {
      .photo-grid {
        display: none;
      }
    }

    .scroll-indicator {
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }
  `]
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  currentSlide = signal(0);
  private slideInterval: any;
  private isBrowser: boolean;

  slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
      title: '電気で未来を創る',
      subtitle: '挑戦を恐れない技術者集団'
    },
    {
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&q=80',
      title: '創造と技術の融合',
      subtitle: '社会インフラを支える確かな力'
    },
    {
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&q=80',
      title: '共に成長する仲間',
      subtitle: 'アットホームな環境で夢を実現'
    }
  ];

  gridPhotos = [
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initAnimations();
      this.startSlideshow();
    }
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private initAnimations() {
    const tl = gsap.timeline({ delay: 0.3 });

    // Main title animation
    tl.fromTo('.hero-title-line',
      { opacity: 0, y: 80, rotationX: 45 },
      { opacity: 1, y: 0, rotationX: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out' }
    );

    // Subtitle animation
    tl.fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
    );

    // CTA buttons
    tl.fromTo('.hero-cta',
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    // Stats cards
    tl.fromTo('.stat-card',
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      '-=0.3'
    );

    // Photo grid animation
    tl.fromTo('.photo-item',
      { opacity: 0, scale: 0.8, y: 60 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1,
        stagger: { each: 0.15, from: 'random' },
        ease: 'power3.out'
      },
      '-=0.8'
    );

    // Scroll indicator
    tl.fromTo('.scroll-indicator',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );
  }

  private startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.currentSlide.update(current => (current + 1) % this.slides.length);
    }, 6000);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.startSlideshow();
  }
}
