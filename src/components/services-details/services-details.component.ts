import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WhatWeDoComponent } from '../what-we-do/what-we-do.component';
import { ContactComponent } from '../contact/contact.component';

@Component({
  selector: 'app-services-details',
  standalone: true,
  imports: [CommonModule, RouterLink, WhatWeDoComponent, ContactComponent],
  templateUrl: './services-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesDetailsComponent {
  serviceAreas = ['八戸市', '三沢市', 'おいらせ町', '南部町', '五戸町'];

  workItems = [
    { name: '電気設備工事', detail: '受変電設備・動力設備・照明設備・弱電設備など電気設備の設計から施工まで一貫対応' },
    { name: '電気通信工事', detail: '通信ケーブル・LAN配線・電話設備・放送設備などの設計施工' },
    { name: '消防設備工事', detail: '自動火災報知設備・スプリンクラー・避難設備などの設計施工・保守点検' },
    { name: '空調設備工事', detail: '業務用エアコン・換気設備・空調ダクト工事の設計施工' },
    { name: '太陽光発電設備設計施工', detail: '産業用・住宅用太陽光発電システムの設計・施工・保守管理' },
    { name: '物流システム・機械設備工事', detail: 'コンベヤ・仕分け機・自動倉庫など物流設備の設計施工・保守管理' },
    { name: 'ビル保守管理', detail: '電気設備・空調設備・消防設備の定期点検・保守・24時間対応' }
  ];
}
