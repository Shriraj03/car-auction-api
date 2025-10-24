import mongoose, {Schema} from "mongoose";

const bidSchema = new Schema({
    bidId:{
        type: String,
        required: true,
        unique: true
    },
    bidAmount:{
        type: Number,
        required: true
    },
    previousBid:{
        type: Number,
        required: true,
    },
    bidTime:{
        type: Date,
        default: Date.now
    },
    dealerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dealer",
        required: true
    },
    auctionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auction",
        required: true
    }
},{timestamps: true})




export const Bid = mongoose.model("Bid",bidSchema)