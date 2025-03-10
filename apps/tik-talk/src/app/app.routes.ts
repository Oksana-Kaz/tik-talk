import { Routes } from '@angular/router';
import {canActivateAuth, LoginPageComponent} from "@tt/auth";
import {LayoutComponent} from "@tt/layout";
import {FormsTVRepairComponent} from "@tt/experimental";
import {ExperimentalPageComponent} from "@tt/experimental";
import {chatsRoutes} from "@tt/chats";
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { PostEffects, postFeature } from '@tt/posts';
import {
  ProfileEffects,
  profileFeature,
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent,
} from '@tt/profile';



// @ts-ignore
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]},
      { path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postFeature),
          provideEffects(PostEffects)
        ]},
      {
        path: 'settings',
        component: SettingsPageComponent
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'experimental', component: ExperimentalPageComponent },
  { path: 'tv-repair', component: FormsTVRepairComponent },
];
