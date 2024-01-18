import {Component, inject, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {Post} from "../../../shared/models/post.model";
import {ActivatedRoute} from "@angular/router";
import {PostsService} from "../../../shared/services/posts.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts$!: Observable<Post[]>;

  private route = inject(ActivatedRoute);
  private postsServices = inject(PostsService);

  ngOnInit(): void {
    this.posts$ = this.route.data.pipe(
      map(data => data['posts'])
    );
  }

  onAddNewComment(newComment: { comment: string; postId: number }) {
    this.postsServices.addNewComment(newComment);
  }
}
