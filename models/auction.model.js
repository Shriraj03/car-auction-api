import mongoose,{Schema} from "mongoose"

const auctionSchema = new Schema({
    auctionId:{
        type: String,
        required: true,
        unique: true,
    },
    startingPrice:{
        type: Number,
        required: true,
    },
    startTime:{
        type: Date,
        required: true
    },
    endTime:{
        type: Date,
        required: true
    },
    status:{
        type: String,
        enum: ["Draft","Scheduled","Active","Closed","Completed","Cancelled"],
        required: true
    }
},{timestamps: true})


export const Auction = mongoose.model("Auction",auctionSchema)