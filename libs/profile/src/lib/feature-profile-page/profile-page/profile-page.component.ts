import { Component, inject, signal } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AsyncPipe, NgForOf } from '@angular/common';
import {ImgUrlPipe, SvgIconComponent} from "@tt/common-ui";
import {ProfileService} from './../../data'
import {toObservable} from "@angular/core/rxjs-interop";
import {ProfileHeaderComponent} from "../../ui";
import {PostFeedComponent} from "@tt/posts";
import {ChatsService} from "@tt/chats";
import {switchMap} from "rxjs";

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    ProfileHeaderComponent,
    AsyncPipe,
    RouterLink,
    ImgUrlPipe,
    SvgIconComponent,
    NgForOf,
    RouterLinkActive,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent {
  profileService = inject(ProfileService);
  route = inject(ActivatedRoute);
  chatsService = inject(ChatsService);
  router = inject(Router);

  isMyPage = signal<boolean>(false);
  me$ = toObservable(this.profileService.me);
  subcribers$ = this.profileService.getSubscribersShortList(5);

  profile$ = this.route.params.pipe(
    switchMap(({ id }) => {
      this.isMyPage.set(id === 'me' || id === this.profileService.me()?.id);
      if (id === 'me') return this.me$;

      return this.profileService.getAccount(id);
    })
  );

  async sendMessage(userId: number) {
      this.router.navigate(['/chats', 'new'], {queryParams: {userId: userId}});
  }
}
