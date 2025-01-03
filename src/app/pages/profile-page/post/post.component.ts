import {Component, inject, input, OnInit, signal} from '@angular/core';
import {TimeBackEventPipe} from "../../../helpers/pipes/time-back-event.pipe";
import {DatePipe} from "@angular/common";
import {Post, PostComment} from "../../../data/interfaces/post.interface";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {PostInputComponent} from "../post-input/post-input.component";
import {CommentComponent} from "./comment/comment.component";
import {PostService} from "../../../data/services/post.service";
import {firstValueFrom} from "rxjs";


@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    TimeBackEventPipe,
    DatePipe,
    AvatarCircleComponent,
    SvgIconComponent,
    PostInputComponent,
    CommentComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss'
})
export class PostComponent implements OnInit {

  post = input<Post>()
  postService = inject(PostService);
  comments = signal<PostComment[]>([])

  async ngOnInit() {
    this.comments.set(this.post()!.comments)
  }

  constructor() {
  }
  // getRelativeTime(dateString: string): string {
  //   if (!dateString) return 'N/A'; // Handle cases where the date is missing
  //   const dateTime = DateTime.fromISO(dateString, { zone: 'utc' });
  //   return dateTime.isValid ? dateTime.toRelative() || 'N/A' : 'Invalid date';
  // }
  async onCreated() {
    const comments = await firstValueFrom(
                      this.postService
                      .getCommentsByPostId(
                        this.post()!.id))
    this.comments.set(comments)
  }
}
