import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BackEndService } from 'src/app/data/back-end.service';
import { PostService } from 'src/app/data/post.service';
import { Post } from 'src/app/post.model';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})

export class PostEditComponent {
  //identifiers
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    imgPath: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });
  index: number = 0;
  editMode = false;
  
  constructor(private postService:PostService, private route: Router, 
    private actRoute: ActivatedRoute, private backEndService: BackEndService,
    private authService: AuthService){}

    ngOnInit(): void {
      this.actRoute.params.subscribe((params: Params) => {
        if(params['index']){
          console.log(params['index']);
          this.index = params['index'];
          
          const post = this.postService.getSpecPost(this.index);
          
          if (post) {
            this.editMode = true;
    
            this.form.setValue({
              title: post.title,
              imgPath: post.imgPath,
              description: post.description
            });
          }
        }
      });
    }

  //submit function  
  async onsubmit(){
    const title = this.form.value.title ?? '';
    const imgPath = this.form.value.imgPath ?? '';
    const description = this.form.value.description ?? '';
    const ownerId = (await this.authService.getUserId()) || 'defaultOwnerId';
    const userEmail = (await this.authService.getUserEmail()) || 'default@email.com';
  
    let post: Post;
    if (this.editMode) {
      post = this.postService.getSpecPost(this.index);
      post.title = title;
      post.imgPath = imgPath;
      post.description = description;
    } else {
      post = new Post(title, imgPath, description, new Date(), 0, 0, ownerId, userEmail);
    }
  
    if(this.editMode) {
      this.postService.updatePost(this.index, post);
      this.backEndService.updateData(post.postId, post);
    } else {
      this.postService.addPost(post);
      this.backEndService.saveData(post);
    }
  
    this.route.navigate(['post-list']);
  }
}
