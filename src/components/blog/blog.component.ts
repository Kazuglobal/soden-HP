import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogComponent {
  services = [
    {
      image: 'https://picsum.photos/400/300?random=10',
      alt: '電気設備工事',
      category: 'Electrical Works',
      number: '01.',
      title: '電気設備工事',
      href: '#',
    },
    {
      image: 'https://picsum.photos/400/300?random=11',
      alt: '空調・換気設備工事',
      category: 'Air-Conditioning Works',
      number: '02.',
      title: '空調・換気設備工事',
      href: '#',
    },
    {
      image: 'https://picsum.photos/400/300?random=12',
      alt: '防災設備工事',
      category: 'Disaster Prevention',
      number: '03.',
      title: '防災設備工事',
      href: '#',
    },
  ];
}
