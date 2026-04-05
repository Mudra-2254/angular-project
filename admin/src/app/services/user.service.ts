import { Injectable } from '@angular/core';
import {
    collection,
    collectionData,
    Firestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private usersCollection;

    constructor(private fireStore: Firestore) {
        this.usersCollection = collection(this.fireStore, 'users');
    }

    // Get all users
    getUsers(): Observable<any[]> {
        return collectionData(this.usersCollection, { idField: 'id' });
    }
}
