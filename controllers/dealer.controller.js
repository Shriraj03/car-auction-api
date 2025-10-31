// /controllers/dealer.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Dealer } from "../models/dealer.model.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Dealer signup
export const registerDealer = asyncHandler(async (req, res) => {
    const { dealerName, dealerEmail, dealerPassword } = req.body;
    
    // Validate input
    if (!dealerName || !dealerEmail || !dealerPassword) {
        throw new apiError(400, "All fields are required");
    }
    
    // Check if dealer already exists
    const existingDealer = await Dealer.findOne({ dealerEmail });
    if (existingDealer) {
        throw new apiError(409, "Dealer with this email already exists");
    }
    
    // Create dealer
    const dealer = await Dealer.create({
        dealerId: uuidv4(),
        dealerName,
        dealerEmail,
        dealerPassword
    });
    
    // Get created dealer without password
    const createdDealer = await Dealer.findById(dealer._id).select("-dealerPassword");
    
    if (!createdDealer) {
        throw new apiError(500, "Something went wrong while registering dealer");
    }
    
    // Generate access token
    const accessToken = dealer.generateAccessToken();
    
    // Set cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };
    
    // Return response
    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .json(
            new apiResponse(
                201, 
                { dealer: createdDealer, accessToken },
                "Dealer registered successfully"
            )
        );
});

// Dealer login
export const loginDealer = asyncHandler(async (req, res) => {
    const { dealerEmail, dealerPassword } = req.body;
    
    // Validate input
    if (!dealerEmail || !dealerPassword) {
        throw new apiError(400, "Email and password are required");
    }
    
    // Find dealer
    const dealer = await Dealer.findOne({ dealerEmail });
    if (!dealer) {
        throw new apiError(404, "Dealer not found");
    }
    
    // Check password
    const isPasswordValid = await dealer.isPasswordCorrect(dealerPassword);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid credentials");
    }
    
    // Generate access token
    const accessToken = dealer.generateAccessToken();
    
    // Get dealer data without password
    const loggedInDealer = await Dealer.findById(dealer._id).select("-dealerPassword");
    
    // Set cookie options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };
    
    // Return response
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new apiResponse(
                200,
                { dealer: loggedInDealer, accessToken },
                "Dealer logged in successfully"
            )
        );
});

// Get dealer profile
export const getDealerProfile = asyncHandler(async (req, res) => {
    const dealer = await Dealer.findById(req.dealer._id).select("-dealerPassword");
    
    return res
        .status(200)
        .json(
            new apiResponse(
                200,
                { dealer },
                "Dealer profile fetched successfully"
            )
        );
});