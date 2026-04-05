import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, NavigationStart } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { FooterComponent } from './component/footer/footer.component';
import { ToastComponent } from './component/toast/toast.component';
import { NgIf } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomeComponent, NavbarComponent, FooterComponent, NgIf, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'client';
  showLayout = true;
  isTransitioning = false;

  private hiddenRoutes = ['/login', '/register'];
  private routerSub!: Subscription;
  private navStartSub!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    // Handle layout visibility
    this.routerSub = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showLayout = !this.hiddenRoutes.includes(event.urlAfterRedirects || event.url);

      // Scroll to top smoothly + refresh ScrollTrigger
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => ScrollTrigger.refresh(), 100);
    });

    // Page transition — fade out on navigate start
    this.navStartSub = this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.isTransitioning = true;
    });

    // Page transition — fade in on navigate end
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Small delay for content to render, then fade in
      setTimeout(() => {
        this.isTransitioning = false;
      }, 50);
    });
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    this.navStartSub?.unsubscribe();
  }
}
