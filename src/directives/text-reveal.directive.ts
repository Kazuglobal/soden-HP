import { Directive, ElementRef, Input, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
    selector: '[appTextReveal]',
    standalone: true
})
export class TextRevealDirective implements AfterViewInit, OnDestroy {
    @Input() delay = 0.05; // Delay between each character in seconds
    private observer: IntersectionObserver | undefined;

    constructor(private el: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const text = this.el.nativeElement.textContent?.trim();
        if (!text) return;

        // Handle existing structure (simplistic approach: clear and rebuild)
        // IMPORTANT: This removes existing HTML like <br>. 
        // For the specific case of the Hero title "Line 1 <br> Line 2", it is better to apply this directive to 
        // separate container elements (e.g. spans or divs) rather than the parent h2 containing the br.
        // However, I will try to support basic text nodes.

        // Better strategy for this specific request:
        // If the element contains child nodes (like <br>), we might break layout if we just overwrite textContent.
        // So, I will assume this directive is applied to LEAF elements (elements containing only text).

        this.splitText(this.el.nativeElement);
        this.setupObserver();
    }

    private splitText(element: HTMLElement) {
        const text = element.textContent || '';
        element.innerHTML = '';
        element.style.opacity = '1'; // Ensure container is visible

        const chars = text.split('');
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.display = 'inline-block';
            span.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out`;
            span.style.transitionDelay = `${index * this.delay}s`;
            span.style.transform = 'translateY(10px)';
            // Preserve whitespace
            if (char === ' ') {
                span.style.width = '0.3em';
            }
            element.appendChild(span);
        });
    }

    private setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const spans = this.el.nativeElement.querySelectorAll('span');
                    spans.forEach((span: HTMLElement) => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                    });
                    this.observer?.unobserve(this.el.nativeElement);
                }
            });
        }, { threshold: 0.1 });

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy() {
        this.observer?.disconnect();
    }
}
