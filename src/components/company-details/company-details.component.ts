import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
    selector: 'app-company-details',
    templateUrl: './company-details.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, RouterLink, GsapScrollAnimateDirective]
})
export class CompanyDetailsComponent {
    ceoImage = '/images/CEO.JPG';

    companyInfo = [
        { label: '会社名', value: '株式会社SEIKEN' },
        { label: '創業', value: '昭和62年（1987年）' },
        { label: '資本金', value: '5,000万円' },
        { label: '代表者', value: '代表取締役会長 上野 誠\n代表取締役社長 上野 衆' },
        { label: '事業内容', value: '鍛冶工事・鉄骨工事\nアーク溶接・半自動溶接・Tig溶接\n鉄・ステンレス等の資材加工\n商業施設・マンション向け溶接工事' },
        { label: '従業員資格', value: '溶接技能者資格\nアーク溶接特別教育修了\nガス溶接技能講習修了' },
        { label: '対応エリア', value: '横浜を中心に関東エリア' },
        { label: '所在地', value: '〒031-0833\n青森県八戸市大字大久保字小久保平19-7' },
        { label: '連絡先', value: 'TEL: 0178-25-2172\nFAX: 0178-25-2171\n（受付時間 8:00-18:00 [ 日・祝日除く ]）' }
    ];
}
