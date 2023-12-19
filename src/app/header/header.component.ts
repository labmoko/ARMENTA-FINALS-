
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  /*originalPosts: Post[] = [];*/
  currentUserEmail: string | null = null;

  constructor(private authService: AuthService, public afAuth: AngularFireAuth, public router: Router) { }

  async ngOnInit(): Promise<void> {
    this.currentUserEmail = await this.authService.getUserEmail();
  }

  isLoggedIn(): boolean {
    return this.authService.userLoggedIn.getValue();
  }

  async logout(): Promise<void> {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      try { 
        await this.afAuth.signOut();
        this.authService.userLoggedIn.next(false); 
        console.log('Logged out successfully');
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error during sign out:', error);
      }
    } else {
      this.router.navigate(['/post-list']);
    }
  }

}