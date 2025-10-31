import mongoose,{Schema} from "mongoose"

const carSchema = new Schema({
    carID: {
        type: String,
        required: true,
        unique: true
    },
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    }


},{timestamps: true});

export const Car= mongoose.model("Car", carSchema)