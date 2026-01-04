import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-for-clients',
  templateUrl: './for-clients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GsapSplitTextDirective, GsapScrollAnimateDirective]
})
export class ForClientsComponent {
    proposalImages = [
        'https://picsum.photos/300/300?random=40',
        'https://picsum.photos/300/300?random=41',
        'https://picsum.photos/300/300?random=42',
        'https://picsum.photos/300/300?random=43',
    ];
}
