import { Routes } from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {SearchPageComponent} from "./pages/search-page/search-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {LayoutComponent} from "./common-ui/layout/layout.component";
import {canActivateAuth} from "./auth/access.guard";
import {SettingsPageComponent} from "./pages/settings-page/settings-page.component";
import {chatsRoutes} from "./pages/chats-page/chatsRoutes";
import {FormsExperimentComponent} from "./pages/experimental-page/forms-experiment/forms-experiment.component";
import {ExperimentalPageComponent} from "./pages/experimental-page/experimental-page.component";
import {SchedulePageComponent} from "./pages/schedule-page/schedule-page.component";
import {FormsTVRepairComponent} from "./pages/experimental-page/forms-tv-repair/forms-tv-repair.component";

export const routes: Routes = [
  {path: '', component: LayoutComponent, children: [
      {path: '', redirectTo: 'profile/me', pathMatch: 'full'},
      {path: 'search', component: SearchPageComponent},
      {path: 'profile/:id', component: ProfilePageComponent},
      {path: 'settings', component: SettingsPageComponent},
      {
        path: 'chats',
        loadChildren: () => chatsRoutes
      }
    ],
  canActivate:[canActivateAuth]
  },
  {path: 'login', component: LoginPageComponent},
  {path: 'experimental', component: ExperimentalPageComponent},
  {path: 'schedule', component: SchedulePageComponent},
  {path: 'tv-repair', component: FormsTVRepairComponent},


];
