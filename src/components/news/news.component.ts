import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GsapSplitTextDirective, GsapScrollAnimateDirective]
})
export class NewsComponent {}
