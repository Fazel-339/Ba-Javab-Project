import mongoose, { model, Schema, Document } from 'mongoose';
import bcrypt from "bcrypt";
import {genSalt} from "bcrypt";


interface IUser extends Document {
    username: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: {type: String, required: true, unique:true},
    password: {type: String, required: true},
})

UserSchema.pre("save", async function (next) {
    const user = this as IUser;

    if (!user.isModified('password')) return next();

    const salt = await genSalt(10)
    user.password = await bcrypt.hash(user.password, salt);
    next();
})
const User = mongoose.model('User', UserSchema);

export default User;
