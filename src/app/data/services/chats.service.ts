import {inject, Injectable, signal} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Chat, LastMessageRes, Message} from "../interfaces/chats.interface";
import { map} from "rxjs";
import {ProfileService} from "./profile.service";
import {DateTime} from "luxon";


@Injectable({
  providedIn: 'root'
})
export class ChatsService {
  http = inject(HttpClient)
  me = inject(ProfileService).me

  activeChatMessages= signal<{[key: string]: Message[] }>({});

  baseApiUrl = 'https://icherniakov.ru/yt-course/'
  chatsUrl = `${this.baseApiUrl}chat/`
  messageUrl = `${this.baseApiUrl}message/`


  createChat(userId: number) {
      return this.http.post<Chat>(`${this.chatsUrl}${userId}`, {})
  }
  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`)
  }
  groupMessagesByDays (messages:Message[]) {
    return messages.reduce((accum, message) => {
          const dateMessage = DateTime.fromISO(message.createdAt).toFormat('dd/MM/yyyy'); // Format the date

          // Initialize the array if it doesn't exist for this date
          if (!accum[dateMessage]) {
            accum[dateMessage] = [];
          }

          // Add the message to the corresponding date group
          accum[dateMessage].push(message);

          return accum;
        }, {} as { [key: string]: Message[] })
  }

  getChatById(chatId: number) {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`)
      .pipe(
        map(chat => {
          const patchedMessages = chat.messages.map(
            message => {

              return {
                ...message,
                user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
                isMine: message.userFromId === this.me()!.id
              }
            })

          const groupMessages = this.groupMessagesByDays(patchedMessages)
          this.activeChatMessages.set(groupMessages)

          return {
            ...chat,
            companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
            messages: patchedMessages
          }
        }))
  }

  sendMessage(chatId: number, message: string) {
    return this.http.post(`${this.messageUrl}send/${chatId}`,{}, {
      params: {
        message
      }
    })
  }

  }

