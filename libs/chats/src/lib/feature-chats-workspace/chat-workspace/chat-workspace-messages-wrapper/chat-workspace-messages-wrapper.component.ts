import { Component, inject, input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { DatePipe, KeyValuePipe } from '@angular/common';
import { Chat, ChatsService } from '@tt/data-access';
import { MessageInputComponent } from '../../../ui/message-input/message-input.component';


@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  standalone: true,
  imports: [
    ChatWorkspaceMessageComponent,
    DatePipe,
    KeyValuePipe,
    MessageInputComponent,
  ],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent {
  chatsService = inject(ChatsService);

  chat = input.required<Chat>();

  messages = this.chatsService.activeChatMessages;

  async onSendMessage(messageText: string) {
    console.log('messageText: ' + messageText);
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id);

    // await firstValueFrom(
    //   this.chatsService.sendMessage(this.chat().id, messageText)
    // );

     await firstValueFrom(
       this.chatsService.getChatById(this.chat().id));
  }
}
