import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/create-user.dto';
import { SignOptions } from 'jsonwebtoken';
import { CreateUserTokenDto } from 'src/token/token.dto';
import { roleEnum } from 'src/user/enums/role.enum';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { statusEnum } from 'src/user/enums/status.enum';
import { IUser } from 'src/user/user.types';
import { SignInDto } from './dto/signin.dto';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { userSensitiveFieldsEnum } from 'src/user/enums/protected-fields.enum';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import * as moment from 'moment';

@Injectable()
export class AuthService {
  private readonly clientAppUrl: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {
    this.clientAppUrl = this.configService.get<string>('FE_APP_URL');
  }

  async signUp(createUserDto: CreateUserDto): Promise<boolean> {
    try {
      const user = await this.userService.create(createUserDto, [
        roleEnum.user,
      ]);
      await this.sendConfirmation(user); // 1. отправлям письмо-подтвержденние
      return true;
    } catch (error) {
      throw new BadRequestException('Invalid field', error);
    }
  }

  async signIn({ email, password }: SignInDto): Promise<IReadableUser> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = await this.signUser(user);
      const readableUser = user.toObject() as IReadableUser;
      readableUser.accessToken = token;

      return _.omit<any>(
        readableUser,
        Object.values(userSensitiveFieldsEnum),
      ) as IReadableUser;
    }
    throw new BadRequestException('Invalid credentials');
  }

  async signUser(
    user: IUser,
    withStatusCheck: boolean = true,
  ): Promise<string> {
    if (withStatusCheck && user.status !== statusEnum.active) {
      throw new MethodNotAllowedException();
    }
    const tokenPayload: ITokenPayload = {
      _id: user._id, // генерит автоматически mongoose при создании? где брать id ???
      status: user.status,
      roles: user.roles,
    };
    const token = await this.generateToken(tokenPayload);
    const expireAt = moment()
      .add(1, 'day')
      .toISOString();

    await this.saveToken({
      token,
      expireAt,
      uId: user._id,
    });

    return token;
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<boolean> {
    const password = await this.userService.hashPassword(
      changePasswordDto.password,
    );

    await this.userService.update(userId, { password });
    await this.tokenService.deleteAll(userId);
    return true;
  }

  async confirm(token: string): Promise<IUser> {
    // 4. подтверждаем почту/меняем статус пользователя
    const data = await this.verifyToken(token);
    const user = await this.userService.find(data._id);

    await this.tokenService.delete(data._id, token);

    if (user && user.status === statusEnum.pending) {
      user.status = statusEnum.active;
      return user.save();
    }
    throw new BadRequestException('Confirmation error');
  }

  async sendConfirmation(user: IUser) {
    const token = await this.signUser(user, false); // 2. Сохраняем юзера получаем токен
    const confirmLink = `${this.clientAppUrl}/auth/confirm?token=${token}`; // отсюда прийдет запрос на контроллер "/confirm"

    await this.mailService.send({
      from: this.configService.get<string>('JS_CODE_MAIL'),
      to: user.email,
      subject: 'Verify User',
      html: `
                <h3>Hello ${user.firstName}!</h3>
                <p>Please use this <a href="${confirmLink}">link</a> to confirm your account.</p> 
            `,
      // 3. Отправляем токен в линке на почту.
    });
  }

  private async generateToken(
    data: ITokenPayload,
    options?: SignOptions,
  ): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  private async verifyToken(token): Promise<any> {
    const data = this.jwtService.verify(token) as ITokenPayload;
    const tokenExists = await this.tokenService.exists(data._id, token);

    if (tokenExists) {
      return data;
    }
    throw new UnauthorizedException();
  }

  private saveToken(createUserTokenDto: CreateUserTokenDto): Promise<any> {
    return this.tokenService.create(createUserTokenDto);
  }
}
