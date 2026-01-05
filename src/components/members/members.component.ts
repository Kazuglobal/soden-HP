import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { ImageRevealDirective } from '../../directives/mask-reveal.directive';
import { Tilt3DDirective } from '../../directives/tilt-3d.directive';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    GsapSplitTextDirective,
    GsapScrollAnimateDirective,
    ParallaxDirective,
    MagneticDirective,
    ImageRevealDirective,
    Tilt3DDirective
  ]
})
export class MembersComponent {}
