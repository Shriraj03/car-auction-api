const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carID: {
        type: Number,
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

module.export = mongoose.model("Car", carSchema)