import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  CHIEFEDITOR = 'chiefeditor',
  EDITOR = 'editor',
  USER = 'user',
}

@Schema()
export class User {
  [x: string]: any;
  @Prop()
  name: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  email: string;

  @Prop({ lowercase: true })
  emailToLowerCase: string;

  @Prop()
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
