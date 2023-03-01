import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth/auth.service';
import { supportedRoles, UserPublic } from '../models/user.interface';
import { User, UserDocument } from '../models/user.schema';
import { paginate, PaginationOptions } from 'nestjs-paginate-mongo';
import { PaginationData } from 'src/types/types.exporter';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}

  _decorateUserPublic(user: User): UserPublic {
    delete user._doc.password;
    delete user._doc.__v;
    const copiedUser = { ...user._doc };
    copiedUser.id = copiedUser._id;
    delete copiedUser._id;
    return copiedUser;
  }

  _userCreate(user: User, passwordHash: string): Observable<User> {
    const newUser = {
      ...user,
      password: passwordHash,
      emailToLowerCase: user.email,
    };
    return from(this.userModel.create(newUser));
  }

  _decorateUsers(users: User[]): UserPublic[] {
    return users.map((user) => this._decorateUserPublic(user));
  }

  create(user: User): Observable<UserPublic> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) =>
        this._userCreate(user, passwordHash).pipe(
          map((user: User) => this._decorateUserPublic(user)),
        ),
      ),
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
        return this._decorateUsers(users);
      }),
    );
  }

  paginate(options: PaginationOptions): Observable<PaginationData> {
    return from(paginate(this.userModel.find(), options)).pipe(
      map((res) => {
        const { metadata, data } = res;
        return {
          data: this._decorateUsers(data),
          metadata,
        };
      }),
    );
  }

  deleteOne(id: string): Observable<any> {
    return from(this.userModel.deleteOne({ _id: new Types.ObjectId(id) }));
  }

  updateOne(id: string, user: User): Observable<any> {
    delete user.email;
    delete user.emailToLowerCase;
    delete user.password;
    delete user.role;

    return from(
      this.userModel.updateOne({ _id: new Types.ObjectId(id) }, user),
    );
  }

  updateRoleOfUser(id: string, user: User): Observable<any> | Error {
    delete user.email;
    delete user.emailToLowerCase;
    delete user.password;

    if (!supportedRoles.includes(user.role)) {
      throw new Error('Not supported role type.');
    }

    return from(
      this.userModel.updateOne({ _id: new Types.ObjectId(id) }, user),
    );
  }

  login(user: User): Observable<string | Error> {
    return this.validateUser(user.email, user.password).pipe(
      switchMap((match: boolean) => {
        if (match) {
          return this.authService
            .generateJwt(user)
            .pipe(map((jwt: string) => jwt));
        } else {
          throw new Error('Login failed.');
        }
      }),
    );
  }

  validateUser(email: string, password: string): Observable<boolean | Error> {
    return this._findByEmail(email).pipe(
      switchMap((user: User) =>
        this.authService.comparePasswords(password, user.password),
      ),
      map((isValid: boolean) => {
        if (isValid) {
          return isValid;
        } else {
          throw new Error('Something whent wrong.');
        }
      }),
    );
  }

  _findByEmail(email: string): Observable<User> {
    return from(
      this.userModel.findOne({ emailToLowerCase: email.toLowerCase() }),
    );
  }

  findByEmail(email: string): Observable<UserPublic> {
    return from(
      this.userModel.findOne({ emailToLowerCase: email.toLowerCase() }),
    ).pipe(map((user: User) => this._decorateUserPublic(user)));
  }
}
