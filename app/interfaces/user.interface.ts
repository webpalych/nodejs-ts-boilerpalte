import {Document} from 'mongoose';

export interface UserInterface extends Document{
    name?: string;
    password?: string;
}