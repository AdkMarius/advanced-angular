import {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from "@angular/router";
import {Post} from "../../shared/models/post.model";
import {Observable} from "rxjs";
import {inject} from "@angular/core";
import {PostsService} from "../../shared/services/posts.service";

export const postsResolver: ResolveFn<Post[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) : Observable<Post[]> => {
  const postsService = inject(PostsService);

  return postsService.getPosts();
}
