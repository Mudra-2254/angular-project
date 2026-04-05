import { Injectable, inject, Injector, runInInjectionContext } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private injector = inject(Injector);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    user(this.auth).subscribe((user) => {
      this.currentUserSubject.next(user);
    });
  }

  get isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Register
  register(email: string, password: string) {
    console.log('AuthService: register called for', email);
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Login
  login(email: string, password: string) {
    console.log('AuthService: login called for', email);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Save new user to Firestore (Registration)
  saveUser(user: User) {
    console.log('AuthService: saveUser called for', user.uid);
    return runInInjectionContext(this.injector, () => {
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      return setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        role: 'user',
        createdAt: new Date().toISOString()
      });
    });
  }

  // Sync user to Firestore (Login) - Backfills existing users
  syncUser(user: User) {
    console.log('AuthService: syncUser called for', user.uid);
    return runInInjectionContext(this.injector, () => {
      const userDoc = doc(this.firestore, `users/${user.uid}`);
      return setDoc(userDoc, {
        uid: user.uid,
        email: user.email,
        role: 'user',
        lastLogin: new Date().toISOString()
      }, { merge: true });
    });
  }
}
