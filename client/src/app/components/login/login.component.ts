import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../app/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}

  private email = 'alenaTwo@gmail.com';

  private password = 'Alena12345';

  ngOnInit(): void {}

  login() {
    this.authService
      .login(this.email, this.password)
      .subscribe((data) => console.log('Success', data));
  }
}
