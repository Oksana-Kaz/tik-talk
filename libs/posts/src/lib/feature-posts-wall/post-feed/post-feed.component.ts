import {
  AfterViewInit,
  Component,
  ElementRef,
  inject, OnInit,
  Renderer2
} from '@angular/core';
import { firstValueFrom, fromEvent, throttleTime } from 'rxjs';
import { NgIf } from '@angular/common';
import { postActions, PostService, selectAllPosts } from '../../data';
import {PostInputComponent} from "../../ui";
import {AvatarCircleComponent} from "@tt/common-ui";
import {PostComponent} from "../post/post.component";
import {GlobalStoreService} from "@tt/shared";
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-post-feed',
  standalone: true,

  imports: [PostInputComponent, PostComponent, AvatarCircleComponent, NgIf],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit, OnInit {
  // postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);
  store = inject(Store);

  feed = this.store.selectSignal(selectAllPosts);
  profile = inject(GlobalStoreService).me;

  // @HostListener('window:resize')
  // onWindowResize() {
  //   this.resizeFeed();
  // }

  // constructor() {
  //   firstValueFrom(this.postService.fetchPosts());
  // }

  ngOnInit() {
    this.store.dispatch(postActions.fetchPosts({}))
  }

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(throttleTime(1000))
      .subscribe(() => {
        this.resizeFeed();
      });
  }
  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }

 onCreatePost(postText: string) {
    this.store.dispatch(postActions.postCreated({
      payload: {
        title: 'cool post',
        content: postText,
        authorId: this.profile()!.id,
      }}))
    // firstValueFrom(
    //   this.postService.createPost({
    //     title: 'cool post',
    //     content: postText,
    //     authorId: this.profile()!.id,
    //   })
    // ).then(() => {
    //   console.log('Comment created');
    // });
  }
}
