import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';
import { switchMap } from 'rxjs';
import { AuthenticationService } from '../../../app/services/authentication-service/authentication.service';
import { UserService } from '../../../app/services/user-service/user.service';
import { User } from '../../models/users.model';

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss'],
})
export class UpdateUserProfileComponent {
  form!: FormGroup;
  userId: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        username: ['', Validators.required],
        name: ['', Validators.required],
    });

    this.authService.getUserId().pipe(
        switchMap((id: string) => this.userService.findOne(id).pipe(
            tap((user: User) => {
                this.userId = user.id as string;
                this.form?.patchValue({
                    username: user.username,
                    name: user.name,
                })
            })
        ))
    ).subscribe();
  }

  updateProfile(): void {
    if (this.form?.valid) {
        const user: User = {
            username: this.form?.get('username')?.value,
            name: this.form?.get('name')?.value,
        };
        this.userService.updateOne(this.userId, user).subscribe();
    } else {
        console.error('Form is invalid');
    }
  }
}
