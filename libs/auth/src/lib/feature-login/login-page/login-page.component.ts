import { Component, forwardRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup, NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@tt/data-access';
import { TtInputComponent } from '@tt/common-ui';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, TtInputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',


})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);

  isPasswordVisible = signal<boolean>(false);

  form = new FormGroup({
    username: new FormControl('USERNAME', Validators.required),
    password: new FormControl(null, Validators.required),
  });

  ngOnInit() {
    this.form.valueChanges.subscribe(val => {
      console.log(val);
    })
    // this.form.controls.username.disable()
  }
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
      // @ts-ignore
      this.authService.login(this.form.value).subscribe((res) => {
        this.router.navigate(['']);
        console.log(res);
      });
    }
  }
}
