import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentComponent } from './components/comment/comment.component';
import {MaterialModule} from "./material.module";
import {ReactiveFormsModule} from "@angular/forms";
import {ShortenPipe} from "./pipes/shorten.pipe";
import {UserNamePipe} from "./pipes/user-name.pipe";
import {TimeAgoPipe} from "./pipes/time-ago.pipe";
import {HighlightDirective} from "./directives/highlight.directive";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [
    CommentComponent,
    ShortenPipe,
    UserNamePipe,
    TimeAgoPipe,
    HighlightDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  exports: [
    MaterialModule,
    CommentComponent,
    ReactiveFormsModule,
    HttpClientModule,
    ShortenPipe,
    UserNamePipe,
    TimeAgoPipe,
    HighlightDirective
  ]
})
export class SharedModule { }
