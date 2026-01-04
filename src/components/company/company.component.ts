import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapSplitTextDirective, GsapScrollAnimateDirective]
})
export class CompanyComponent {
  showDetails = false;

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }
}
