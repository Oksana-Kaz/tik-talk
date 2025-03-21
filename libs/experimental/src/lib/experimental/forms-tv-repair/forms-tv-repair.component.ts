import { AfterViewInit, Component, ElementRef, inject, Renderer2 } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Feature, MockService } from '../experimental/mock.service';
import { KeyValuePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { group } from '@angular/animations';
import { validateDateRange } from '../forms-experiment/date-range.validator';
import { fromEvent, throttleTime } from 'rxjs';
import { AddressInputComponent } from '@tt/common-ui';

interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
  });
}

@Component({
  selector: 'app-forms-tv-repair',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, AddressInputComponent],
  templateUrl: './forms-tv-repair.component.html',
  styleUrl: './forms-tv-repair.component.scss',
})
export class FormsTVRepairComponent implements AfterViewInit {
  features: Feature[] = [];
  types: { key: string; value: string }[] = [];

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  mockService = inject(MockService);

  form = new FormGroup({
    type: new FormRecord({}),
    name: new FormControl<string>('', Validators.required),
    cause: new FormControl<string>(''),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' })
    ),
    warranty: new FormControl<string>('ЗНАЧЕНИЕ'),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
  });
  constructor() {
    this.mockService
      .getType()
      .pipe(takeUntilDestroyed())
      .subscribe((types) => {
        this.types = types;
      });

    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addrs) => {
        // while(this.form.controls.addresses.controls.length > 0) {
        //   this.form.controls.addresses.removeAt(0)
        // }

        this.form.controls.addresses.clear();

        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr));
        }

        // this.form.controls.addresses.setControl(1, getAddressForm())
        // console.log(this.form.controls.addresses.at(0))
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value)
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
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, { emitEvent: false });
  }

  sort = () => 0;

  ngAfterViewInit() {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(throttleTime(1000))
      .subscribe(() => {
        this.resizeFeed();
      });
  }
  resizeFeed() {
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();
    const height = window.innerHeight - top - 4 - 4;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}
