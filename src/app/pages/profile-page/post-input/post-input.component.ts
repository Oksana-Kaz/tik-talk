import {Component, EventEmitter, HostBinding, inject, input, Output, Renderer2} from '@angular/core';
import {ProfileService} from "../../../data/services/profile.service";
import {AvatarCircleComponent} from "../../../common-ui/avatar-circle/avatar-circle.component";
import {NgIf} from "@angular/common";
import {SvgIconComponent} from "../../../common-ui/svg-icon/svg-icon.component";
import {PostService} from "../../../data/services/post.service";
import {FormsModule} from "@angular/forms";
import {firstValueFrom} from "rxjs";

@Component({
  selector: 'app-post-input',
  standalone: true,
  imports: [
    AvatarCircleComponent,
    NgIf,
    SvgIconComponent,
    FormsModule
  ],
  templateUrl: './post-input.component.html',
  styleUrl: './post-input.component.scss'
})
export class PostInputComponent {
  r2= inject(Renderer2)
  postService = inject(PostService);

  isCommentInput = input(false)
  postId = input<number>(0)
  profile = inject(ProfileService).me;

  @HostBinding('class.comment')
  get isComment() {
    return this.isCommentInput()
  }

  postText = ''
   // @Input() isCommentInput: boolean = false;

  @Output() created = new EventEmitter()

  onTextAreaInput(event:Event) {
  const textArea = event.target as HTMLTextAreaElement

    this.r2.setStyle(textArea, 'height', 'auto');
    this.r2.setStyle(textArea, 'height', textArea.scrollHeight + 'px');
  }

  onCreatePost() {
    if (!this.postText) return

    if(this.isCommentInput()) {
      firstValueFrom(this.postService.createComment({
        text: this.postText,
        authorId: this.profile()!.id,
        postId: this.postId()
      }))
        .then(() => {
          this.postText = ''
          this.created.emit()
        })
      return;
    }

    firstValueFrom(this.postService.createPost({
      title:'cool post',
      content: this.postText,
      authorId: this.profile()!.id
    }))
      .then(() => {
        this.postText = ''
      })
  }
}
