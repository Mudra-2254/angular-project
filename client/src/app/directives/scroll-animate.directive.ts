import { Directive, ElementRef, Input, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable scroll-triggered animation directive.
 * Usage:  <div appScrollAnimate animation="fadeUp" delay="0.2" duration="1">
 *
 * Supported animations:
 *   fadeUp, fadeDown, fadeLeft, fadeRight,
 *   scaleIn, blurIn, slideUp, revealText,
 *   parallax, stagger
 */
@Directive({
  selector: '[appScrollAnimate]',
  standalone: true,
})
export class ScrollAnimateDirective implements AfterViewInit, OnDestroy {
  @Input() animation: string = 'fadeUp';
  @Input() delay: number = 0;
  @Input() duration: number = 1;
  @Input() staggerDelay: number = 0.12;
  @Input() parallaxSpeed: number = 0.3;
  @Input() triggerStart: string = 'top 88%';
  @Input() triggerEnd: string = 'bottom 20%';

  private scrollTrigger: ScrollTrigger | null = null;

  constructor(
    private el: ElementRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      // Let the DOM settle before animating
      requestAnimationFrame(() => {
        this.createAnimation();
      });
    });
  }

  private createAnimation() {
    const element = this.el.nativeElement;
    const ease = 'power3.out';

    switch (this.animation) {

      case 'fadeUp':
        gsap.set(element, { opacity: 0, y: 50 });
        gsap.to(element, {
          opacity: 1, y: 0,
          duration: this.duration,
          delay: this.delay,
          ease,
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'fadeDown':
        gsap.set(element, { opacity: 0, y: -40 });
        gsap.to(element, {
          opacity: 1, y: 0,
          duration: this.duration,
          delay: this.delay,
          ease,
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'fadeLeft':
        gsap.set(element, { opacity: 0, x: -60 });
        gsap.to(element, {
          opacity: 1, x: 0,
          duration: this.duration,
          delay: this.delay,
          ease,
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'fadeRight':
        gsap.set(element, { opacity: 0, x: 60 });
        gsap.to(element, {
          opacity: 1, x: 0,
          duration: this.duration,
          delay: this.delay,
          ease,
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'scaleIn':
        gsap.set(element, { opacity: 0, scale: 0.85 });
        gsap.to(element, {
          opacity: 1, scale: 1,
          duration: this.duration,
          delay: this.delay,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'blurIn':
        gsap.set(element, { opacity: 0, filter: 'blur(15px)', y: 30 });
        gsap.to(element, {
          opacity: 1, filter: 'blur(0px)', y: 0,
          duration: this.duration * 1.2,
          delay: this.delay,
          ease,
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'slideUp':
        gsap.set(element, { opacity: 0, y: 80, clipPath: 'inset(100% 0 0 0)' });
        gsap.to(element, {
          opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)',
          duration: this.duration * 1.2,
          delay: this.delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'revealText':
        gsap.set(element, { clipPath: 'inset(0 100% 0 0)' });
        gsap.to(element, {
          clipPath: 'inset(0 0% 0 0)',
          duration: this.duration * 1.3,
          delay: this.delay,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: element,
            start: this.triggerStart,
            toggleActions: 'play none none none',
          }
        });
        break;

      case 'parallax':
        gsap.to(element, {
          y: () => -100 * this.parallaxSpeed,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        });
        break;

      case 'stagger':
        const children = element.children;
        if (children.length) {
          gsap.set(children, { opacity: 0, y: 40 });
          gsap.to(children, {
            opacity: 1, y: 0,
            duration: this.duration,
            stagger: this.staggerDelay,
            delay: this.delay,
            ease,
            scrollTrigger: {
              trigger: element,
              start: this.triggerStart,
              toggleActions: 'play none none none',
            }
          });
        }
        break;

      default:
        break;
    }
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === this.el.nativeElement) {
        st.kill();
      }
    });
  }
}
