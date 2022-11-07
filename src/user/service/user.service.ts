import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { from, Observable } from 'rxjs';
import { User, UserDocument } from '../models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(user: User): Observable<User> {
    return from(this.userModel.create(user));
  }

  findOne(id: string): Observable<User> {
    return from(this.userModel.findOne({ _id: new Types.ObjectId(id) }));
  }

  findAll(): Observable<User[]> {
    return from(this.userModel.find().exec());
  }

  deleteOne(id: string): Observable<any> {
    return from(this.userModel.deleteOne({ _id: new Types.ObjectId(id) }));
  }

  updateOne(id: string, user: User): Observable<any> {
    return from(
      this.userModel.updateOne({ _id: new Types.ObjectId(id) }, user),
    );
  }
}
