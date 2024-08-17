import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmails } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingVerifiedUsername = await UserModel.findOne({
            isVerified: true,
            username
        })
        if (existingVerifiedUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken',
            }, { status: 409 })
        }
        const existingUserWithEmail = await UserModel.findOne({ email });
        const otp = Math.floor(Math.random() * 90000000 + 1000000).toString();
        if (existingUserWithEmail) {
            if (existingUserWithEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'user already exist with same email already , use a new email'
                }, {
                    status: 500
                })
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserWithEmail.password = hashedPassword;
                existingUserWithEmail.verifyCode = otp;
                existingUserWithEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserWithEmail.save();
            }
        } else {
            // user is new , should be created 
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: otp,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                messages: [],
            })
            await newUser.save();
        }

        // send verification email to verify user 
        const emailResponse = await sendVerificationEmails(email, username, otp);
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }
        return Response.json({
            success: true,
            message: 'User registered successfully. Please verify your email'
        }, {
            status: 201
        })

    } catch (error) {
        console.error('error registering user ', error);
        return Response.json({
            success: false,
            message: 'error registering the user',

        },
            {
                status: 500
            })
    }
}