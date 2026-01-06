import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapSplitTextDirective } from '../../directives/gsap-split-text.directive';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { Tilt3DDirective } from '../../directives/tilt-3d.directive';
import { MagneticDirective } from '../../directives/magnetic.directive';
import { HoverZoomDirective, HoverLiftDirective } from '../../directives/hover-effects.directive';
import { MaskRevealDirective } from '../../directives/mask-reveal.directive';
import { CountUpDirective } from '../../directives/count-up.directive';
import { ParallaxDirective } from '../../directives/parallax.directive';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    GsapSplitTextDirective,
    GsapScrollAnimateDirective,
    Tilt3DDirective,
    MagneticDirective,
    HoverZoomDirective,
    HoverLiftDirective,
    MaskRevealDirective,
    CountUpDirective,
    ParallaxDirective
  ]
})
export class FeatureComponent {
  parseInt = parseInt;

  features = [
    {
      image: 'illustrations/feature-technical.svg',
      alt: '高い技術力 - 分電盤と作業員のアイソメトリックイラスト',
      number: '01',
      title: '信頼される高い技術力',
      description: '経験豊富な技術者が、設計から施工、メンテナンスまで一貫して対応。最新の技術とノウハウを駆使し、高品質な電気設備を提供します。難易度の高い工事にも対応可能です。'
    },
    {
      image: 'illustrations/feature-safety.svg',
      alt: '安全管理体制 - ヘルメットと安全装備のアイソメトリックイラスト',
      number: '02',
      title: '徹底した安全管理体制',
      description: '安全を最優先に考え、全ての現場で徹底した安全管理を実施しています。作業員の安全教育はもちろん、危険予知活動を通じて、無事故・無災害の現場を実現します。'
    },
    {
      image: 'illustrations/feature-experience.svg',
      alt: '豊富な実績 - ビルと住宅のアイソメトリックイラスト',
      number: '03',
      title: '公共施設から民間まで豊富な実績',
      description: 'オフィスビル、商業施設、工場、公共施設など、多岐にわたる建物の電気設備工事を手掛けてきました。その豊富な実績と経験が、お客様からの信頼の証です。'
    }
  ];
}
