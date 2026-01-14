import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { Tilt3DDirective } from '../../directives/tilt-3d.directive';
import { HoverLiftDirective } from '../../directives/hover-effects.directive';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective, Tilt3DDirective, HoverLiftDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="staff" class="py-24 bg-white relative overflow-hidden">
      <!-- Technical "Road" Cable Trace for Staff Section -->
      <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-multiply">
          <img src="/images/soden_roadmap.png" 
               alt="Soden Technical Roadmap" 
               class="w-full h-auto min-h-full object-cover lg:object-contain rotate-12 scale-150 translate-x-1/2 translate-y-1/3">
        </div>
        <!-- Protective Overlay -->
        <div class="absolute inset-0 bg-white/30"></div>
      </div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-20 relative z-20">
          <div class="inline-block bg-white/90 backdrop-blur-sm px-10 py-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 appGsapAnimate [animation]="'fadeUp'" class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight" style="font-family: 'Noto Serif JP', serif;">
              社員紹介
            </h2>
            <div class="mt-4 flex justify-center items-center gap-4">
              <div class="h-px w-12 bg-[#0ea5e9]"></div>
              <span class="text-sm font-black tracking-widest text-[#0ea5e9] uppercase">OUR PROFESSIONALS</span>
              <div class="h-px w-12 bg-[#0ea5e9]"></div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          @for (member of staffMembers; track member.name; let i = $index) {
            <div appGsapAnimate [animation]="'fadeUp'" [delay]="i * 0.15" class="group">
              <div appTilt3D [tiltMaxX]="10" [tiltMaxY]="10" class="relative rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-xl group-hover:shadow-2xl transition-all duration-500">
                <div class="h-[450px] overflow-hidden relative">
                  <img [src]="member.image" [alt]="member.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                  
                  <div class="absolute bottom-0 left-0 p-8 w-full">
                    <div class="flex items-center gap-3 mb-3">
                      <span class="px-3 py-1 bg-[#0ea5e9] text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                        {{ member.bloodType }} Type
                      </span>
                    </div>
                    <h3 class="text-3xl font-black text-white" style="font-family: 'Noto Serif JP', serif;">{{ member.name }}</h3>
                    <p class="text-sky-300 font-bold text-sm mt-1 uppercase tracking-widest">{{ member.role }}</p>
                    <div class="mt-4 flex flex-wrap gap-2">
                       @for (tag of member.tags; track tag) {
                         <span class="text-[10px] font-bold text-white/70 px-2 py-0.5 border border-white/20 rounded-md bg-white/5">{{ tag }}</span>
                       }
                    </div>
                  </div>
                </div>

                <div class="p-8 space-y-6">
                  <div>
                    <h4 class="text-xs font-black text-[#0ea5e9] uppercase tracking-widest mb-2">My Work</h4>
                    <p class="text-slate-600 text-sm leading-relaxed font-medium">{{ member.jobDesc }}</p>
                  </div>
                  <div>
                    <h4 class="text-xs font-black text-[#0ea5e9] uppercase tracking-widest mb-2">Passion</h4>
                    <p class="text-slate-700 text-base leading-relaxed font-bold italic">"{{ member.passion }}"</p>
                  </div>
                  <div class="pt-6 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-xs text-slate-400 font-medium">Joined: {{ member.joinYear }}</span>
                    <span class="text-xs text-slate-400 font-medium">Hobbies: {{ member.hobby }}</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class StaffComponent {
  staffMembers = [
    {
      name: '佐野 英司',
      role: 'Eiji Sano / 施工管理士',
      image: '/images/employee1.JPG',
      joinYear: '2004年',
      bloodType: 'O',
      hobby: 'マウンテンバイク',
      tags: ['1級施工管理技士', '第1種電気工事士', '消防設備士'],
      jobDesc: '住宅10棟の同時進行や大規模現場の指示出しを担当。電気科で学んだ基礎をさらに高め、現在は国家資格を活かして複雑な警報設備の整備点検まで手がけます。',
      passion: '竣工時、電気が点き、モーターが回る瞬間を確認できることが最高の喜び。パワフルでフットワークの軽い仲間と共に日々邁進しています。'
    },
    {
      name: '林 隆博',
      role: 'Takahiro Hayashi / 電気工事士',
      image: '/images/employee2.JPG',
      joinYear: '2014年',
      bloodType: 'AB',
      hobby: '三社大祭、八戸えんぶり',
      tags: ['変電設備', '強電工事', '若手育成'],
      jobDesc: '建物の心臓部となる変電設備の設置から、照明・空調などの末端まで電気を送る全工程を担当。若手が学びやすい現場環境づくりも大切にしています。',
      passion: 'もしもの災害時、自分の経験と知識を復旧の手助けに活かしたい。培った技術は誰かの助けになる、その誇りを持って仕事をしています。'
    },
    {
      name: '榊田 了',
      role: 'Ryoichi Sakakida / 電気工事士',
      image: '/images/employee3.JPG',
      joinYear: '2013年',
      bloodType: 'A',
      hobby: 'ゲーム、スポーツ、カラオケ',
      tags: ['第2種電気工事士', 'アットホーム', '自己研鑽'],
      jobDesc: '異業種から転職し、働きながら国家資格を取得。現在はビルやマンションなど、幅広い現場を任されています。進化し続ける技術に飽くことなく挑戦中です。',
      passion: '電気工事は一生学びが続く仕事。だからこそ飽きることがなく、やりがいがあります。家族のため、電力インフラを支えていく誇りを持っています。'
    }
  ];
}
