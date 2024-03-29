import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.email, Validators.minLength(6)],
      ],
      password: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authService
      .login(this.loginForm.value)
      .pipe(map((token) => this.router.navigate(['admin'])))
      .subscribe();
  }
}
