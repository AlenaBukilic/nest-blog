import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ unique: true })
  username: string;

  @Prop()
  email: string;

  @Prop({ lowercase: true })
  emailToLoweCase: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
