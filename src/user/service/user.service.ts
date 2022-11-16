import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth/auth.service';
import { UserPublic } from '../models/user.interface';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  _decorateUserPublic(user: User): UserPublic {
    delete user.password;
    return user;
  }

  _userCreate(user: User, passwordHash: string): Observable<User> {
    const newUser = {
      ...user,
      password: passwordHash,
    };
    return from(this.userModel.create(newUser));
  }

  create(user: User): Observable<UserPublic> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => this._userCreate(user, passwordHash)),
      map((user: User) => this._decorateUserPublic(user)),
      catchError((err: Error) => {
        return throwError(() => err);
      }),
    );
  }

  findOne(id: string): Observable<UserPublic> {
    return from(this.userModel.findOne({ _id: new Types.ObjectId(id) })).pipe(
      map((user: User) => this._decorateUserPublic(user)),
    );
  }

  findAll(): Observable<UserPublic[]> {
    return from(this.userModel.find().exec()).pipe(
      map((users) => {
        return users.map((user) => this._decorateUserPublic(user));
      }),
    );
  }

  deleteOne(id: string): Observable<any> {
    return from(this.userModel.deleteOne({ _id: new Types.ObjectId(id) }));
  }

  updateOne(id: string, user: User): Observable<any> {
    delete user.email;
    delete user.emailToLoweCase;
    delete user.password;

    return from(
      this.userModel.updateOne({ _id: new Types.ObjectId(id) }, user),
    );
  }
}
