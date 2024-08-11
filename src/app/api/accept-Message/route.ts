import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from 'next-auth'

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const loggedInUser: User = session?.user as User;
    if (!session?.user || !loggedInUser) {
        return Response.json({
            success: false,
            message: 'Not authenticated'
        }, {
            status: 401
        })
    }
    const userId = loggedInUser._id;
    const { acceptMessage } = await request.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessage }, { new: true })
        if (updatedUser) {
            return Response.json({
                success: true,
                message: 'accept message Status updated successfully',
                updatedUser
            }, {
                status: 200
            })
        }
        else {
            return Response.json({
                success: false,
                message: 'Failed to update status for user to accept message'
            }, {
                status: 401
            })
        }
    }

    catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to update status for user to accept message'
        }, {
            status: 500
        })
    }


}

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const loggedInUser: User = session?.user as User;
    if (!session?.user || !loggedInUser) {
        return Response.json({
            success: false,
            message: 'Not authenticated'
        }, {
            status: 401
        })
    }
    const userId = loggedInUser._id;

    try {
        const userfound = await UserModel.findByIdAndUpdate(userId);
        if (!userfound) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: 'User found',
            AcceptMessageStatus: userfound.isAcceptingMessage
        }, {
            status: 200
        })
    }

    catch (error) {
        return Response.json({
            success: false,
            message: 'Failed to update status for user to accept message'
        }, {
            status: 500
        })
    }
}