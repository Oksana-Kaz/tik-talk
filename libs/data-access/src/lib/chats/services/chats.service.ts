import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../utils/type-guard';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';
import { GlobalStoreService } from '@tt/shared';
import { AuthService } from '../../auth/services/auth.service';


@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  #authService = inject(AuthService);
  me = inject(GlobalStoreService).me;
  unreadMessagesCount = signal<number>(0);

  wsAdapter: ChatWsService = new ChatWsRxjsService();
   // wsAdapter: ChatWsService = new ChatWsNativeService();

  activeChatMessages = signal<{ [key: string]: Message[] }>({});

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  //this for native service
  // connectWs() {
  //   this.wsAdapter.connect({
  //     url: `${this.baseApiUrl}chat/ws`,
  //     token: this.#authService.token ?? '',
  //     handleMessage: this.handleWSMessage,
  //     })
  // }

  // for RxJS service

 connectWs() {
    return this.wsAdapter.connect({
      url: `${this.baseApiUrl}chat/ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage,
      }) as Observable<ChatWSMessage>
  }

  // TODO Замыкания
  handleWSMessage = (message: ChatWSMessage) => {
    if(!('action' in message)) return

    if(isUnreadMessage(message)) {
      this.unreadMessagesCount.set(message.data.count);
      // console.log('count unread messages is = ' + this.unreadMessagesCount().valueOf())
    }

    if (isNewMessage(message))  {

       const newMsg:Message =
          {
            id: message.data.id,
            userFromId: message.data.author,
            personalChatId: message.data.chat_id,
            text: message.data.message,
            createdAt: message.data.created_at,
            isRead: false,
            isMine: false,
          }
      const currentGroups = this.activeChatMessages();
       const dateKey = DateTime.fromISO(newMsg.createdAt).toFormat('MM/dd/yyyy');
      // Get the current messages for that date or start a new array if none exist
      const updateMessagesForDate = currentGroups[dateKey] ?
        [...currentGroups[dateKey], newMsg] : [newMsg];
      // Update the groups object with the new message for that date
      this.activeChatMessages.set({
        ...currentGroups,
        [dateKey]: updateMessagesForDate,
      });
    }
  }


  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }
  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }
  groupMessagesByDays(messages: Message[]) {
    return messages.reduce((accum, message) => {
      const dateMessage = DateTime.fromISO(message.createdAt).toFormat(
        'dd/MM/yyyy'
      ); // Format the date

      // Initialize the array if it doesn't exist for this date
      if (!accum[dateMessage]) {
        accum[dateMessage] = [];
      }

      // Add the message to the corresponding date group
      accum[dateMessage].push(message);

      return accum;
    }, {} as { [key: string]: Message[] });
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        const groupMessages = this.groupMessagesByDays(patchedMessages);
        this.activeChatMessages.set(groupMessages);

        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    );
  }
}
