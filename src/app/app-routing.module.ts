import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth.guard';

// data components routes
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostListComponent } from './posts/post-list/post-list.component';

// authorization routes - home and dashboard
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [

    // authentication routes
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    // { path: '**', component: HomeComponent },
    // data routes
    { path: 'post-list', component: PostListComponent, canActivate: [AuthGuard] },
    { path: 'post-add', component: PostEditComponent, canActivate: [AuthGuard] },
    { path: 'post-edit/:index', component: PostEditComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
