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
  work1 = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2000&auto=format&fit=crop';
  // 太陽光発電設備設計施工 - ソーラーパネル
  work2 = '/images/solar_energy.png';
  // ビル保守管理 - オフィスビル/メンテナンス
  work3 = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop';
  // 物流システム・機械設備工事 - 倉庫/物流
  work4 = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop';
}
