import { Component, ChangeDetectionStrategy, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recruit',
  templateUrl: './recruit.component.html',
  styles: [`
    :host {
      display: block;
    }
    .animate-hidden {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
    }
    .animate-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class RecruitComponent implements AfterViewInit {
  @ViewChildren('anim') animElements!: QueryList<ElementRef>;
  showDetails = false;

  constructor() { }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, { threshold: 0.1 });

    this.animElements.forEach(el => observer.observe(el.nativeElement));
  }
}
