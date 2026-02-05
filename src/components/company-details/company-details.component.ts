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
        { label: '代表者', value: '代表取締役 鈴木 健也' },
        { label: '事業内容', value: '鍛冶工事・鉄骨工事\nアーク溶接・半自動溶接・Tig溶接\n鉄・ステンレス等の資材加工\n商業施設・マンション向け溶接工事' },
        { label: '従業員資格', value: '溶接技能者資格\nアーク溶接特別教育修了\nガス溶接技能講習修了' },
        { label: '対応エリア', value: '横浜を中心に関東エリア' },
        { label: '所在地', value: '〒222-0023\n横浜市港北区仲手原2丁目42-23-5' }
    ];
}
