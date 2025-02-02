import { Component, inject } from '@angular/core';
import {Profile} from "@tt/interfaces/profile";
import {ProfileCardComponent} from "../../ui";
import { ProfileFiltersComponent } from '../profile-filters/profile-filters.component'
import { ProfileService } from '../../data'


@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  profileService = inject(ProfileService);
  profiles: Profile[] = [];

  constructor() {
    this.profileService
      .getTestAccount()
      .subscribe((value) => (this.profiles = value));
  }
}
