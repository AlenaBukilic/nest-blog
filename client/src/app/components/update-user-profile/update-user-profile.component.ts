import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, of, tap } from 'rxjs';
import { switchMap } from 'rxjs';
import { AuthenticationService } from '../../../app/services/authentication-service/authentication.service';
import { UserService } from '../../../app/services/user-service/user.service';
import { User } from '../../models/users.model';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';

export interface File {
    data: any;
    inProgress: boolean;
    progress: number;
}

@Component({
  selector: 'app-update-user-profile',
  templateUrl: './update-user-profile.component.html',
  styleUrls: ['./update-user-profile.component.scss'],
})
export class UpdateUserProfileComponent {
  @ViewChild('fileUpload', { static: false }) fileUpload:
    | ElementRef
    | undefined;

  file: File = {
    data: null,
    inProgress: false,
    progress: 0,
  };
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
      profileImg: [''],
    });

    this.authService
      .getUserId()
      .pipe(
        switchMap((id: string) =>
          this.userService.findOne(id).pipe(
            tap((user: User) => {
              this.userId = user.id as string;
              this.form?.patchValue({
                username: user.username,
                name: user.name,
                profileImg: user.profileImg,
              });
            }),
          ),
        ),
      )
      .subscribe();
  }

  onFileSelected(event: any): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.file = {
        data: fileInput.files[0],
        inProgress: false,
        progress: 0,
      };
      this.fileUpload!.nativeElement.value = '';
      this.uploadFile();
    }
  }

  onClick(): void {
    const fileInput = this.fileUpload!.nativeElement;
    fileInput.click();
  }

  uploadFile(): void {
    const formData = new FormData();
    formData.append('file', this.file.data);
    this.file.inProgress = true;

    this.userService
      .uploadImage(formData)
      .pipe(
        map((event: any) => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              this.file.progress = Math.round(
                (event.loaded * 100) / event.total,
              );
              break;
            case HttpEventType.Response:
              return event;
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error(error);
          this.file.inProgress = false;
          return of(`${this.file.data.name} upload failed`);
        }),
      )
      .subscribe((event: any) => {
        if (typeof event === 'object') {
          this.form?.patchValue({ profileImg: event.body.profileImg });
        }
      });
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
