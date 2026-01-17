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
    title: '技術と温もりが、未来を育む場所。',
    subtitle: '施工事例',
    description: '保育園の新築工事に携わりました。屋根はすべて全面太陽光パネルを入れ、炊事ができる薪ストーブを設置しているエコな保育園です。シンボルであるキリンのオブジェも自社で設置しました。このほか、小中学校や消防、民間のビルやマンション、老人ホームなど、大きい工事から個人住宅まですべてやらせていただいています。',
    image: '/images/kokubo_nursery.jpg',
    sdgs: [4, 7, 8, 9, 11, 12]
  };

  publicWorks = {
    title: '確かな技術で、地域の学び舎を支える。',
    subtitle: '公共施設・小中学校改修',
    description: '地域の未来を担う子供たちの学び舎を支える、確かな電気工事。照明LED化から変電設備の更新まで、市内の多くの小中学校や公共施設の改修に携わっています。安心・安全な環境づくりを通じて、地域社会の発展に貢献します。',
    image: '/images/sportroom.png',
    sdgs: [4, 7, 11, 12, 13]
  };

  sdgCommitment = {
    title: 'SDGsに取り組んでいます',
    description: '市内数カ所に太陽光パネルを設置し、自社の電力はすべて自社で賄っています。温室効果ガス排出量の増加による地球温暖化への対策が深刻な問題とされており、脱炭素化に向け再生可能エネルギーの持続的な普及に貢献しています。',
    metric: 100,
    metricUnit: '%',
    metricLabel: '自社電力賄い率',
    image: '/images/solar_sdg.png',
    sdgs: [7, 12, 13]
  };

  community = {
    title: '地域貢献に力を入れています',
    subtitle: '未来を担う子供たちの、健やかな成長のために.',
    description: '地元の保育園サッカー大会の協賛やゴールの運搬なども行っています。また中学生の野球教室の指導やグラウンド整備、審判などにも協力。これからの未来を担う子供たちの為に活動を行っています。',
    backgroundImage: '/images/community_bg.jpg',
    activities: [
      { label: 'サッカー大会支援', image: '/images/community_soccer_new.jpg' },
      { label: '野球教室指導', image: '/images/community_baseball_new.jpg' }
    ],
    sdgs: [1, 2, 11]
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
