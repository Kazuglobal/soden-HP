import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { HoverLiftDirective } from '../../directives/hover-effects.directive';
import { CountUpDirective } from '../../directives/count-up.directive';

interface SdgInfo {
  color: string;
  goal: string;
}

const SDG_DATA: Record<number, SdgInfo> = {
  1: { color: '#E5243B', goal: '1. 貧困をなくそう' },
  2: { color: '#DDA63A', goal: '2. 飢餓をゼロに' },
  4: { color: '#C5192D', goal: '4. 質の高い教育をみんなに' },
  7: { color: '#FFB71B', goal: '7. エネルギーをみんなにそしてクリーンに' },
  8: { color: '#A21942', goal: '8. 働きがいも経済成長も' },
  9: { color: '#FD6925', goal: '9. 産業と技術革新の基盤をつくろう' },
  11: { color: '#FD9D24', goal: '11. 住み続けられるまちづくりを' },
  12: { color: '#BF8B2E', goal: '12. つくる責任つかう責任' },
  13: { color: '#3F7E44', goal: '13. 気候変動に具体的な対策を' }
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
export class FeatureComponent implements OnInit, OnDestroy {
  communitySlideIndex = 0;
  private slideInterval: any = null;

  craftsmanship = {
    title: '技術と温もりが、未来を育む場所。',
    subtitle: '施工事例',
    description: '保育園の新築工事に携わりました。屋根はすべて全面太陽光パネルを入れ、炊事ができる薪ストーブを設置しているエコな保育園です。シンボルであるキリンのオブジェも自社で設置しました。このほか、小中学校や消防、民間のビルやマンション、老人ホームなど、大きい工事から個人住宅まですべてやらせていただいています。',
    image: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=2000&auto=format&fit=crop',
    sdgs: [4, 7, 8, 9, 11, 12],
    categories: ['小中学校', '消防署', '民間ビル・マンション', '老人ホーム', '個人住宅']
  };

  sdgCommitment = {
    title: 'SDGsに取り組んでいます',
    lead: '持続可能な未来へ。まずは私たち自身が変わる挑戦。',
    description: '市内数カ所に太陽光パネルを設置し、自社の電力はすべて自社で賄っています。温室効果ガス排出量の増加による地球温暖化への対策が深刻な問題とされており、脱炭素化に向け再生可能エネルギーの持続的な普及に貢献しています。',
    metric: 100,
    metricUnit: '%',
    metricLabel: '自社電力賄い率',
    image: 'https://images.unsplash.com/photo-1509391111727-55eb04de00be?q=80&w=2000&auto=format&fit=crop',
    sdgs: [7, 12, 13]
  };

  community = {
    title: '地域貢献に力を入れています',
    subtitle: '未来を担う子供たちの、健やかな成長のために.',
    description: '地元の保育園サッカー大会の協賛やゴールの運搬なども行っています。また中学生の野球教室の指導やグラウンド整備、審判などにも協力。これからの未来を担う子供たちの為に活動を行っています。',
    images: [
      'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544449897-4203679be93e?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517173005809-fb47ccff164f?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000&auto=format&fit=crop',
      '/images/community_slide_1.png'
    ],
    activities: [
      {
        label: 'サッカー大会支援',
        image: '/images/community_soccer.png'
      },
      {
        label: '野球教室指導',
        image: '/images/community_baseball.png'
      }
    ],
    sdgs: [1, 2, 11]
  };

  ngOnInit() {
    this.slideInterval = setInterval(() => {
      this.communitySlideIndex = (this.communitySlideIndex + 1) % this.community.images.length;
    }, 5000);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  getSdgColor(id: number): string {
    return SDG_DATA[id]?.color ?? '#666';
  }

  getSdgGoal(id: number): string {
    return SDG_DATA[id]?.goal ?? '';
  }
}
