import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BackEndService } from 'src/app/data/back-end.service';
import { PostService } from 'src/app/data/post.service';
import { Post } from 'src/app/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit{
  @Input() index: number = 0;
  @Input() post?: Post;
    commentText: any;
    currentUser: string | null = null;
    showPopup = false;
    
    constructor(private postService: PostService, private router: Router, 
      private backEndService: BackEndService, private authService: AuthService){
  
    }
   
    async ngOnInit(): Promise<void>{
      console.log('PostComponent post:', this.post);
      this.currentUser = await this.authService.getUserEmail();
    }

     delete() {
      if (this.post) {
      this.backEndService.deleteData(this.post.postId);
      }
     }
   

    onEdit(){
      this.router.navigate(['/post-edit', this.index]);
    }
    

    // user restrictions in other functions if not logged in
    addAComment(commentText: string){
      if(commentText.trim() !== '' && this.post){
          this.backEndService.addComment(this.post.postId, commentText);
          this.commentText = '';
      }
  }


      onClick() {
        if (this.post) {
            this.backEndService.likePost(this.post.postId);
        }
    }

    //for dislike 12/18
    onDislikeClick() {
      if (this.post) {
          this.backEndService.likePost(this.post.postId);
      }
  }
  
    
    togglePopup(): void {
      this.showPopup = !this.showPopup;
    }
  
  
  }
  