import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;

  // Shipping form
  fullName = '';
  address = '';
  city = '';
  zipCode = '';
  phone = '';

  // Payment modal
  showPaymentModal = false;
  showSuccessModal = false;
  selectedPayment: 'card' | 'upi' | 'cod' = 'card';
  processing = false;

  // Dummy card
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  private loadCart() {
    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  private calculateTotal() {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  openPaymentModal() {
    if (!this.fullName || !this.address || !this.city || !this.zipCode || !this.phone) {
      this.toastService.warning('Please fill in all shipping details');
      return;
    }
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  async processPayment() {
    if (this.cartItems.length === 0) {
      this.toastService.warning('Your cart is empty!');
      return;
    }

    this.processing = true;

    try {
      // Create order entry in Firestore
      await this.orderService.placeOrder({
        customerName: this.fullName,
        phone: this.phone,
        address: this.address,
        city: this.city,
        zipCode: this.zipCode,
        items: this.cartItems.map(item => ({
          productId: item.productId,
          pname: item.pname,
          image: item.image,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice: this.totalPrice,
        paymentMethod: this.selectedPayment
      });

      // Simulation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Clear cart
      for (const item of this.cartItems) {
        await this.cartService.removeFromCart(item.id);
      }

      this.cartItems = [];
      this.totalPrice = 0;
      this.processing = false;
      this.showPaymentModal = false;
      this.showSuccessModal = true;
    } catch (error) {
      console.error('Order placement failed:', error);
      this.toastService.error('Something went wrong while placing your order. Please try again.');
      this.processing = false;
    }
  }

  goHome() {
    this.router.navigate(['/']);
  }

  viewOrders() {
    this.router.navigate(['/orders']);
  }
}
