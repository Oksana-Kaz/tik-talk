import {Component, inject} from '@angular/core';
import {FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators} from "@angular/forms";
import {KeyValuePipe} from "@angular/common";
import {Feature, MockService} from "../experimental-page/experimental/mock.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL'
}
enum ReceiverShift {
  FIRST = '1-ST SHIFT',
  SECOND = '2-ND SHIFT',
  THIRD = '3-RD SHIFT',
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
  selector: 'app-schedule-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    KeyValuePipe
  ],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.scss'
})
export class SchedulePageComponent {
  ReceiverShift = ReceiverShift;
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
