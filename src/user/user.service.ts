import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { IUser } from './user.types';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
  private readonly saltRounds = 10;
  constructor(@InjectModel('User') private readonly userModel: Model<IUser>) {} // с помощью InjectModel получаем модель "User"

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(password, salt);
  }

  async create(createUserDto: CreateUserDto, roles: string[]): Promise<IUser> {
    try {
      //метод создание пользователя
      //dto- data transfer object. Не интерфейс т.к. понадобятся методы класса (валидация)
      const salt = await bcrypt.genSalt(this.saltRounds); // кодер для пароля ???
      const hash = await bcrypt.hash(createUserDto.password, salt); // получение хэшированного пароля
      const createdUser = new this.userModel(
        _.assignIn(createUserDto, { password: hash, roles }),
      ); // созд юзера
      return await createdUser.save(); // сохр пользователя в базу данных
    } catch (error) {
      throw new BadRequestException('Creating user error:', error);
    }
  }

  async find(id: string): Promise<IUser> {
    // метод поиск пользователя
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(_id: string, payload: Partial<IUser>) {
    return await this.userModel.updateOne({ _id }, payload);
  }
}
