import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true })
  title: string;

  @Prop({ default: '' })
  slug: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  body: string;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ default: '' })
  publishedDate: Date;

  @Prop({ default: false })
  isPublished: boolean;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: '' })
  headerImg: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
