import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/create-user.dto';
import { ConfirmAccountDto } from './confirm-account.dto';
import { SignInDto } from './dto/signin.dto';
import { IReadableUser } from 'src/user/interfaces/readable-user.interface';


@ApiTags('auth') // задаем префикс пути к эндпоинтам
@Controller('auth') // объявляем тип для внедрения нужного сервиса -> this.authService
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/signUp')
    async signUp(@Body(new ValidationPipe()) createUserDto: CreateUserDto): Promise<boolean> {
        return await this.authService.signUp(createUserDto);
    }

    @Get('/confirm')
    async confirm(@Query(new ValidationPipe()) query: ConfirmAccountDto): Promise<boolean> {
        await this.authService.confirm(query.token);
        return true;
    }

    @Post('/signIn')
    async signIn(@Body(new ValidationPipe()) signInDto: SignInDto): Promise<IReadableUser> {
        return await this.authService.signIn(signInDto);
    }
}
