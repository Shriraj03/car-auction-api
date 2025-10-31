// /routes/dealer.routes.js
import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Authentication routes
router.post("/register", registerDealer);
router.post("/login", loginDealer);
router.post("/logout", authMiddleware, logoutDealer);
router.get("/refresh-token", refreshAccessToken);

// Dealer profile routes
router.get("/profile", authMiddleware, getDealerProfile);
router.patch("/profile", authMiddleware, updateDealerProfile);
router.delete("/delete-account", authMiddleware, deleteDealer);

// Dealer auction management
router.get("/auctions", authMiddleware, getDealerAuctions);
router.get("/bids", authMiddleware, getDealerBids);

export default router;