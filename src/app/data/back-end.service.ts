import { Injectable, NgZone } from '@angular/core';
import { PostService } from './post.service';
import { Post } from '../post.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class BackEndService {

  constructor(private postService: PostService, private http: HttpClient, private afAuth: AngularFireAuth,
              private authService: AuthService, private ngZone: NgZone) { }

  // saving data from creating post
  saveData(post: Post) {
    this.http.post<{ name: string }>('https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json', post)
      .subscribe((res) => {
        console.log(res);
        post.postId = res.name;
        this.postService.addPost(post);
      });
  }

  // fetching data from firebase for viewing in home
  /*fetchData() {
    return this.http.get<Record<string, Post>>('https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            let newPost = new Post(responseData[key].title, responseData[key].imgPath, responseData[key].description, responseData[key].dateCreated, responseData[key].numberOfLikes, responseData[key].ownerId, responseData[key].userEmail);
            newPost.postId = key;
            newPost.comments = responseData[key].comments;
            postsArray.push(newPost);
          }
        }
        return postsArray;
      }),
        tap((listsOfPosts: Post[]) => {
          this.postService.setPosts(listsOfPosts);
        })
      );
  }*/
  fetchData() {
    return this.http.get<Record<string, Post>>('https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json')
      .pipe(map(responseData => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            let newPost = new Post(
              responseData[key].title, 
              responseData[key].imgPath, 
              responseData[key].description, 
              responseData[key].dateCreated, 
              responseData[key].numberOfLikes, 
              responseData[key].numberOfDislikes, 
              responseData[key].ownerId, 
              responseData[key].userEmail,
              
            );
            newPost.postId = key;
            newPost.comments = responseData[key].comments;
            postsArray.push(newPost);
          }
        }
        return postsArray;
      }),
        tap((listsOfPosts: Post[]) => {
          this.postService.setPosts(listsOfPosts);
        })
      );
  }

  // updating the data
  updateData(postId: string, updatedPost: Post) {
    this.http.put(`https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`, updatedPost)
      .subscribe(response => {
        console.log(response);
        const index = this.postService.listofPosts.findIndex(post => post.postId === postId);
        if (index !== -1) {
          this.postService.listofPosts[index] = updatedPost;
        }
        this.fetchData().subscribe((posts) => {
          this.postService.setPosts(posts);
        });
      });
  }

  // deleting data from firebase
  deleteData(postId: string) {
    if (window.confirm('Are you sure you want to delete this post?')) {
      this.postService.deleteButton(postId);
      this.http.delete(`https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`)
        .subscribe(response => {
          console.log(response);
          this.fetchData().subscribe((posts) => {
            this.postService.setPosts(posts);
          });
        });
    }
  }

  // comment push to firebase
  async addComment(postId: string, commentText: string) {
    const userEmail = await this.authService.getUserEmail();
    if (userEmail) {
      const comment = { text: commentText, userEmail: userEmail };
      const post = this.postService.listofPosts.find(post => post.postId === postId);
      if (post && !post.comments) {
        post.comments = [];
      }
      if (post) {
        post.comments.push(comment);
        this.http.put(`https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`, post)
          .subscribe(response => {
            console.log(response);
          });
      }
    }
  }

  // like function for liking a post
  async likePost(postId: string) {
    console.log('likePost method called with postId:', postId);

    const userEmail = await this.authService.getUserEmail();

    if (!userEmail) {
      return;
    }
    this.http.get<Post>(`https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`)
      .subscribe(post => {
        if (post) {
          if (!post.likes) {
            post.likes = [];
          }
          if (post.likes.includes(userEmail)) {
            const index = post.likes.indexOf(userEmail);
            if (index > -1) {
              post.likes.splice(index, 1);
            }
          } else {
            post.likes.push(userEmail);
          }
          post.numberOfLikes = post.likes.length;
          this.http.patch(`https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`, { likes: post.likes, numberOfLikes: post.numberOfLikes })

            .subscribe(response => {
              console.log(response);
              const localPostIndex = this.postService.listofPosts.findIndex(localPost => localPost.postId === postId);
              if (localPostIndex !== -1) {
                this.postService.listofPosts[localPostIndex].likes = post.likes;
                this.postService.listofPosts[localPostIndex].numberOfLikes = post.numberOfLikes;
              }
            });
        }
      });
  }

  //dislike 
  // dislike function for disliking a post
  async dislikePost(postId: string) {
    console.log('dislikePost method called with postId:', postId);
  
    const userEmail = await this.authService.getUserEmail();
  
    if (!userEmail) {
      return;
    }
    this.http.get<Post>(`https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`)
      .subscribe(post => {
        if (post) {
          if (!post.dislikes) {
            post.dislikes = [];
          }
          if (post.dislikes.includes(userEmail)) {
            const index = post.dislikes.indexOf(userEmail);
            if (index > -1) {
              post.dislikes.splice(index, 1);
            }
          } else {
            post.dislikes.push(userEmail);
          }
          post.numberOfDislikes = post.dislikes.length;
          this.http.patch(`https://cc105-18ef8-default-rtdb.asia-southeast1.firebasedatabase.app/posts/${postId}.json`, { dislikes: post.dislikes, numberOfDislikes: post.numberOfDislikes })
  
            .subscribe(response => {
              console.log(response);
              const localPostIndex = this.postService.listofPosts.findIndex(localPost => localPost.postId === postId);
              if (localPostIndex !== -1) {
                this.postService.listofPosts[localPostIndex].dislikes = post.dislikes;
                this.postService.listofPosts[localPostIndex].numberOfDislikes = post.numberOfDislikes;
              }
            });
        }
      });
  }
}
