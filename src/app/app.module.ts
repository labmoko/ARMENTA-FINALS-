import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PostComponent } from './posts/post/post.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClientModule } from '@angular/common/http';
/*import { SidebarComponent } from './sidebar/sidebar.component';*/
import { SearchComponent } from './search/search.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent, 
    PostEditComponent,
    PostListComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    /*SidebarComponent,*/
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp({"projectId":"crud-app-f0d6e","appId":"1:79004076686:web:52a867de0373f7645297df","databaseURL":"https://crud-app-f0d6e-default-rtdb.asia-southeast1.firebasedatabase.app","storageBucket":"crud-app-f0d6e.appspot.com","apiKey":"AIzaSyAwAe5p3s-PjAQS67IqeDqXxs_fc-wO39s","authDomain":"crud-app-f0d6e.firebaseapp.com","messagingSenderId":"79004076686"})),
    AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule, 
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
