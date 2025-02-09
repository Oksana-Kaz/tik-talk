import { Post } from '../interfaces/post.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';


export interface PostState {
  posts: Post[];
}

export const initialState: PostState = {
  posts: [],
}

export const postFeature = createFeature({
  name: 'postFeature',
  reducer: createReducer(
    initialState,
    on(postActions.postsLoaded,(state, {posts}) => {
      return {
        ...state,
      posts
      }
    })
  )
})
