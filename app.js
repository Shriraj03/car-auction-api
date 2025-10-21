import express from "express"
import cors from "cors"

const app = express()

app.use(cors({
    origin: process.env.PORT,
    credentials: true
}))
app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit:"20kb"}))





export default app