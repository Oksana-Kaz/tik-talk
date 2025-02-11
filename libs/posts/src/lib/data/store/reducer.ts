import { Post } from '../interfaces/post.interface';
import { createFeature, createReducer, on } from '@ngrx/store';
import { postActions } from './actions';



export interface PostState {
  posts: Post[];
  comments:{[postId:number]: Comment[]};
}

export const initialState: PostState = {
  posts: [],
  comments: {},
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
    }),
    on(postActions.commentsLoaded, (state,{postId,comments}) => ({
      ...state,
        comments:{
        ...state.comments,
          postId: comments
      }
    }))
  )})
