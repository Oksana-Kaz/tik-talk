import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { Feature, MockService } from '../experimental/mock.service';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL'
}

interface Address {
  city?: string
  street?: string
  building?: number
  apartment?: number
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null)
  });
}

@Component({
  selector: 'tt-forms-experiment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forms-experiment.component.html',
  styleUrl: './forms-experiment.component.scss'
})
export class FormsExperimentComponent {
  ReceiverType = ReceiverType;

  mockService = inject(MockService)
  features: Feature[] = []

  form = new FormGroup({
    type: new FormControl<ReceiverType>(ReceiverType.PERSON),
    name: new FormControl<string>('', Validators.required),
    inn: new FormControl<string>(''),
    lastName: new FormControl<string>('ЗНАЧЕНИЕ'),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({})
  });

  constructor() {
    this.mockService.getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe(addrs => {
        // while(this.form.controls.addresses.controls.length > 0) {
        //   this.form.controls.addresses.removeAt(0)
        // }

        this.form.controls.addresses.clear()

        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr))
        }

        // this.form.controls.addresses.setControl(1, getAddressForm())
        // console.log(this.form.controls.addresses.at(0))
      })

    this.mockService.getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe(features => {
        this.features = features

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
          )
        }
      })

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => {
        this.form.controls.inn.clearValidators();

        if (val === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators(
            [Validators.required, Validators.minLength(10), Validators.maxLength(10)]
          );
        }
      });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    console.log('this.form.value', this.form.value);
    console.log('getRawValue', this.form.getRawValue());
  }

  addAddress() {
    this.form.controls.addresses.insert(0, getAddressForm())
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, {emitEvent: false})
  }

  sort = () => 0
}
