import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, startWith, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { profileActions } from '../../data';


@Component({
  selector: 'tt-profile-filters',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
})
export class ProfileFiltersComponent  implements OnDestroy {
  fb = inject(FormBuilder);
  // profileService = inject(ProfileService);
  store = inject(Store);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });
  searchFormSub!: Subscription;
  constructor() {
    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        startWith({}),
        debounceTime(300),
      )
      .subscribe(formValue => {
         this.store.dispatch(profileActions.filterEvents({filters: formValue}))
      });
  }
  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
