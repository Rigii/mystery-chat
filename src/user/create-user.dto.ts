import { IAddress } from "./user.types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, IsEnum  } from "class-validator";
import { CreateAddressDto } from "./create-address.dto";
import { genderEnum } from './enums/gender.enum';
import { USER_GENDER, USER_ROLE } from "./constants";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    readonly email: string;

    readonly avatar: string;
    readonly avatarId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly lastName: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(USER_GENDER)
    readonly gender: string;

    @ApiPropertyOptional()
    @IsOptional()
    readonly address: CreateAddressDto;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly profession: string;

    readonly searchField: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly phone: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(USER_ROLE)
    readonly roles: Array<string>;
    
    @IsString()
    @IsNotEmpty()
    @Matches(
        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
        { message: 'Weak password' },
    )
    @ApiProperty()
    readonly password: string;
}


