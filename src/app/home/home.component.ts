import { Component } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { BackEndService } from '../data/back-end.service';
import { Post } from '../post.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {

  listofPosts: Post[] = [];

  constructor(public authService: AuthService, public backEndService: BackEndService) {}

  async ngOnInit() {
    const userEmail = await this.authService.getUserEmail();
    this.backEndService.fetchData().subscribe((posts) => { 
        this.listofPosts = posts.filter(post => post.userEmail === userEmail);
    });
}

}
