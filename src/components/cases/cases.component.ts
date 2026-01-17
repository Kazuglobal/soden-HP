import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapScrollAnimateDirective } from '../../directives/gsap-scroll-animate.directive';
import { HoverZoomDirective } from '../../directives/hover-effects.directive';

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

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          @for (case of cases; track case.title; let i = $index) {
            <div appGsapAnimate [animation]="'fadeUp'" [delay]="i * 0.2" class="group cursor-pointer">
              <div class="relative rounded-[3rem] overflow-hidden bg-white shadow-xl shadow-slate-200/50">
                <div class="h-[400px] overflow-hidden" appHoverZoom [zoomScale]="1.05">
                  <img [src]="case.image" [alt]="case.title" class="w-full h-full object-cover transition-transform duration-1000">
                  <div class="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                </div>
                
                <div class="p-10">
                  <div class="flex items-center gap-4 mb-4">
                    <span class="text-[10px] font-black tracking-[0.2em] text-[#0ea5e9] uppercase">{{ case.category }}</span>
                    <div class="h-[1px] w-8 bg-slate-100"></div>
                  </div>
                  <h3 class="text-2xl font-black text-slate-900 leading-tight mb-4" style="font-family: 'Noto Serif JP', serif;">
                    {{ case.title }}
                  </h3>
                  <p class="text-slate-600 leading-relaxed font-medium mb-8">
                    {{ case.description }}
                  </p>
                  
                  <div class="flex flex-wrap gap-3">
                    @for (tag of case.tags; track tag) {
                      <span class="px-4 py-1.5 bg-slate-50 text-slate-500 text-[11px] font-bold rounded-full border border-slate-100">#{{ tag }}</span>
                    }
                  </div>
                </div>
                
                <!-- Floating Action Button -->
                <div class="absolute top-10 right-10 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <svg class="w-6 h-6 text-[#0ea5e9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, GsapScrollAnimateDirective, HoverZoomDirective]
})
export class CasesComponent {
  cases = [];
}
