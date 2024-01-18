import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PostListComponent} from "./components/post-list/post-list.component";
import {postsResolver} from "./resolvers/posts.resolver";

const routes: Routes = [
  { path: '', component: PostListComponent, resolve: { posts: postsResolver }}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule { }
