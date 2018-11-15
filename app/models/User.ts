import {Schema, Model, model} from 'mongoose';
import {UserInterface} from "../Interfaces/user.interface";

const userSchema: Schema = new Schema({
    username: String,
    password: String
});

export const User: Model<UserInterface> = model<UserInterface>('User', userSchema);

