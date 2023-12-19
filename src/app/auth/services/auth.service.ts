import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    userId: string;  
    userLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // Observable boolean
    
    constructor(private router: Router, private afAuth: AngularFireAuth) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
        this.userLoggedIn.next(true);
        this.userId = user.uid;
    } else {
        this.userLoggedIn.next(false);
        this.userId = ''; // Initialize userId here
    }

    this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          this.userId = user.uid;
          return true;
        } else {
          this.userId = '';
          return false;
        }
      })
    ).subscribe(loggedIn => {
      this.userLoggedIn.next(loggedIn);
      // Save user's authentication state in local storage
      if (loggedIn) {
        localStorage.setItem('user', JSON.stringify({uid: this.userId}));
      } else {
        // Clear user's authentication state from local storage
        localStorage.removeItem('user');
      }
    });
}

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
            if (result.user) {
                this.userId = result.user.uid; // Set userId here
                console.log('UserId after login:', this.userId);
            }
            console.log('Auth Service: loginUser: success');
            return null; // return null when login is successful
        })
        .then(() => {
            this.router.navigate(['/home']);
        })
        .catch(error => {
            console.log('Auth Service: login error', error);
            return { isValid: false, message: error.message }; // return error object when there's an error
        });
  }
  
  signupUser(user: any): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then((result) => {
            if (result.user) {
                this.userId = result.user.uid; // Set userId here
                console.log('UserId after signup:', this.userId);
            }
            return result.user?.updateProfile({
                displayName: user.name
            });
        })
        .then(() => {
            console.log('Auth Service: signupUser: success');
            this.router.navigate(['/home']);
        });
  }
    // fetch users other credentials
    async getUserId(): Promise<string | null> {
        return this.userId;
    }


    async getUserEmail(): Promise<string | null> {
        const user = await this.afAuth.currentUser;
        return user ? user.email : null;
    }
  
}