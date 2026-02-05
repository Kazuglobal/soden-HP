import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';

@Component({
  selector: 'app-cases',
  template: `
    <section id="cases" class="py-24 bg-zinc-950 overflow-hidden relative">
      <!-- Industrial background -->
      <div class="absolute inset-0 metal-texture opacity-20 pointer-events-none"></div>
      <!-- Heat glow effects -->
      <div class="absolute top-1/4 left-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-1/4 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div class="max-w-2xl">
            <h2 appGsapAnimate [animation]="'fadeUp'" class="text-4xl sm:text-5xl font-black text-zinc-100 tracking-tight" style="font-family: 'Noto Serif JP', serif;">
              施工事例
            </h2>
            <div class="mt-4 flex items-center gap-4">
              <span class="text-sm font-black tracking-widest text-orange-500 uppercase">WORKS & PROJECTS</span>
              <div class="h-px w-24 bg-gradient-to-r from-orange-500 to-amber-500 shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
            </div>
          </div>
          <p class="text-zinc-400 font-medium max-w-sm text-left md:text-right">
            商業施設からマンションまで、私たちの溶接技術はあらゆる場所に息づいています。
          </p>
        </div>
        <!-- Cases grid placeholder - add cases data to populate -->
      </div>
      <!-- Bottom weld seam -->
      <div class="absolute bottom-0 left-0 right-0 h-1 weld-seam"></div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [GsapScrollAnimateDirective]
})
export class CasesComponent {}
