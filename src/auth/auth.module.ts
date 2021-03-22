import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { ConfigureModule } from '../configure.root';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { TokenModule } from 'src/token/token.module';
import { MailModule } from 'src/mail/mail.module';
import { TokenService } from 'src/token/token.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    UserModule,
    TokenModule,
    ConfigureModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    MailModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
