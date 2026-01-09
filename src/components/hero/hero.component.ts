import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
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
      height: 100vh;
      min-height: 700px;
      overflow: hidden;
      background: #f8faf9;
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
      overflow: hidden;
    }

    .slide.active {
      opacity: 1;
    }

    .slide-image {
      position: absolute;
      inset: -10%;
      width: 120%;
      height: 120%;
      object-fit: cover;
      will-change: transform;
    }

    .slide-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.85) 0%,
        rgba(255, 255, 255, 0.6) 40%,
        rgba(255, 255, 255, 0.3) 100%
      );
    }

    .content-wrapper {
      position: relative;
      z-index: 10;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 8%;
    }

    .tagline {
      font-size: 0.875rem;
      font-weight: 500;
      color: #2d8a4e;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      margin-bottom: 1.5rem;
    }

    .main-title {
      font-family: 'Noto Serif JP', serif;
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    .main-title .highlight {
      color: #2d8a4e;
      position: relative;
    }

    .description {
      font-size: 1.125rem;
      color: #4a5568;
      max-width: 520px;
      line-height: 1.8;
      margin-bottom: 2.5rem;
    }

    .cta-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #2d8a4e 0%, #43a667 100%);
      color: white;
      font-weight: 500;
      font-size: 0.9375rem;
      border-radius: 50px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(45, 138, 78, 0.35);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border: 2px solid #2d8a4e;
      color: #2d8a4e;
      font-weight: 500;
      font-size: 0.9375rem;
      border-radius: 50px;
      background: transparent;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
    }

    .btn-secondary:hover {
      background: #2d8a4e;
      color: white;
      transform: translateY(-2px);
    }

    .slide-indicators {
      position: absolute;
      right: 3rem;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 1rem;
      z-index: 20;
    }

    .indicator {
      width: 3px;
      height: 32px;
      background: rgba(45, 138, 78, 0.2);
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .indicator::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 0%;
      background: #2d8a4e;
      transition: height 0.3s ease;
    }

    .indicator.active::after {
      height: 100%;
      animation: indicatorProgress 6s linear;
    }

    .indicator:hover {
      background: rgba(45, 138, 78, 0.4);
    }

    @keyframes indicatorProgress {
      from { height: 0%; }
      to { height: 100%; }
    }

    .scroll-hint {
      position: absolute;
      bottom: 2.5rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: #2d8a4e;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      z-index: 20;
    }

    .scroll-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, #2d8a4e, transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }

    @keyframes scrollPulse {
      0%, 100% { opacity: 1; transform: scaleY(1); }
      50% { opacity: 0.5; transform: scaleY(0.8); }
    }

    .photo-frame {
      position: absolute;
      right: 5%;
      bottom: 15%;
      width: 320px;
      height: 420px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
      z-index: 15;
      opacity: 0;
      transform: translateY(30px);
    }

    .photo-frame img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .photo-frame-accent {
      position: absolute;
      right: calc(5% + 280px);
      bottom: calc(15% + 60px);
      width: 180px;
      height: 240px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      z-index: 14;
      opacity: 0;
      transform: translateY(30px);
    }

    .photo-frame-accent img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .decorative-circle {
      position: absolute;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      border: 1px solid rgba(45, 138, 78, 0.1);
      right: -100px;
      top: 20%;
      z-index: 5;
    }

    .decorative-circle-2 {
      width: 300px;
      height: 300px;
      right: -50px;
      top: 25%;
    }

    @media (max-width: 1024px) {
      .photo-frame,
      .photo-frame-accent {
        display: none;
      }

      .slide-indicators {
        right: 1.5rem;
      }

      .content-wrapper {
        padding: 0 5%;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        min-height: 600px;
      }

      .slide-indicators {
        display: none;
      }

      .scroll-hint {
        bottom: 1.5rem;
      }

      .decorative-circle,
      .decorative-circle-2 {
        display: none;
      }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  currentSlide = signal(0);
  private slideInterval: any;
  private isBrowser: boolean;

  slides: Slide[] = [
    {
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80',
      title: '挑戦が、未来を創る',
      subtitle: '確かな技術と情熱で、社会インフラを支える'
    },
    {
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1920&q=80',
      title: '共に成長する',
      subtitle: 'チームワークで困難を乗り越え、新たな価値を生み出す'
    },
    {
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
      title: '信頼を積み重ねる',
      subtitle: '一つひとつの仕事に誠実に向き合い続ける'
    },
    {
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1920&q=80',
      title: '技術で、社会を照らす',
      subtitle: '電気設備のプロフェッショナルとして地域に貢献'
    }
  ];

  frameImages = [
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.startSlideshow();
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.initAnimations();
    }
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  private initAnimations() {
    // Initial content animation
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo('.tagline',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    )
    .fromTo('.main-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo('.description',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo('.cta-group',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo('.photo-frame',
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo('.photo-frame-accent',
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power2.out' },
      '-=0.5'
    )
    .fromTo('.slide-indicators',
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    )
    .fromTo('.scroll-hint',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );

    // Ken Burns effect for active slide
    this.animateKenBurns();
  }

  private animateKenBurns() {
    const currentIndex = this.currentSlide();
    const slideImage = document.querySelector(`.slide-${currentIndex} .slide-image`) as HTMLElement;

    if (slideImage) {
      gsap.fromTo(slideImage,
        { scale: 1, x: '0%', y: '0%' },
        {
          scale: 1.1,
          x: currentIndex % 2 === 0 ? '2%' : '-2%',
          y: currentIndex % 2 === 0 ? '1%' : '-1%',
          duration: 6,
          ease: 'none'
        }
      );
    }
  }

  private startSlideshow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  nextSlide() {
    const next = (this.currentSlide() + 1) % this.slides.length;
    this.goToSlide(next);
  }

  goToSlide(index: number) {
    if (index === this.currentSlide()) return;

    const currentIndex = this.currentSlide();
    const currentSlide = document.querySelector(`.slide-${currentIndex}`) as HTMLElement;
    const nextSlide = document.querySelector(`.slide-${index}`) as HTMLElement;

    if (currentSlide && nextSlide) {
      // Animate out current slide
      gsap.to(currentSlide, {
        opacity: 0,
        scale: 1.02,
        duration: 0.8,
        ease: 'power2.inOut'
      });

      // Animate in next slide
      gsap.fromTo(nextSlide,
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            this.animateKenBurns();
          }
        }
      );
    }

    this.currentSlide.set(index);

    // Reset interval
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.startSlideshow();
    }
  }
}
