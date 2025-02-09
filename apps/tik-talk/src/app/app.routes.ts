import { Routes } from '@angular/router';
import { ExperimentalPageComponent } from './pages/experimental-page/experimental-page.component';
import { SchedulePageComponent } from './pages/schedule-page/schedule-page.component';
import { FormsTVRepairComponent } from './pages/experimental-page/forms-tv-repair/forms-tv-repair.component';
import {canActivateAuth, LoginPageComponent} from "@tt/auth";
import {
  ProfileEffects,
  profileFeature,
  ProfilePageComponent,
  SearchPageComponent,
  SettingsPageComponent
} from '@tt/profile';
import {LayoutComponent} from "@tt/layout";
import {chatsRoutes} from "@tt/chats";
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { PostEffects, postFeature } from '@tt/posts';



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
  { path: 'schedule', component: SchedulePageComponent },
  { path: 'tv-repair', component: FormsTVRepairComponent },
];
