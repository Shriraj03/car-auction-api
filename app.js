import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.PORT,
    credentials: true
}))
app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended: true, limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes import
import auctionRouter from "./routes/auction.routes.js"
import CarRouter from "./routes/car.routes.js"
import bidRouter from "./routes/bid.routes.js"

// Routes declaration
app.use("/api/v1/auction", auctionRouter)
app.use("/api/v1/Car",CarRouter)
app.use("/api/v1/bid",bidRouter)
app.use("/api/v1/dealer",dealerRouter)

export default app