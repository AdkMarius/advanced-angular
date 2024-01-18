import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post.model";
import {environment} from "../../../environments/environment.development";
import {Comment} from "../../core/models/comment.model";

@Injectable()
export class PostsService {
  private http = inject(HttpClient);

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${environment.urlApi}/posts`);
  }

  addNewComment(newComment: { comment: string; postId: number }) {
    console.log(newComment);
  }
}
