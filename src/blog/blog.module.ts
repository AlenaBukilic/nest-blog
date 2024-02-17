import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './model/blog.schema';
import { AuthModule } from '../auth/auth.module';
import { BlogController } from './controller/blog.controller';
import { UserModule } from 'src/user/user.module';
import { BlogService } from './service/blog.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
    AuthModule,
    UserModule,
  ],
  providers: [BlogService],
  controllers: [BlogController],
  exports: [],
})
export class BlogModule {}
