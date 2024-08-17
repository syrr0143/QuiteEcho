import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from 'next-auth'

export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
    const messageId = params.messageId;
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
    try {
        const updatedResult = await UserModel.updateOne(
            { _id: loggedInUser._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: 'Failed to delete message'
            }, {
                status: 401
            })
        }
        return Response.json({
            success: true,
            message: 'Message deleted successfully'
        }, {
            status: 200
        })
    } catch (error) {
        console.log('server error while deleting message ', error);
        return Response.json({
            success: false,
            message: 'Failed to delete message, something went wrong'
        }, {
            status: 500
        })
    }


}