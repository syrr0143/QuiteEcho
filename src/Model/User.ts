import mongoose, { Schema, Document } from 'mongoose'

export interface Message extends Document {
    content: string,
    createdAt: Date;
}


const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'please provide username'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'please provide your email id '],
        trim: true,
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email id'],
    },
    password: {
        type: String,
        required: [true, "please provide your password "]
    },
    verifyCode: {
        type: String,
        required: [true, 'please provide your verify code ']
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'please provide your verify code expiry']
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        required: false
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;