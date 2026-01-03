import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';

@Component({
  selector: 'app-what-we-do',
  templateUrl: './what-we-do.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GsapSplitTextDirective]
})
export class WhatWeDoComponent {}
