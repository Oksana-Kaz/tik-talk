import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Renderer2,
} from '@angular/core';
import { firstValueFrom, fromEvent, throttleTime } from 'rxjs';
import { NgIf } from '@angular/common';
import {PostService} from "../../data";
import {PostInputComponent} from "../../ui";
import {AvatarCircleComponent} from "@tt/common-ui";
import {PostComponent} from "../post/post.component";
import {GlobalStoreService} from "@tt/shared";


@Component({
  selector: 'app-post-feed',
  standalone: true,

  imports: [PostInputComponent, PostComponent, AvatarCircleComponent, NgIf],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss',
})
export class PostFeedComponent implements AfterViewInit {
  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  feed = this.postService.posts;
  profile = inject(GlobalStoreService).me;

  // @HostListener('window:resize')
  // onWindowResize() {
  //   this.resizeFeed();
  // }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
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

  handlePostCreation(postText: string) {
    firstValueFrom(
      this.postService.createPost({
        title: 'cool post',
        content: postText,
        authorId: this.profile()!.id,
      })
    ).then(() => {
      console.log('Comment created');
    });
  }
}
