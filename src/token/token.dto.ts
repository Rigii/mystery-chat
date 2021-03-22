import { IsString, IsDateString } from 'class-validator';
import * as mongoose from 'mongoose';

export class CreateUserTokenDto {
  @IsString() // декоратор-валидатор с ф-алом генерации ошибки в респонс при несоответствии.
  token: string;
  @IsString()
  uId: mongoose.Types.ObjectId;
  @IsDateString()
  expireAt: string;
}
