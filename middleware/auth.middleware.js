// /middlewares/auth.middleware.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import Dealer from "../models/dealer.model.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || 
                      req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new apiError(401, "Unauthorized request");
        }
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        const dealer = await Dealer.findById(decodedToken?._id).select("-dealerPassword");
        
        if (!dealer) {
            throw new apiError(401, "Invalid Access Token");
        }
        
        req.dealer = dealer;
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token");
    }
});