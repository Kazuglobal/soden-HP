import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

interface PolicySection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink, GsapScrollAnimateDirective],
  templateUrl: './privacy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrivacyComponent {
  readonly lastUpdated = '2026年4月6日';

  readonly sections: PolicySection[] = [
    {
      heading: '1. 個人情報の定義',
      paragraphs: [
        '本プライバシーポリシーにおける「個人情報」とは、個人情報の保護に関する法律に定める個人情報を指し、氏名、住所、電話番号、メールアドレス等、特定の個人を識別できる情報をいいます。'
      ]
    },
    {
      heading: '2. 個人情報の取得',
      paragraphs: [
        '当社は、お問い合わせフォームおよび採用エントリーフォームを通じて、適法かつ公正な手段により、以下の個人情報を取得します。'
      ],
      items: [
        'お問い合わせ: お名前、メールアドレス、件名、お問い合わせ内容',
        '採用エントリー: お名前、ふりがな、メールアドレス、電話番号、年齢、学歴、職歴、保有資格、志望動機等'
      ]
    },
    {
      heading: '3. 利用目的',
      paragraphs: ['当社は、取得した個人情報を以下の目的の範囲内で利用します。'],
      items: [
        'お問い合わせ・ご相談への対応およびご連絡',
        '採用選考および採用に関するご連絡',
        '当社サービスに関するご案内',
        '上記に付随する業務の遂行'
      ]
    },
    {
      heading: '4. 第三者提供',
      paragraphs: [
        '当社は、法令に基づく場合を除き、あらかじめご本人の同意を得ることなく、個人情報を第三者に提供しません。'
      ]
    },
    {
      heading: '5. 個人情報の管理',
      paragraphs: [
        '当社は、個人情報の漏えい、滅失またはき損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じます。'
      ]
    },
    {
      heading: '6. 開示・訂正・削除の請求',
      paragraphs: [
        'ご本人からご自身の個人情報の開示・訂正・利用停止・削除等をご希望される場合は、下記お問い合わせ先までご連絡ください。ご本人であることを確認のうえ、法令に従い速やかに対応いたします。'
      ]
    },
    {
      heading: '7. お問い合わせ先',
      paragraphs: [
        '株式会社創電工業\n〒031-0833 青森県八戸市大字大久保字小久保平19-7\nTEL: 0178-25-2172（受付時間 8:00-18:00 [ 日・祝日除く ]）'
      ]
    },
    {
      heading: '8. 本ポリシーの変更',
      paragraphs: [
        '当社は、法令の変更等に応じて、本プライバシーポリシーを予告なく変更することがあります。変更後の内容は本ページに掲載した時点から適用されます。'
      ]
    }
  ];
}
