import {AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, Renderer2} from '@angular/core';
import {PostInputComponent} from "../post-input/post-input.component";
import {PostComponent} from "../post/post.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom, fromEvent, throttleTime} from "rxjs";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {NgIf} from "@angular/common";
import {ProfileService} from "../../../data/services/profile.service";



@Component({
  selector: 'app-post-feed',
  standalone: true,
  imports: [
    PostInputComponent,
    PostComponent,
    AvatarCircleComponent,
    NgIf
  ],
  templateUrl: './post-feed.component.html',
  styleUrl: './post-feed.component.scss'
})
export class PostFeedComponent implements  AfterViewInit {

  postService = inject(PostService);
  hostElement = inject(ElementRef);
  r2 = inject(Renderer2)

  feed = this.postService.posts;
  profile = inject(ProfileService).me;


  // @HostListener('window:resize')
  // onWindowResize() {
  //   this.resizeFeed();
  // }

  constructor() {
    firstValueFrom(this.postService.fetchPosts());
  }

  ngAfterViewInit() {
    this.resizeFeed()

     fromEvent(window, 'resize')
       .pipe(
       throttleTime(1000),
     )
       .subscribe(() => {
         this.resizeFeed()
       })
   }
  resizeFeed() {
    const {top} = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 24 - 24
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`)
  }

  handlePostCreation(postText: string) {
      firstValueFrom(this.postService.createPost({
          title:'cool post',
          content: postText,
          authorId: this.profile()!.id
        }))
          .then(() => {
            console.log('Comment created');
          })
    }
}
