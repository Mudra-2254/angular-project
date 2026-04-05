import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  collection,
  collectionData,
  addDoc,
  deleteDoc,
  doc,
  Firestore,
  query,
  where,
  getDocs,
  updateDoc
} from '@angular/fire/firestore';
import { Auth, user, User } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface CartItem {
  id?: string;
  uid: string;
  productId: string;
  pname: string;
  image: string;
  price: number;
  quantity: number;
  pdesc?: string;
}

import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private injector = inject(Injector);
  private toastService = inject(ToastService);
  private user$: Observable<User | null>;

  constructor() {
    this.user$ = user(this.auth);
    console.log('CartService: Initialized with project:', this.firestore.app.options.projectId);
  }

  // Add product to cart
  async addToCart(product: any, quantity: number): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) throw new Error('User not logged in');

    return runInInjectionContext(this.injector, async () => {
      const cartCollection = collection(this.firestore, 'cart');
      // Check current cart total quantity
      const cartItemsQuery = query(cartCollection, where('uid', '==', currentUser.uid));
      const cartSnapshot = await getDocs(cartItemsQuery);
      let currentTotalQty = 0;
      cartSnapshot.forEach(doc => {
        currentTotalQty += Number(doc.data()['quantity']) || 0;
      });

      if (currentTotalQty + Number(quantity) > 10) {
        this.toastService.warning('You can only have a maximum of 10 items in your cart.');
        return;
      }

      const q = query(
        cartCollection,
        where('uid', '==', currentUser.uid),
        where('productId', '==', product.id)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const existingDoc = snapshot.docs[0];
        const cartDocRef = doc(this.firestore, `cart/${existingDoc.id}`);
        const oldQty = Number(existingDoc.data()['quantity']) || 0;
        await updateDoc(cartDocRef, { quantity: oldQty + Number(quantity) });
        return;
      }

      await addDoc(cartCollection, {
        uid: currentUser.uid,
        productId: product.id,
        pname: product.pname,
        image: product.image,
        price: Number(product.price),
        quantity: Number(quantity)
      });
    });
  }

  // Check if product is already in cart
  async isInCart(productId: string): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;

    return runInInjectionContext(this.injector, async () => {
      const cartCollection = collection(this.firestore, 'cart');
      const q = query(
        cartCollection,
        where('uid', '==', user.uid),
        where('productId', '==', productId)
      );

      const snapshot = await getDocs(q);
      return !snapshot.empty;
    });
  }

  // Get all cart items (Reactive to auth state)
  getCartItems(): Observable<CartItem[]> {
    return this.user$.pipe(
      switchMap(currentUser => {
        if (!currentUser) return of([]);
        return runInInjectionContext(this.injector, () => {
          const cartCollection = collection(this.firestore, 'cart');
          const q = query(cartCollection, where('uid', '==', currentUser.uid));
          return collectionData(q, { idField: 'id' }) as Observable<CartItem[]>;
        });
      })
    );
  }

  // Increase quantity
  async increaseQty(item: CartItem) {
    if (!item.id) return;
    console.log('CartService: Increasing quantity for', item.id);
    
    return runInInjectionContext(this.injector, async () => {
      const currentUser = this.auth.currentUser;
      if (!currentUser) return;

      const cartCollection = collection(this.firestore, 'cart');
      // Check current cart total quantity
      const cartItemsQuery = query(cartCollection, where('uid', '==', currentUser.uid));
      const cartSnapshot = await getDocs(cartItemsQuery);
      let currentTotalQty = 0;
      cartSnapshot.forEach(doc => {
        currentTotalQty += Number(doc.data()['quantity']) || 0;
      });

      if (currentTotalQty + 1 > 10) {
        this.toastService.warning('You can only have a maximum of 10 items in your cart.');
        return;
      }

      const cartDoc = doc(this.firestore, `cart/${item.id}`);
      return updateDoc(cartDoc, { quantity: item.quantity + 1 });
    });
  }

  // Decrease quantity
  decreaseQty(item: CartItem) {
    if (!item.id || item.quantity <= 1) return Promise.resolve();
    console.log('CartService: Decreasing quantity for', item.id);
    return runInInjectionContext(this.injector, () => {
      const cartDoc = doc(this.firestore, `cart/${item.id}`);
      return updateDoc(cartDoc, { quantity: item.quantity - 1 });
    });
  }

  // Remove item from cart
  removeFromCart(itemId: string | undefined) {
    if (!itemId) return Promise.resolve();
    const cartDoc = doc(this.firestore, `cart/${itemId}`);
    return deleteDoc(cartDoc);
  }
}