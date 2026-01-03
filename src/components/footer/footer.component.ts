import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  navLinks1 = [
    { label: 'ホーム', href: '#' },
    { label: '会社案内', href: '#' },
    { label: '事業内容', href: '#' },
    { label: '採用情報', href: '#' },
  ];

  navLinks2 = [
    { label: '施工実績', href: '#' },
    { label: 'お知らせ', href: '#' },
    { label: 'サイトマップ', href: '#' },
    { label: 'プライバシーポリシー', href: '#' },
  ];
}
