import { Component, inject } from '@angular/core';
import {ProfileCardComponent} from "../../ui";
import { profileActions, selectFilteredProfiles } from '../../data';
import { Store } from '@ngrx/store';
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component';
import { last } from 'rxjs';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';
import { WaIntersectionObservee, WaIntersectionObserverDirective } from '@ng-web-apis/intersection-observer';


@Component({
  selector: 'tt-search-page',
  standalone: true,
  imports: [
    ProfileCardComponent,
    ProfileFiltersComponent,
    InfiniteScrollTriggerComponent,
    WaIntersectionObserverDirective,
    WaIntersectionObservee,
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  // profileService = inject(ProfileService); //don't need, because use store
  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);

  // constructor() {
  //   this.profileService
  //     .getTestAccount()
  //     .subscribe((value) => (this.profiles = value));
  // }
  protected readonly last = last;

  timeToFetch() {
    this.store.dispatch(profileActions.setPage({}));
  }
  onIntersaction(entries: IntersectionObserverEntry[]) {

    if (!entries.length)  return;
    if (entries[0].intersectionRatio > 0) {
        this.timeToFetch();
    }
  }
}
