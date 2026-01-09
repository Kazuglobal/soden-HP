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
      image: 'https://loremflickr.com/400/300/team,office?lock=1',
      alt: '任せて認める組織',
      number: '01',
      title: '主体性を育む「任せて認める」組織',
      description: '一人一人がやるべきことを把握し、自ら考えて動ける主体性を大切にしています。アットホームな雰囲気の中、未経験からでも働きながら資格を取得し、一流の技術者へと成長できる環境があります。'
    },
    {
      image: 'https://loremflickr.com/400/300/solar,energy?lock=1',
      alt: 'SDGsへの取り組み',
      number: '02',
      title: '太陽光発電によるSDGsへの貢献',
      description: '自社電力をすべて太陽光発電で賄うなど、再生可能エネルギーの普及に積極的に取り組んでいます。脱炭素化社会の実現に向け、環境保護と持続可能な発展に貢献し続けています。'
    },
    {
      image: 'https://loremflickr.com/400/300/soccer,kids?lock=1',
      alt: '地域貢献',
      number: '03',
      title: '未来を担う子供たちへの地域貢献',
      description: '保育園サッカー大会の協賛や野球教室の指導など、地元八戸の未来を担う子供たちの活動を全力で支援しています。技術だけでなく、心豊かな地域社会の創造を目指しています。'
    }
  ];
}
