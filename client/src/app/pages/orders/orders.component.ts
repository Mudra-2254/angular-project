import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders$!: Observable<Order[]>;
  errorMessage: string | null = null;
  indexErrorUrl: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orders$ = this.orderService.getMyOrders().pipe(
      catchError(error => {
        console.error('OrdersComponent error:', error);
        this.errorMessage = 'Failed to load orders. Please check your connection or database configuration.';
        
        // Check if it's the missing index error
        if (error.message && error.message.includes('requires an index')) {
          const urlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s]+/);
          if (urlMatch) {
            this.indexErrorUrl = urlMatch[0];
          }
        }
        
        return of([]);
      })
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'Approved': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Shipped': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  }
}
