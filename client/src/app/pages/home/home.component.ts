import { Component, OnInit, AfterViewInit, OnDestroy, NgZone, ElementRef, ViewChild } from '@angular/core';
import { FooterComponent } from '../../component/footer/footer.component';
import { ProductService } from '../../services/product.service';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-home',
  imports: [FooterComponent, NgForOf, RouterLink, ScrollAnimateDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  products: any[] = [];

  constructor(
    private prservice: ProductService,
    private ngZone: NgZone,
    private elRef: ElementRef
  ) {}

  ngOnInit() {
    this.prservice.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => this.initHeroAnimations());
    });
  }

  private initHeroAnimations() {
    const el = this.elRef.nativeElement;

    // ── Hero staggered entrance timeline ──
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Badge
    const badge = el.querySelector('.hero-badge');
    if (badge) {
      gsap.set(badge, { opacity: 0, y: -20, filter: 'blur(8px)' });
      heroTl.to(badge, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 0.2);
    }

    // Heading — split words for stagger
    const heading = el.querySelector('.hero-heading');
    if (heading) {
      const words = heading.querySelectorAll('.hero-word');
      if (words.length) {
        gsap.set(words, { opacity: 0, y: 50, rotateX: -40 });
        heroTl.to(words, {
          opacity: 1, y: 0, rotateX: 0,
          duration: 1, stagger: 0.08, ease: 'power4.out'
        }, 0.4);
      }
    }

    // Subheading
    const sub = el.querySelector('.hero-sub');
    if (sub) {
      gsap.set(sub, { opacity: 0, y: 30 });
      heroTl.to(sub, { opacity: 1, y: 0, duration: 0.9 }, 0.7);
    }

    // Tags stagger
    const tags = el.querySelectorAll('.hero-tag');
    if (tags.length) {
      gsap.set(tags, { opacity: 0, scale: 0.8 });
      heroTl.to(tags, {
        opacity: 1, scale: 1,
        duration: 0.6, stagger: 0.08, ease: 'back.out(2)'
      }, 0.9);
    }

    // CTA buttons
    const ctas = el.querySelectorAll('.hero-cta');
    if (ctas.length) {
      gsap.set(ctas, { opacity: 0, y: 25 });
      heroTl.to(ctas, {
        opacity: 1, y: 0,
        duration: 0.8, stagger: 0.12
      }, 1.1);
    }

    // Stats stagger
    const stats = el.querySelectorAll('.hero-stat');
    if (stats.length) {
      gsap.set(stats, { opacity: 0, y: 30, scale: 0.9 });
      heroTl.to(stats, {
        opacity: 1, y: 0, scale: 1,
        duration: 0.8, stagger: 0.1
      }, 1.3);
    }

    // Hero image — reveal
    const heroImg = el.querySelector('.hero-image-wrap');
    if (heroImg) {
      gsap.set(heroImg, { opacity: 0, scale: 0.9, filter: 'blur(12px)' });
      heroTl.to(heroImg, {
        opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 1.4, ease: 'power2.out'
      }, 0.5);
    }

    // Scroll indicator fade
    const scrollInd = el.querySelector('.scroll-indicator');
    if (scrollInd) {
      gsap.set(scrollInd, { opacity: 0, y: 15 });
      heroTl.to(scrollInd, { opacity: 1, y: 0, duration: 0.8 }, 1.6);
    }

    // ── Parallax on hero image ──
    const heroImage = el.querySelector('.hero-parallax');
    if (heroImage) {
      gsap.to(heroImage, {
        y: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: heroImage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }

    // ── Parallax on background orbs ──
    const orbs = el.querySelectorAll('.bg-orb');
    orbs.forEach((orb: Element, i: number) => {
      gsap.to(orb, {
        y: (i % 2 === 0) ? -120 : 80,
        x: (i % 2 === 0) ? -30 : 20,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        }
      });
    });

    // ── Brand Story image reveal ──
    const storyImg = el.querySelector('.story-image');
    if (storyImg) {
      gsap.set(storyImg, {
        clipPath: 'inset(10% 10% 10% 10%)',
        scale: 1.1,
        filter: 'blur(6px)'
      });
      gsap.to(storyImg, {
        clipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: storyImg,
          start: 'top 80%',
          toggleActions: 'play none none none',
        }
      });
    }

    // ── CTA section entrance ──
    const ctaCard = el.querySelector('.cta-card');
    if (ctaCard) {
      gsap.set(ctaCard, { opacity: 0, scale: 0.92, y: 40 });
      gsap.to(ctaCard, {
        opacity: 1, scale: 1, y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ctaCard,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
    }
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
