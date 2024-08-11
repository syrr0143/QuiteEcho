import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}
const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('already connected to db');
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to db');
    } catch (error) {
        console.log('db conection failed ', error);
        process.exit();
    }
}

export default dbConnect;