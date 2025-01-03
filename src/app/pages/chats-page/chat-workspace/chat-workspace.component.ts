import {AsyncPipe} from '@angular/common';
import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {switchMap, tap} from 'rxjs';
import {MessageInputComponent} from '../../../common-ui/message-input/message-input.component';
import {Profile} from '../../../data/interfaces/profile.interface';
import {ChatsService} from '../../../data/services/chats.service';
import {ProfileService} from '../../../data/services/profile.service';
import {ChatWorkspaceHeaderComponent} from './chat-workspace-header/chat-workspace-header.component';
import {
  ChatWorkspaceMessagesWrapperComponent
} from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    MessageInputComponent,
    AsyncPipe
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent {
  route = inject(ActivatedRoute)
  chatsService = inject(ChatsService)
  me = inject(ProfileService)

  activeChat$ = this.route.params
    .pipe(
      switchMap(({id}) => this.chatsService.getChatById(id))
    )

}
