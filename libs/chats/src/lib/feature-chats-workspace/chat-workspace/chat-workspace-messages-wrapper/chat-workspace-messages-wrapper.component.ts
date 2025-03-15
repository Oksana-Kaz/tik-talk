import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input, OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { firstValueFrom, Subject, takeUntil, timer } from 'rxjs';
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
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent  {

  @ViewChild('messagesContainer') messagesContainer!: ElementRef ;

  chatsService = inject(ChatsService);
  hostElement = inject(ElementRef);
  chat = input.required<Chat>();
  private destroy$: Subject<void> = new Subject<void>();
  r2 = inject(Renderer2);
  messages = this.chatsService.activeChatMessages;


  constructor() {
    this.startMessagePolling();
  }
  private startMessagePolling() {
    timer(0, 1000000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async () => {
        await firstValueFrom(this.chatsService.getChatById(this.chat().id))
      })

  }
  async onSendMessage(messageText: string) {
    this.chatsService.wsAdapter.sendMessage(messageText, this.chat().id);
    this.scrollToBottom();

    // await firstValueFrom(
    //   this.chatsService.sendMessage(this.chat().id, messageText)
    // );

    await firstValueFrom(this.chatsService.getChatById(this.chat().id));

    this.scrollToBottom();
  }


  private scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop
        = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
  // @HostListener('window:resize')
  //   onWindowResize() {
  //   this.resizeFeed();
  // }
  //
  // ngAfterViewInit() {
  //   resizeFeed();
  // }

}
