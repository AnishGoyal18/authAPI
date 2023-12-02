import { model, Schema } from "mongoose";
import { UserModelInterface } from "../interfaces/user.interface";

const UserSchema = new Schema<UserModelInterface>(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        bio: {
            type: String,
            required: true,
        },
        age: {
            type: Number,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        deletedAt: { 
            type: Date, 
            default: null 
        }
    },
    {
        timestamps: true,
    }
);

const expiryTime = 7 * 24 * 60 * 60; // 7 days
UserSchema.index({ deletedAt: 1 }, { expireAfterSeconds: expiryTime });

const User = model<UserModelInterface>("User", UserSchema);

export default User;
