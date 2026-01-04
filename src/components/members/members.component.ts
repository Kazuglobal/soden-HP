import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GsapSplitTextDirective, GsapScrollAnimateDirective]
})
export class MembersComponent {}
