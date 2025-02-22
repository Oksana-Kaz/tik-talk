import { AsyncPipe, JsonPipe, NgForOf } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { firstValueFrom, Subscription, timer } from 'rxjs';
import { SubscriberCardComponent } from './subscriber-card/subscriber-card.component';
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChatsService, isErrorMessage, ProfileService } from '@tt/data-access';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SvgIconComponent,
    NgForOf,
    SubscriberCardComponent,
    AsyncPipe,
    JsonPipe,
    RouterLink,
    ImgUrlPipe,
    RouterLinkActive,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent  implements OnInit {
  profileService = inject(ProfileService);
  chatService = inject(ChatsService);
  subcribers$ = this.profileService.getSubscribersShortList();
  destroyRef = inject(DestroyRef);

  wsSubscribe!: Subscription;

  me = this.profileService.me;

  menuItems = [
    {
      label: 'Моя страница',
      icon: 'home',
      link: 'profile/me',
    },
    {
      label: 'Чаты',
      icon: 'chats',
      link: 'chats',
    },
    {
      label: 'Поиск',
      icon: 'search',
      link: 'search',
    },
  ];

  async reconnect() {
    console.log('reconnecting ...');
   await firstValueFrom(this.profileService.getMe());
   await firstValueFrom(timer(2000));
   this.connectWs();
  }
   connectWs() {
    this.wsSubscribe?.unsubscribe();
    this.wsSubscribe = this.chatService
      .connectWs()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe(message => {
        if (isErrorMessage(message)) {
          console.log('error token');
          this.reconnect();
        }
        })
   }

  ngOnInit() {
    firstValueFrom(this.profileService.getMe());
    this.connectWs();
  }
}
