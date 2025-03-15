import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'tt-input',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent),
    }
  ]
})
export class TtInputComponent implements ControlValueAccessor {

  type = input<'text' | 'password'>('text')
  placeholder = input<string>()

  disabled = signal<boolean>(false)

  onChange : any;
  onTouched : any;

  value: string | null = null

  registerOnChange(fn: any): void {
     this.onChange = fn
  }

  registerOnTouched(fn: any): void {
   this.onTouched = fn
  }

  writeValue(val: string | null): void {
    this.value = val
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled)
  }
  onModelChange(val: string | null ): void {
     this.onChange(val)
  }
}
