
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}])], //.forFeature не глобально для конкр. задачи
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}