import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {

  product: any;
  quantity: number = 1;

  addingToCart = false;
  alreadyInCart = false;
  addedToCart = false; // ✅ REQUIRED for template

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    this.productService.getSingleProduct(id).subscribe(async (data: any) => {
      this.product = { id, ...data };

      if (this.authService.isLoggedIn) {
        this.alreadyInCart = await this.cartService.isInCart(id);
      }
    });
  }

  // ✅ MATCHING HTML NAME
  increaseQty() {
    this.quantity++;
  }

  // ✅ MATCHING HTML NAME
  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  get totalPrice(): number {
    return this.product ? this.product.price * this.quantity : 0;
  }

  async addToCart() {
    if (!this.authService.isLoggedIn) {
      this.toastService.warning('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) return;

    this.addingToCart = true;

    try {
      // ✅ PASS 2 ARGUMENTS (VERY IMPORTANT)
      await this.cartService.addToCart(this.product, this.quantity);

      this.addedToCart = true;
      this.alreadyInCart = true;

    } catch (error) {
      console.error(error);
      this.toastService.error('Failed to add to cart ❌');
    } finally {
      this.addingToCart = false;
    }
  }

  async buyNow() {
    if (!this.authService.isLoggedIn) {
      this.toastService.warning('Please login first');
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) return;

    try {
      await this.cartService.addToCart(this.product, this.quantity);
      this.router.navigate(['/checkout']);
    } catch (error) {
      console.error(error);
      this.toastService.error('Failed to process ❌');
    }
  }

  goBack() {
    this.location.back();
  }
}