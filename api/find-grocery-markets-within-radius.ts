import { VercelRequest, VercelResponse } from "@vercel/node";
import { findAllGroceryStoresAndSupermarketsWithinRadius } from "../services/controllers/findAllGroceryStoresAndSupermarketsWithinRadius";


export default function handler(
  req: VercelRequest,
  res: VercelResponse
) {
    const { latitude, longitude, radius } = req.query;
    // Validate query parameters
    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ error: "Missing required query parameters: latitude, longitude, radius" });
    }
    try {
        const groceryStoresAndSupermarkets = findAllGroceryStoresAndSupermarketsWithinRadius(parseInt(radius as string), { latitude: parseFloat(latitude as string), longitude: parseFloat(longitude as string) });
        res.status(200).json({ status: "ok", places: groceryStoresAndSupermarkets });
    } catch (error) {
        res.status(500).json({ error: "Failed to find grocery stores and supermarkets within radius", details: error instanceof Error ? error.message : "Unknown error" });
    }
}