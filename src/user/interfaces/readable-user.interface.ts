// import { IAddress } from './address.interface'; //TODO: create address interface

export interface IReadableUser {
    readonly email: string;
    status: string;
    readonly avatar: string;
    readonly avatarId: string;
    readonly lastName: string;
    readonly firstName: string;
    readonly gender: string;
    readonly address: any;
    readonly profession: string;
    readonly phone: string;
    readonly roles: Array<string>;
    accessToken?: string;
} 