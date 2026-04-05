import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { NgIf } from "@angular/common";
import { SidebarComponent } from "./component/sidebar/sidebar.component";
import { ToastComponent } from "./component/toast/toast.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [NgIf, RouterOutlet, SidebarComponent, ToastComponent]
})
export class AppComponent {

  showSidebar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !event.url.includes('login');
      }
    });
  }
}
