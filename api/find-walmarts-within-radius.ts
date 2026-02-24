import { VercelRequest, VercelResponse } from "@vercel/node";
import { findWalmartPlacesWithinRadius } from "../services/controllers/findWalmartPlacesWithinRadius";

export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
    const { lat, lng, radius } = req.query;
    // Validate query parameters
    if (!lat || !lng || !radius) {
        return res.status(400).json({ error: "Missing required query parameters: lat, lng, radius" });
    }
    try {
        const walmartPlaces = findWalmartPlacesWithinRadius(parseFloat(lat as string), parseFloat(lng as string), parseInt(radius as string));
        res.status(200).json({ status: "ok", places: walmartPlaces });
    } catch (error) {
        res.status(500).json({ error: "Failed to find Walmart places within radius", details: error instanceof Error ? error.message : "Unknown error" });
    }
    
}