import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import jwt from "jsonwebtoken";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.token || 
                      req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new apiError(401, "Unauthorized request");
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Set the user info from token in the request
        req.user = {
            _id: decodedToken._id,
            username: decodedToken.username
        };
        
        next();
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid access token");
    }
});