import express from "express";
import {
    createAuction,
    startAuction,
    getWinnerBid,
    placeBid,
    generateToken
} from "../controllers/auction.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public route - Generate token with static credentials
// POST /api/v1/auction/token
router.route("/token").post(generateToken);

// Protected routes. They require authentication

// POST /api/v1/auction/createAuction - Creates a new auction
router.route("/createAuction").post(authMiddleware, createAuction);

// PATCH /api/v1/auction/status/{auctionId} - Starts an auction
router.route("/status/:auctionId").patch(authMiddleware, startAuction);

// GET /api/v1/auction/{auctionId}/winner-bid - Retrieves highest bid and dealer info
router.route("/:auctionId/winner-bid").get(authMiddleware, getWinnerBid);

// POST /api/v1/auction/placeBids - Allows a dealer to place a bid
router.route("/placeBids").post(authMiddleware, placeBid);

export default router;
