
import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
    throw new Error("Please define the MONGODB_URL environment variable inside .env file");
}


let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
export async function connectToDatabase(){
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts={
            bufferCommands: true,
            maxPoolSize: 50,
        }

        cached.promise = mongoose
        .connect(MONGODB_URL, opts)
        .then(()=>mongoose.connection)
    }

    try{
        cached.conn = await cached.promise;
        console.log("MongoDB connected");
    }
    catch(err){
        cached.promise = null;
        console.log("MongoDB connection failed");
        throw err;
    }

    return cached.conn;

}