import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollAnimateDirective } from '../../directives/scroll-animate.directive';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-products',
  imports: [NgForOf, NgIf, RouterLink, ScrollAnimateDirective],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  products: any[] = [];

  constructor(private pser: ProductService) { }

  ngOnInit() {
    this.pser.getProducts().subscribe((data: any) => {
      this.products = data;
    });
  }

  ngOnDestroy() {
    ScrollTrigger.getAll().forEach(st => st.kill());
  }
}
