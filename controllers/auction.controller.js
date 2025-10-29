import { Auction } from "../models/auction.model.js";
import { Car } from "../models/car.model.js";
import { Bid } from "../models/bid.model.js";
import { Dealer } from "../models/dealer.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { placeBid as createBid } from "./bid.controller.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Generate unique auction ID using UUID
const generateAuctionId = () => {
    return `AUC-${uuidv4()}`;
};

// 1. POST /api/v1/auction/createAuction - Creates a new auction
const createAuction = asyncHandler(async (req, res) => {
    const { startingPrice, startTime, endTime, carId } = req.body;

    // Validate required fields
    if (!startingPrice || !startTime || !endTime || !carId) {
        throw new apiError(400, "All fields are required: startingPrice, startTime, endTime, carId");
    }

    // Validate car exists
    const car = await Car.findById(carId);
    if (!car) {
        throw new apiError(404, "Car not found");
    }

    // Validate time logic
    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start <= now) {
        throw new apiError(400, "Start time must be in the future");
    }

    if (end <= start) {
        throw new apiError(400, "End time must be after start time");
    }

    // Check if car is already in an active auction
    const existingAuction = await Auction.findOne({
        carId: carId,
        status: { $in: ["Draft", "Scheduled", "Active"] }
    });

    if (existingAuction) {
        throw new apiError(400, "Car is already in an active auction");
    }

    const auctionId = generateAuctionId();
    const status = "Scheduled"; // All auctions start as scheduled

    const auction = await Auction.create({
        auctionId,
        startingPrice,
        startTime: start,
        endTime: end,
        status,
        carId
    });

    const populatedAuction = await Auction.findById(auction._id).populate('carId');

    return res.status(201).json(
        new apiResponse(201, populatedAuction, "Auction created successfully")
    );
});

// 2. PATCH /api/v1/auction/status/{auctionId} - Starts an auction
const startAuction = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new apiError(400, "Invalid auction ID");
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
        throw new apiError(404, "Auction not found");
    }

    if (auction.status !== "Scheduled") {
        throw new apiError(400, "Only scheduled auctions can be started");
    }

    const now = new Date();
    if (auction.startTime > now) {
        throw new apiError(400, "Cannot start auction before scheduled start time");
    }

    auction.status = "Active";
    await auction.save();

    const populatedAuction = await Auction.findById(auction._id).populate('carId');

    return res.status(200).json(
        new apiResponse(200, populatedAuction, "Auction started successfully")
    );
});

// 3. GET /api/v1/auction/{auctionId}/winner-bid - Retrieves highest bid and dealer info
const getWinnerBid = asyncHandler(async (req, res) => {
    const { auctionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        throw new apiError(400, "Invalid auction ID");
    }

    const auction = await Auction.findById(auctionId).populate('carId');
    if (!auction) {
        throw new apiError(404, "Auction not found");
    }

    // Get the highest bid for this auction
    const highestBid = await Bid.findOne({ auctionId: auctionId })
        .sort({ bidAmount: -1 })
        .populate('dealerId', 'dealerName dealerEmail dealerId')
        .lean();

    if (!highestBid) {
        return res.status(200).json(
            new apiResponse(200, {
                auction: auction,
                message: "No bids found for this auction"
            }, "No bids placed yet")
        );
    }

    // Get total bid count for this auction
    const totalBids = await Bid.countDocuments({ auctionId: auctionId });

    const responseData = {
        auction: auction,
        winnerBid: {
            bidId: highestBid.bidId,
            bidAmount: highestBid.bidAmount,
            bidTime: highestBid.bidTime,
            dealer: highestBid.dealerId
        },
        totalBids: totalBids
    };

    return res.status(200).json(
        new apiResponse(200, responseData, "Winner bid retrieved successfully")
    );
});

// 4. POST /api/v1/auction/placeBids - Allows a dealer to place a bid
const placeBid = asyncHandler(async (req, res) => {
    // Delegate to the bid controller's placeBid function
    // This avoids code duplication and maintains separation of concerns
    return await createBid(req, res);
});

// 5. POST /api/v1/auction/token - Generate token with static credentials
const generateToken = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // Static credentials validation from environment variables
    const STATIC_USERNAME = process.env.ADMIN_USERNAME || "Admin";
    const STATIC_PASSWORD = process.env.ADMIN_PASSWORD || "Admin";

    if (!username || !password) {
        throw new apiError(400, "Username and password are required");
    }

    if (username !== STATIC_USERNAME || password !== STATIC_PASSWORD) {
        throw new apiError(401, "Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            username: STATIC_USERNAME,
            role: "admin",
            iat: Math.floor(Date.now() / 1000)
        },
        process.env.ACCESS_TOKEN_SECRET || "default_secret_key",
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "24h"
        }
    );

    return res.status(200).json(
        new apiResponse(200, {
            token,
            username: STATIC_USERNAME,
            role: "admin",
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "24h"
        }, "Token generated successfully")
    );
});

export {
    createAuction,
    startAuction,
    getWinnerBid,
    placeBid,
    generateToken
};

