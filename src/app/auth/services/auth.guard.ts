import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private afAuth: AngularFireAuth) {

    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
        return new Promise((resolve, reject) => {
            this.afAuth.authState.pipe(take(1)).subscribe((user) => {
                if (user) {
                    resolve(true);
                } else {
                    console.log('Auth Guard: user is not logged in');
                    this.router.navigate(['/home']); // a logged out user will always be sent to home
                    resolve(false);
                }
            });
        });
    }
  
}