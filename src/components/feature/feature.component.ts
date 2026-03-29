import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { HoverLiftDirective } from '../../directives/hover-effects.directive';
import { CountUpDirective } from '../../directives/count-up.directive';

const SDG_GOALS: Record<number, string> = {
  1: '1. 貧困をなくそう',
  2: '2. 飢餓をゼロに',
  4: '4. 質の高い教育をみんなに',
  7: '7. エネルギーをみんなにそしてクリーンに',
  8: '8. 働きがいも経済成長も',
  9: '9. 産業と技術革新の基盤をつくろう',
  11: '11. 住み続けられるまちづくりを',
  12: '12. つくる責任つかう責任',
  13: '13. 気候変動に具体的な対策を'
};

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    CommonModule,
    GsapScrollAnimateDirective,
    HoverLiftDirective,
    CountUpDirective
  ],
  templateUrl: './feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent {
  craftsmanship = {
    title: '確かな技術で、現場を支える。',
    subtitle: '施工事例',
    description: '商業施設やマンションでアーク溶接の実績も多数ございます。これまできめ細かな丁寧な施工を行うことを心掛けており、そのような姿勢に共感していただきお客様にリピートしてご利用いただいております。',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80',
    sdgs: [8, 9, 11, 12]
  };

  publicWorks = {
    title: '横浜を中心に臨機応変に対応。',
    subtitle: '出張工事',
    description: '横浜を中心に臨機応変に工事現場へお伺いし作業に取り組んでおります。現場を支える鉄鋼のプロフェッショナルとして、資格や豊富な経験を持つスタッフに工事の依頼をしてみませんか。幅広いお問い合わせをお待ちしております。',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    sdgs: [8, 9, 11, 12]
  };

  sdgCommitment = {
    title: 'お客様満足を追求しています',
    description: '体力のある若いスタッフが多数在籍しており、お客様のご要望に応じてスピード感を持って臨機応変に工事を進めてまいります。仕上がりの美しい施工を行うことはもちろん、アフターフォローを徹底して行っております。',
    metric: 100,
    metricUnit: '%',
    metricLabel: '顧客満足度',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80',
    sdgs: [8, 9, 12]
  };

  community = {
    title: '信頼関係の構築に努めています',
    subtitle: 'お客様との絆を大切に',
    description: '些細なお困り事も気軽にご相談いただけるよう、お客様との信頼関係の構築に日々努めております。専門性の高い鉄鋼に関する資格を持つプロに工事を任せてみませんか。',
    backgroundImage: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1600&q=80',
    activities: [
      { label: '丁寧な施工', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
      { label: 'アフターフォロー', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80' }
    ],
    sdgs: [8, 9, 12]
  };

  getSdgGoal(id: number): string {
    return SDG_GOALS[id] ?? '';
  }

  getSdgIconPath(id: number): string {
    const paddedId = id.toString().padStart(2, '0');
    const suffix = id === 10 ? '3' : '2';
    return `/images/SDGs-icon/sdg_icon_${paddedId}_ja_${suffix}.png`;
  }
}
