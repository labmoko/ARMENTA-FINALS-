import { Component, OnInit, NgZone } from '@angular/core';
import { BackEndService } from 'src/app/data/back-end.service';
import { PostService } from 'src/app/data/post.service';
import { Post } from 'src/app/post.model';


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit{
  listofPosts: Post[] = [];
  originalPosts: Post[] = [];

  /**for username ng lalog in */
  currentUserEmail: string | null = null;

  constructor(private backEndService: BackEndService, private postService: PostService, private ngZone: NgZone ) {}

  ngOnInit() {
    this.originalPosts = this.postService.getPost();
    this.listofPosts = [...this.originalPosts];

    this.backEndService.fetchData().subscribe((posts) => {  
      
        this.originalPosts = posts;
        this.listofPosts = [...this.originalPosts];

      });
      //for usernameemail
      {
        this.currentUserEmail = firebase.auth().currentUser?.email?? null;
        // rest of your code
      }
    
  }

  filterPosts(searchTerm: string): void {
    if (searchTerm) {
      this.listofPosts = this.originalPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      this.listofPosts = [...this.originalPosts];
    }
  }
  
}


