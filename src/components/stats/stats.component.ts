import { Component, ChangeDetectionStrategy, signal, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface Stat {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective]
})
export class StatsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('statsSection') statsSection!: ElementRef;

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  stats: Stat[] = [
    {
      icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
      </svg>`,
      value: 0,
      suffix: '年',
      label: '創業',
      description: '1985年創業'
    },
    {
      icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
      </svg>`,
      value: 0,
      suffix: '件+',
      label: '施工実績',
      description: '累計施工件数'
    },
    {
      icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>`,
      value: 0,
      suffix: '名',
      label: '技術者',
      description: '有資格技術者数'
    },
    {
      icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
      </svg>`,
      value: 0,
      suffix: '%',
      label: 'お客様満足度',
      description: 'アンケート結果'
    }
  ];

  displayValues = signal<number[]>([0, 0, 0, 0]);
  targetValues = [40, 500, 25, 98];

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.animateCounters();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (this.statsSection) {
      this.observer.observe(this.statsSection.nativeElement);
    }
  }

  private animateCounters() {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = this.easeOutCubic(currentStep / steps);

      const newValues = this.targetValues.map(target => Math.round(progress * target));
      this.displayValues.set(newValues);

      if (currentStep >= steps) {
        clearInterval(interval);
        this.displayValues.set(this.targetValues);
      }
    }, stepDuration);
  }

  private easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
  }
}
