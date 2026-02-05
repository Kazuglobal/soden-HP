import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-what-we-do',
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective],
  templateUrl: './what-we-do.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WhatWeDoComponent {
  // 電気設備設計施工 - 電気工事の現場
  work1 = '/images/elct1.png';
  // 太陽光発電設備設計施工 - ソーラーパネル
  work2 = '/images/solar_energy.png';
  // ビル保守管理 - オフィスビル/メンテナンス
  work3 = '/images/building.png';
  // 鍛冶工事・鉄骨工事
  work4 = '/images/sportroom.png';
}
