import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Post} from "../../../shared/models/post.model";

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit{

  @Input() post!: Post;
  @Output() addNewComment = new EventEmitter<{ comment: string, postId: number}>();

  // tempUser = { firstName: "Micke", lastName: "Gbaguidi"};

  ngOnInit(): void {
  }

  onAddNewComment(comment: string) {
    this.addNewComment.emit({ comment, postId: this.post.id });
  }
}
