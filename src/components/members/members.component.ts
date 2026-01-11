import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { ImageRevealDirective } from '../../directives/mask-reveal.directive';
import { Tilt3DDirective } from '../../directives/tilt-3d.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [
    GsapSplitTextDirective,
    GsapScrollAnimateDirective,
    ImageRevealDirective,
    Tilt3DDirective,
    ParallaxDirective
  ],
  templateUrl: './members.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MembersComponent { }
