import { connectDB } from "./db";
import dotenv from "dotenv"
import app from "./app";


dotenv.config({
    path: "./.env",
    credentials: true,

})

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.error("MongoDB conncetion error",err)
    process.exit(1)
})
