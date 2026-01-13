import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
    selector: 'app-company-details',
    templateUrl: './company-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, GsapScrollAnimateDirective]
})
export class CompanyDetailsComponent {
    ceoImage = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop';

    companyInfo = [
        { label: '会社名', value: '株式会社創電工業' },
        { label: '創業', value: '昭和62年（1987年）' },
        { label: '資本金', value: '5,000万円' },
        { label: '代表者', value: '代表取締役会長 上野 誠\n代表取締役社長 上野 衆' },
        { label: '事業内容', value: '電気設備設計・施工・管理\n各種機械自動制御装置設計・施工\nビル保守・防災管理業務・空調設備\n物流システム全般・機械器具設置工事業' },
        { label: '従業員資格', value: '一級、二級電気施工管理士\n第一種、第二種電気工事士\n消防設備士' },
        { label: '特定建設業許可', value: '電気工事業\n青森県知事許可（62）第11684号' },
        { label: '一般建設業許可', value: '電気通信工事業 青森県知事許可（62）第11684号\n消防施設工事業 青森県知事許可（62）第11684号' },
        { label: '所在地', value: '〒031-0833\n青森県八戸市大字大久保字小久保平19-7' },
        { label: '連絡先', value: 'TEL: 0178-25-2172\nFAX: 0178-25-217Ⅰ\n（受付時間 8:00-18:00 [ 日・祝日除く ]）' }
    ];
}
