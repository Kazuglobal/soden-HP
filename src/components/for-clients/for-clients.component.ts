import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-for-clients',
  templateUrl: './for-clients.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForClientsComponent {
    proposalImages = [
        'https://picsum.photos/300/300?random=40',
        'https://picsum.photos/300/300?random=41',
        'https://picsum.photos/300/300?random=42',
        'https://picsum.photos/300/300?random=43',
    ];
}
