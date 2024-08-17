import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { z } from "zod";
import { verifySchema } from "@/Schemas/verifySchema";

const verificationCodeValaidator = z.object({
    verificationCode: verifySchema
})

export async function POST(request: Request) {
    await dbConnect();
    const { username, verificationCode } = await request.json();
    try {

        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return Response.json({
                success: false,
                message: 'user does not exist '
            }, {
                status: 404
            })
        }
        const isCodeValid = user.verifyCode === verificationCode;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: 'Account verification successful'
            }, {
                status: 200
            })
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: 'verification Code expired, please signup again '
            }, {
                status: 401
            })
        }
        else {
            return Response.json({
                success: false,
                message: 'Invalid verification code, please enter correct one '
            }, {
                status: 401
            })
        }

    } catch (error) {
        console.error('error verifying the verification code ', error);
        return Response.json({
            sucess: false,
            message: 'something went wrong while verifying the verification code '
        }, {
            status: 500
        })
    }
}