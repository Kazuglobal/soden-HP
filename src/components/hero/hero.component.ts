import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapSplitTextDirective, ScrollAnimateDirective],
  styles: [`
    @keyframes kenBurns {
      0% {
        transform: scale(1) translate(0, 0);
      }
      100% {
        transform: scale(1.15) translate(-2%, -2%);
      }
    }

    @keyframes kenBurnsAlt {
      0% {
        transform: scale(1.1) translate(-2%, -2%);
      }
      100% {
        transform: scale(1) translate(0, 0);
      }
    }

    .hero-slide {
      animation: kenBurns 8s ease-in-out infinite alternate;
    }

    .hero-slide.alt {
      animation: kenBurnsAlt 8s ease-in-out infinite alternate;
    }

    @keyframes slideIn {
      0% {
        opacity: 0;
        transform: translateY(60px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .slide-content {
      animation: slideIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    .text-shimmer {
      background: linear-gradient(90deg, #fff 0%, #10b981 50%, #fff 100%);
      background-size: 200% auto;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 3s linear infinite;
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .float-element {
      animation: float 3s ease-in-out infinite;
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  currentSlide = signal(0);
  private intervalId: any;

  slides: HeroSlide[] = [
    {
      image: 'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1920&h=1080&fit=crop',
      title: '挑戦を力に変える',
      subtitle: '失敗を恐れず、未来を創造する技術'
    },
    {
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920&h=1080&fit=crop',
      title: '創造と技術で未来を灯す',
      subtitle: 'アットホームな環境で、最高の技術を提供'
    },
    {
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&h=1080&fit=crop',
      title: '確かな技術力',
      subtitle: '安全と信頼を第一に、社会基盤を支える'
    },
    {
      image: 'https://images.unsplash.com/photo-1581092160607-ee67cb5faa0b?w=1920&h=1080&fit=crop',
      title: '革新への挑戦',
      subtitle: '創電工業は、常に新しい未来を目指します'
    }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startSlideshow();
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startSlideshow() {
    this.intervalId = setInterval(() => {
      this.currentSlide.update(val => (val + 1) % this.slides.length);
    }, 5000);
  }

  goToSlide(index: number) {
    this.currentSlide.set(index);
  }
}
