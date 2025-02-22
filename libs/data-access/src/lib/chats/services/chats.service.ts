import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { DateTime } from 'luxon';
import { Chat, LastMessageRes, Message } from '../interfaces/chats.interface';
import { ChatWsService } from '../interfaces/chat-ws-service.interface';
import { ChatWSMessage } from '../interfaces/chat-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../utils/type-guard';
import { ChatWsRxjsService } from './chat-ws-rxjs.service';

import { AuthService } from '../../auth/services/auth.service';
import { GlobalStoreService } from '../../global/services/global-store.service';



@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  #authService = inject(AuthService);
  me = inject(GlobalStoreService).me;

  activeChatMessages = signal<[string, Message[]][]>([]);
  unreadMessagesCount = signal<number>(0);
  activeChat = signal<Chat | null >(null);
  wsAdapter: ChatWsService = new ChatWsRxjsService();
   // wsAdapter: ChatWsService = new ChatWsNativeService();

  baseApiUrl = 'https://icherniakov.ru/yt-course/';
  chatsUrl = `${this.baseApiUrl}chat/`;
  messageUrl = `${this.baseApiUrl}message/`;

  //this for native services
  // connectWs() {
  //   this.wsAdapter.connect({
  //     url: `${this.baseApiUrl}chat/ws`,
  //     token: this.#authService.token ?? '',
  //     handleMessage: this.handleWSMessage,
  //     })
  // }

  // for RxJS services

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
    console.log(message)
    if(isUnreadMessage(message)) {
      this.unreadMessagesCount.set(message.data.count);
      }

    if (isNewMessage(message))  {

      const me = this.me();
      const activeChat = this.activeChat();

      if(!me || !activeChat) return;

       const newMsg: Message = {
         id: message.data.id,
         userFromId: message.data.author,
         personalChatId: message.data.chat_id,
         text: message.data.message,
         createdAt: message.data.created_at.replace('_', 'T') + 'Z',
         isRead: false,
         isMine: message.data.author === me.id,
         user:
           activeChat.userFirst.id === message.data.author
             ? activeChat.userSecond
             : activeChat.userFirst,
       };
      const currentGroups = this.activeChatMessages();
      const dateMessage = DateTime.fromISO(message.data.created_at).toFormat('dd/MM/yyyy')
       const todayGroup = currentGroups.find(([date]) => date === dateMessage )

      if (todayGroup) {
        todayGroup[1].push(newMsg)
      } else {
        currentGroups.push([dateMessage, [newMsg]]);
      }
      this.activeChatMessages.set([...currentGroups])
    }
  }


  createChat(userId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {});
  }
  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }


  groupMessagesByDays(messages: Message[]) {
    return messages.reduce((acc, message) => {
      const dateMessage = DateTime.fromISO(message.createdAt).toFormat('yyyy/MM/dd');
      // Try to find an existing tuple for this date
      const group = acc.find(([date]) => date === dateMessage);
      if (group) {
        group[1].push(message);
      } else {
        acc.push([dateMessage, [message]]);
      }
      return acc;
    }, [] as [string, Message[]][]);
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {
        this.activeChat.set(chat)
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
