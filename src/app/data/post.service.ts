import { EventEmitter, Injectable } from '@angular/core';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {

    constructor(private http: HttpClient, private authService: AuthService) {
        console.log('PostService AuthService:', authService);
      }
      
  listChangeEvent: EventEmitter<Post[]> = new EventEmitter();
    listofPosts: Post[]=[
        // new Post("Tech Crunch", "https://www.allthingsdogs.com/wp-content/uploads/2019/10/Long-Haired-Dachshund-What-To-Know-About-This-Stunning-Dachshund-Cover.jpg",
        // "California is the world’s breadbasket, which means we collect, transport and store as much water as possible. About 12% of the energy produced in the state is used to pump water."
        // , "Cidddd", new Date(), 6)
    ];

    getPost(){
        return this.listofPosts;
    }

    deleteButton(postId: string){
        const index = this.listofPosts.findIndex(post => post.postId === postId);
        if (index > -1) {
            this.listofPosts.splice(index, 1);
        }
    }

    addPost(post: Post){
        console.log('AuthService userId:', this.authService.userId);
        post.ownerId = this.authService.userId; 
        this.listofPosts.push(post);
        this.listChangeEvent.emit(this.listofPosts);
      }

    updatePost(index: number, post: Post ){
        this.listofPosts[index] = post;
        this.listChangeEvent.emit(this.listofPosts);
      }

      getSpecPost(index: number){
        console.log('getSpecPost index:', index, 'post:', this.listofPosts[index]);
        return this.listofPosts[index];
      }
    
    // commenting stuff
    addComment(index: number, comment: string, userEmail: string) {
        if (!this.listofPosts[index].comments) {
            this.listofPosts[index].comments = [];
        }
        this.listofPosts[index].comments.push({ text: comment, userEmail: userEmail });
    }

    setPosts(listsOfPosts:Post[]){
        this.listofPosts = listsOfPosts;
        console.log('PostService listofPosts:', this.listofPosts);
        this.listChangeEvent.emit(this.listofPosts);   
    }
    
}
