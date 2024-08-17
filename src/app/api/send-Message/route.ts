import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { Message } from "@/Model/User";

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();
    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            console.log('user is not found ', username)
            return Response.json({
                success: false,
                message: 'user not found'
            }, {
                status: 404
            })
        }
        // if user is accepting the message 
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: 'user is not accepting the message'
            }, {
                status: 403
            })
        }
        const newmessage = { content, createdAt: new Date() };
        user.messages.push(newmessage as Message);
        await user.save();
        return Response.json({
            success: true,
            message: 'Message sent successfully'
        }, {
            status: 200
        })
    } catch (error) {
        console.log('An unexpexted error from send message ', error)
        return Response.json({
            success: false,
            message: 'something went wrong while sending message'
        }, {
            status: 500
        })
    }
}