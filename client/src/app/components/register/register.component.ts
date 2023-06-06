import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

class CustomValidators {
  static passwordContainsNumbers(
    control: AbstractControl,
  ): ValidationErrors | null {
    const regex = /\d/;

    if (control.value && !regex.test(control.value)) {
      return { passwordInvalid: true };
    }
    return null;
  }

  static passwordMatch(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if (password && passwordConfirm && password !== passwordConfirm) {
      return { passwordsDoNotMatch: true };
    }
    return null;
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: [null, [Validators.required]],
        username: [null, [Validators.required]],
        email: [
          null,
          [Validators.required, Validators.email, Validators.minLength(6)],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            CustomValidators.passwordContainsNumbers,
          ],
        ],
        passwordConfirm: [null, [Validators.required]],
      },
      {
        validators: CustomValidators.passwordMatch,
      },
    );
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    this.authService
      .register(this.registerForm.value)
      .pipe(map((user) => this.router.navigate(['login'])))
      .subscribe();
  }
}
