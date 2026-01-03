import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
    selector: '[appScrollAnimate]',
    standalone: true
})
export class ScrollAnimateDirective implements OnInit, OnDestroy {
    @Input() animationClass = 'animate-fade-up';
    @Input() threshold = 0.1;

    private observer: IntersectionObserver | undefined;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.el.nativeElement.classList.add('opacity-0'); // Start hidden

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.el.nativeElement.classList.remove('opacity-0');
                    this.el.nativeElement.classList.add(this.animationClass);
                    this.observer?.unobserve(this.el.nativeElement); // Trigger only once
                }
            });
        }, {
            threshold: this.threshold
        });

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy() {
        this.observer?.disconnect();
    }
}
