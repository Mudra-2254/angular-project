import { Component, inject, OnInit, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Firestore, collection, collectionData, doc, updateDoc, query, orderBy } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from '../../service/toast.service';

export interface OrderItem {
  productId: string;
  pname: string;
  image: string;
  price: number;
  quantity: number;
}

export interface PerfumeOrder {
  id?: string;
  uid: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  zipCode?: string;
  items: OrderItem[];
  totalPrice: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Shipped' | 'Delivered';
  orderDate: any;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private injector = inject(Injector);
  private toastService = inject(ToastService);
  orders$!: Observable<PerfumeOrder[]>;
  filteredOrders$!: Observable<PerfumeOrder[]>;

  // Search and Filter State
  searchTerm = '';
  activeFilter: 'All' | 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Rejected' = 'All';

  // Stats
  stats = {
    totalRevenue: 0,
    pendingCount: 0,
    completedCount: 0,
    totalOrders: 0
  };

  ngOnInit() {
    const ordersCollection = collection(this.firestore, 'orders');
    const q = query(ordersCollection, orderBy('orderDate', 'desc'));
    this.orders$ = runInInjectionContext(this.injector, () => 
      collectionData(q, { idField: 'id' }) as Observable<PerfumeOrder[]>
    );
    
    // Setup stats and initial filter
    this.orders$.subscribe(orders => {
      this.calculateStats(orders);
      this.applyFilters();
    });
  }

  private calculateStats(orders: PerfumeOrder[]) {
    this.stats.totalOrders = orders.length;
    this.stats.totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
    this.stats.pendingCount = orders.filter(o => o.status === 'Pending').length;
    this.stats.completedCount = orders.filter(o => o.status === 'Delivered').length;
  }

  setFilter(filter: any) {
    this.activeFilter = filter;
    this.applyFilters();
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.applyFilters();
  }

  private applyFilters() {
    this.orders$.pipe(
      map(allOrders => {
        let filtered = allOrders;
        if (this.activeFilter !== 'All') {
          filtered = filtered.filter(o => o.status === this.activeFilter);
        }
        if (this.searchTerm) {
          filtered = filtered.filter(o => 
            o.customerName?.toLowerCase().includes(this.searchTerm) ||
            o.customerEmail?.toLowerCase().includes(this.searchTerm) ||
            o.id?.toLowerCase().includes(this.searchTerm)
          );
        }
        return filtered;
      })
    ).subscribe(filtered => {
      this.filteredOrders$ = of(filtered);
    });
  }

  async updateStatus(orderId: string | undefined, newStatus: string) {
    if (!orderId) return;
    console.log(`AdminOrders: Updating order ${orderId} to ${newStatus}...`);
    return runInInjectionContext(this.injector, async () => {
      const orderDoc = doc(this.firestore, `orders/${orderId}`);
      try {
        await updateDoc(orderDoc, { status: newStatus });
        console.log('AdminOrders: Status updated successfully');
      } catch (error) {
        console.error('AdminOrders error:', error);
        this.toastService.error('Failed to update status');
      }
    });
  }
}
