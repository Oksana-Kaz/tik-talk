import { Component, inject, input, OnInit } from '@angular/core';

import { DatePipe } from '@angular/common';
import { Post, postActions} from '../../data';
import {CommentComponent, PostInputComponent} from "../../ui";
import {AvatarCircleComponent, SvgIconComponent} from "@tt/common-ui";
import {GlobalStoreService} from "@tt/shared";
import { Store } from '@ngrx/store';
import { TimeBackEventPipe } from '../../../../../common-ui/src/lib/pipes/time-back-event.pipe';



@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    TimeBackEventPipe,
    DatePipe,
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  post = input<Post>();
  // postService = inject(PostService);
  // comments = signal<PostComment[]>([]);
  profile = inject(GlobalStoreService).me;
  store = inject(Store);
  // comments = this.store.selectSignal(selectCommentByPostId(this.post()!.id));
  // async ngOnInit() {
  //   this.comments.set(this.post()!.comments);
  // }
ngOnInit() {
  this.store.dispatch(postActions.fetchPosts({}))
}

  constructor() {}

  // getRelativeTime(dateString: string): string {
  //   if (!dateString) return 'N/A'; // Handle cases where the date is missing
  //   const dateTime = DateTime.fromISO(dateString, { zone: 'utc' });
  //   return dateTime.isValid ? dateTime.toRelative() || 'N/A' : 'Invalid date';
  // }
  // async onCreated(commentText: string) {
  //   firstValueFrom(
  //     this.postService.createComment({
  //       authorId: this.profile()!.id,
  //       postId: this.post()!.id,
  //       text: commentText,
  //     })
  //   )
  //     .then(async () => {
  //       const comments = await firstValueFrom(
  //         this.postService.getCommentsByPostId(this.post()!.id)
  //       );
  //       this.comments.set(comments);
  //     })
  //     .catch((error) => console.error('Error creating comment', error));
  //   return;
  // }
  onCreated(commentText: string) {
  const currentPost = this.post();
  if (!currentPost) {
    console.error("Post is not defined.");
    return;
  }
   this.store.dispatch(postActions.commentCreated({
    payload:{
      authorId: this.profile()?.id,
      postId: currentPost.id,
      text: commentText,
    }
   }))
  }
}
