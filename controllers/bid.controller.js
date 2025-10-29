// /controllers/bid.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Bid } from "../models/bid.model.js";
import { Auction } from "../models/auction.model.js";
import Dealer from "../models/dealer.model.js";
import { v4 as uuidv4 } from "uuid";

// Place a bid 
export const placeBid = asyncHandler(async (req, res) => {
    const { auctionId, bidAmount, dealerId } = req.body;
    
    if (!auctionId || !bidAmount || !dealerId) {
        throw new apiError(400, "Auction ID, dealer ID, and bid amount are required");
    }
    
    // Check if auction exists and is active
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
        throw new apiError(404, "Auction not found");
    }
    
    if (auction.status !== "Active") {
        throw new apiError(400, "Bids can only be placed on active auctions");
    }
    
    const now = new Date();
    if (now < auction.startTime || now > auction.endTime) {
        throw new apiError(400, "Auction is not currently active");
    }
    
    // Check if dealer exists
    const dealer = await Dealer.findById(dealerId);
    if (!dealer) {
        throw new apiError(404, "Dealer not found");
    }
    
    // Get highest bid for the auction
    const highestBid = await Bid.findOne({ auctionId }).sort({ bidAmount: -1 });
    
    // Determine previous bid amount (starting price if no bids exist)
    const previousBid = highestBid ? highestBid.bidAmount : auction.startingPrice;
    
    // Check if bid amount is higher than previous bid
    if (bidAmount <= previousBid) {
        throw new apiError(400, "Bid amount must be higher than the current highest bid");
    }
    
    // Create the bid
    const bid = await Bid.create({
        bidId: uuidv4(),
        bidAmount,
        previousBid,
        bidTime: now,
        dealerId,
        auctionId
    });
    
    return res
        .status(201)
        .json(new apiResponse(201, { bid }, "Bid placed successfully"));
});

// Update a bid
export const updateBid = asyncHandler(async (req, res) => {
    const { bidId } = req.params;
    const { bidAmount } = req.body;
    
    if (!bidAmount) {
        throw new apiError(400, "Bid amount is required for update");
    }
    
    // Find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
        throw new apiError(404, "Bid not found");
    }
    
    // Check if dealer is the owner of the bid
    if (bid.dealerId.toString() !== req.dealer._id.toString()) {
        throw new apiError(403, "You can only update your own bids");
    }
    
    // Get the auction
    const auction = await Auction.findById(bid.auctionId);
    if (!auction) {
        throw new apiError(404, "Associated auction not found");
    }
    
    // Check if auction is active
    if (auction.status !== "Active") {
        throw new apiError(400, "Bids can only be updated for active auctions");
    }
    
    // Check if we're still within auction time window
    const now = new Date();
    if (now < auction.startTime || now > auction.endTime) {
        throw new apiError(400, "Auction is not currently active");
    }
    
    // Get the highest bid for this auction (excluding current bid)
    const highestBid = await Bid.findOne({ 
        auctionId: bid.auctionId, 
        _id: { $ne: bidId } 
    }).sort({ bidAmount: -1 });
    
    // Determine previous bid amount (starting price if no other bids exist)
    const previousBid = highestBid ? highestBid.bidAmount : auction.startingPrice;
    
    // Check if new bid amount is higher than previous bid
    if (bidAmount <= previousBid) {
        throw new apiError(400, "Updated bid amount must be higher than the current highest bid");
    }
    
    // Update the bid
    bid.bidAmount = bidAmount;
    bid.previousBid = previousBid;
    bid.bidTime = now;
    
    await bid.save();
    
    return res
        .status(200)
        .json(new apiResponse(200, { bid }, "Bid updated successfully"));
});

// Delete a bid
export const deleteBid = asyncHandler(async (req, res) => {
    const { bidId } = req.params;
    
    // Find the bid
    const bid = await Bid.findById(bidId);
    if (!bid) {
        throw new apiError(404, "Bid not found");
    }
    
    // Check if dealer is the owner of the bid
    if (bid.dealerId.toString() !== req.dealer._id.toString()) {
        throw new apiError(403, "You can only delete your own bids");
    }
    
    // Get the auction
    const auction = await Auction.findById(bid.auctionId);
    if (!auction) {
        throw new apiError(404, "Associated auction not found");
    }
    
    // Check if auction is active
    if (auction.status !== "Active" && auction.status !== "Draft") {
        throw new apiError(400, "Bids can only be deleted for active or draft auctions");
    }
    
    // Check if we're still within auction time window for active auctions
    if (auction.status === "Active") {
        const now = new Date();
        if (now < auction.startTime || now > auction.endTime) {
            throw new apiError(400, "Auction is not currently active");
        }
    }
    
    // Delete the bid
    await Bid.findByIdAndDelete(bidId);
    
    return res
        .status(200)
        .json(new apiResponse(200, {}, "Bid deleted successfully"));
});

// Get bid by ID
export const getBidById = asyncHandler(async (req, res) => {
    const { bidId } = req.params;
    
    const bid = await Bid.findById(bidId)
        .populate("dealerId", "dealerId dealerName dealerEmail")
        .populate("auctionId");
    
    if (!bid) {
        throw new apiError(404, "Bid not found");
    }
    
    return res
        .status(200)
        .json(new apiResponse(200, { bid }, "Bid fetched successfully"));
});