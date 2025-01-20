import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ProfileService} from "../../../data/services/profile.service";
import {debounceTime, Subscription, switchMap} from "rxjs";

@Component({
  selector: 'app-profile-filters',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent {

  fb=inject(FormBuilder);
  profileService = inject(ProfileService);

  searchForm =  this.fb.group({
    firstName: [''],
    lastName: [''],
    stack:['']
  });
  searchFormSub!: Subscription
  constructor() {
    this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        switchMap(formValue => {
          return this.profileService.filterProfiles(formValue);
        })
      )
      .subscribe()
  }
  ngOnDestroy() {
    this.searchFormSub.unsubscribe()
  }
}
