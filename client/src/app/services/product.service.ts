import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import {
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private fireStore = inject(Firestore);
  private injector = inject(Injector);
  getProducts() {
    console.log('ProductService: fetching products...');
    return runInInjectionContext(this.injector, () => {
      const productColl = collection(this.fireStore, 'products');
      return collectionData(productColl, { idField: 'id' });
    });
  }

  getSingleProduct(id: string) {
    return runInInjectionContext(this.injector, () => {
      const prodDoc = doc(this.fireStore, `products/${id}`);
      return docData(prodDoc, { idField: 'id' });
    });
  }
}
