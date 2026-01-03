import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavLink {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class HeaderComponent {
  isMenuOpen = signal(false);
  isContactMenuOpen = signal(false);

  navLinks: NavLink[] = [
    { label: '会社案内', href: '#' },
    { 
      label: '事業内容', 
      href: '#', 
      dropdown: [
        { label: '電気設備工事', href: '#' },
        { label: '空調設備工事', href: '#' },
        { label: '防災設備工事', href: '#' }
      ] 
    },
    {
      label: '採用情報',
      href: '#',
      dropdown: [
        { label: '募集要項', href: '#' },
        { label: '社員の声', href: '#' },
        { label: 'エントリー', href: '#' },
      ],
    },
    { label: '施工実績', href: '#' },
  ];

  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }

  toggleContactMenu() {
    this.isContactMenuOpen.update(value => !value);
  }
}
