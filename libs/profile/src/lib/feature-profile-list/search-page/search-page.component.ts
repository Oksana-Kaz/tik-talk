import { Component, inject } from '@angular/core';
import {ProfileCardComponent} from "../../ui";
import {  selectFilteredProfiles } from '../../data';
import { Store } from '@ngrx/store';
import { ProfileFiltersComponent } from '@tt/profile';


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
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
}
