import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgForOf, NgIf, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice = 0;

  constructor(private cartService: CartService) {}

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

  async removeItem(itemId: string | undefined) {
    if (!itemId) return;
    await this.cartService.removeFromCart(itemId);
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.calculateTotal();
  }

  async increaseQty(item: CartItem) {
    await this.cartService.increaseQty(item);
    item.quantity += 1;
    this.calculateTotal();
  }

  async decreaseQty(item: CartItem) {
    if (item.quantity <= 1) return;
    await this.cartService.decreaseQty(item);
    item.quantity -= 1;
    this.calculateTotal();
  }
}