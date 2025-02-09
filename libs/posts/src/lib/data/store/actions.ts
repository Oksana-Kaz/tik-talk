import { createActionGroup, props } from '@ngrx/store';

import { Post, PostComment, PostCreateDto } from '../interfaces/post.interface';

export const postActions = createActionGroup({
  source: 'post',
  events: {
    'fetch posts': props<{page?:number}>(),
    'post created': props<{payload: PostCreateDto }>(),
    'posts loaded': props<{posts: Post[]}>(),
    'comment created': props<{comment: PostComment}>(),
    'comments loaded': props<{postId: number; comments: PostComment[]}>(),
  }
})
