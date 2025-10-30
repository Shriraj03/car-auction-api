import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Car } from "../models/car.model.js";
import mongoose from "mongoose";



export const Createcar = asyncHandler(async (req, res) => {

    const { carID, make, model, year } = req.body;
    //checks all the fields are required
    if (!carID || !make || !model || !year) {

        throw new apiError(400, "carID, make,model,year are required")
    }
    // Create the Car
    const CarInsert = await Car.create({
        carID,
        make,
        model,
        year

    });
    return res
        .status(201)
        .json(new apiResponse(201, { CarInsert }, "Car data inserted"));

});

export const UpdateCar  = asyncHandler(async (req, res) => {
    const { carID } = req.params;
    const { make, model, year } = req.body;
    if (!make || !model || !year) {
        throw new apiError(400, "all fields are required");
    }

    // find and update 
    const GetCarData = await Car.findOneAndUpdate({ carID }, { make, model, year }, { new: true });
    if (!GetCarData) {
        throw new apiError(404, "Car not found");
    }

    return res
        .status(200)
        .json(new apiResponse(200, { GetCarData }, "Car data Updated"));
});

export const DeleteCarData = asyncHandler(async (req, res) => {
    const { carID } = req.params;

    //find data
    const CarData = await Car.findOne({ carID });
    if (!CarData) {
        throw new apiError(404, "Car data not found");
    }

    // Delete the car data


    await Car.findOneAndDelete({ carID });
    // return 200
    return res
        .status(200)
        .json(new apiResponse(200, {}, "Car Data deleted successfully"));
});


export const GetCarData = asyncHandler(async (req, res) => {

    const { carID } = req.params;

    const CarData = await Car.findOne({carID})
    //if data not found
    if (!CarData) {
        throw new apiError(404, "Car not found");
    }
    // return 200
    return res
        .status(200)
        .json(new apiResponse(200, { CarData }, "CarData fetched successfully"));
});