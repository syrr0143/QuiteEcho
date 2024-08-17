import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from 'next-auth'
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const loggedInUser: User = session?.user as User;
    console.log('Logged in user:', loggedInUser);
    console.log('User ID:', loggedInUser?._id);

    if (!session?.user || !loggedInUser) {
        return Response.json({
            success: false,
            message: 'Not authenticated'
        }, {
            status: 401
        })
    }
    const userId = new mongoose.Types.ObjectId(loggedInUser._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: 'user not found'
            }, {
                status: 200
            })
        }

        return Response.json({
            success: true,
            message: user[0].messages
        }, {
            status: 200
        })
    } catch (error) {
        console.log('somethig went wrong in getting message', error)
        return Response.json({
            success: false,
            message: 'Failed to retrieve user data',
            error
        }, {
            status: 500
        })
    }

}