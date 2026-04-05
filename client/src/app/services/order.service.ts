import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  collection,
  collectionData,
  addDoc,
  Firestore,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Auth, user, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface OrderItem {
  productId: string;
  pname: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id?: string;
  uid: string;
  customerEmail: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Shipped' | 'Delivered';
  orderDate: any;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);
  private user$: Observable<User | null>;

  constructor() {
    this.user$ = user(this.auth);
    console.log('OrderService: Initialized with project:', this.firestore.app.options.projectId);
  }

  // Place a new order
  async placeOrder(orderDetails: Omit<Order, 'id' | 'uid' | 'customerEmail' | 'orderDate' | 'status'>): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('User not logged in');

    console.log('OrderService: Placing order...');
    await runInInjectionContext(this.injector, async () => {
      const ordersCollection = collection(this.firestore, 'orders');
      await addDoc(ordersCollection, {
        ...orderDetails,
        uid: user.uid,
        customerEmail: user.email,
        status: 'Pending',
        orderDate: serverTimestamp()
      });
      console.log('OrderService: Order placed successfully!');
    });
  }

  // Get orders for the current user (Reactive to auth state)
  getMyOrders(): Observable<Order[]> {
    return this.user$.pipe(
      switchMap(currentUser => {
        if (!currentUser) return of([]);

        return runInInjectionContext(this.injector, () => {
          const ordersCollection = collection(this.firestore, 'orders');
          const q = query(
            ordersCollection,
            where('uid', '==', currentUser.uid),
            orderBy('orderDate', 'desc')
          );
          return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
        });
      })
    );
  }
}
