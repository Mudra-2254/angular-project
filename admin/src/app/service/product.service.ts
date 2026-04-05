import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productCollection;
  constructor(private fireStore: Firestore) {
    this.productCollection = collection(this.fireStore, 'products');
  }

  addProduct(data: any) {
    return addDoc(this.productCollection, data);
  }

  getProducts() {
    return collectionData(this.productCollection, { idField: 'id' });
  }

  delProducts(id: string) {
    const docRef = doc(this.fireStore, `products/${id}`);
    return deleteDoc(docRef);
  }

  updateProduct(id: string, data: any) {
    const productDoc = doc(this.fireStore, `products/${id}`);

    return updateDoc(productDoc, data);
  }
}
