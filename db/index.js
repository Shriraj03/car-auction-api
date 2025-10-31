import mongoose from "mongoose";
import { DB_NAME } from "../constants";

export const connectDB = async() =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`MongoDB connected successfully! DB connection host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MongoDB connection error",error)
        process.exit(1)
    }
    
}