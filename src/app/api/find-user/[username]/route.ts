// src/pages/api/users/[username].ts

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/Model/User";
import { User } from 'next-auth';

export async function GET(request: Request, { params }: { params: { username: string } }) {
    const { username } = params; // Extract the username from params
    await dbConnect(); // Connect to the database

    try {
        // Attempt to find the user by username
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return Response.json({
            success: true,
            user
        }, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Server error while finding user:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Failed to find user, something went wrong'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
