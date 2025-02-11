import { createSelector } from '@ngrx/store';
import { postFeature } from './reducer';

export const selectAllPosts = createSelector(
  postFeature.selectPosts,
  (posts ) => posts
)

export const selectCommentByPostId  = (postId: number)=>
  createSelector(
  postFeature.selectComments,
    (comments) => comments[ postId]
)
