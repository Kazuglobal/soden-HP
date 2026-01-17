import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-cases',
  template: `
    <section id="cases" class="py-24 bg-slate-50 overflow-hidden">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div class="max-w-2xl">
            <h2 appGsapAnimate [animation]="'fadeUp'" class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight" style="font-family: 'Noto Serif JP', serif;">
              施工事例
            </h2>
            <div class="mt-4 flex items-center gap-4">
              <span class="text-sm font-black tracking-widest text-[#0ea5e9] uppercase">WORKS & PROJECTS</span>
              <div class="h-px w-24 bg-[#0ea5e9]"></div>
            </div>
          </div>
          <p class="text-slate-500 font-medium max-w-sm text-left md:text-right">
            公共施設から民間ビル、個人住宅まで、私たちの技術はあらゆる場所に息づいています。
          </p>
        </div>
        <!-- Cases grid placeholder - add cases data to populate -->
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GsapScrollAnimateDirective]
})
export class CasesComponent {}
