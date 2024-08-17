import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { z } from 'zod'
import { usernameValidation } from "@/Schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const queryParams = {
        username: searchParams.get('username')
    }
    // validation with zod 
    const result = usernameQuerySchema.safeParse(queryParams);
    if (!result.success) {
        const usernameError = result.error.format().username?._errors || [];
        return Response.json({
            success: false,
            message: usernameError?.length > 0 ? usernameError.join(', ') : 'invalid query parameters'
        }, {
            status: 400
        })
    }

    const { username } = result?.data;
    try {

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });
        if (existingVerifiedUser) {
            return Response.json({
                success: true,
                message: 'username is already taken'
            }, {
                status: 200
            })
        }
        return Response.json({
            success: true,
            message: 'username is unique'
        }, {
            status: 200
        })


    } catch (error) {
        console.error('error checking username ', error);
        return Response.json(
            {
                success: false,
                message: 'error checking username'
            }
            , {
                status: 500
            })
    }
}