
import { Document } from 'mongoose';
import { statusEnum } from './enums/status.enum';


export interface IAddress {
    readonly country: string;
    readonly city: string;
    readonly addressLine1: string;
    readonly addressLine2: string;
}

export interface IUser extends Document {
    readonly email: string;
    readonly avatar: string;
    readonly avatarId: string;
    readonly lastName: string;
    readonly firstName: string;
    readonly gender: string;
    readonly address: IAddress;
    readonly profession: string;
    readonly searchField: string;
    readonly phone: string;
    readonly roles: Array<string>;
    readonly password: string;
    status: statusEnum;
}