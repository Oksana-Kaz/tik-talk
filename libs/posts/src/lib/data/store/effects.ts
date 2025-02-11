import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PostService } from '../services/post.service';
import { postActions } from './actions';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostEffects {

  actions$ = inject(Actions);
  postService = inject(PostService);

  loadPosts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.fetchPosts),
      switchMap(() => this.postService.fetchPosts().pipe(
        map(posts => postActions.postsLoaded({posts}))
      ))
    )
  })
  postCreated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.postCreated),
      switchMap(({payload}) =>
       this.postService
         .createPost({
           title: payload.title,
           content: payload.content,
           authorId: payload.authorId
         })
          .pipe(
            map(() => postActions.fetchPosts({}))
          )
      )
    )
  })
  commentCreated$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(postActions.commentCreated),
      switchMap(({payload}) =>
      this.postService.createComment({
        authorId:payload.authorId,
        postId:payload.postId,
        text:payload.text
      }).pipe(
        map(() => postActions.fetchPosts({}))
      ))
    )
  })
}
