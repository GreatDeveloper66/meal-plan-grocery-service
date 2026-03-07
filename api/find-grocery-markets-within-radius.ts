import { VercelRequest, VercelResponse } from "@vercel/node";
import { findAllGroceryStoresAndSupermarketsWithinRadius } from "../services/controllers/findAllGroceryStoresAndSupermarketsWithinRadius";


export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const { latitude, longitude, radius } = req.query;
    // Validate query parameters
    if (!latitude || !longitude || !radius) {
        return res.status(400).json({ error: "Missing required query parameters: latitude, longitude, radius" });
    }
    if (parseInt(radius as string) > 50000) {
        return res.status(400).json({ error: "Radius must be less than or equal to 50,000 meters" });
    }
    try {
        const groceryStoresAndSupermarkets = await findAllGroceryStoresAndSupermarketsWithinRadius(parseInt(radius as string), { latitude: parseFloat(latitude as string), longitude: parseFloat(longitude as string) });
        res.status(200).json({ status: "ok", places: groceryStoresAndSupermarkets });
    } catch (error) {
        const responseStatus = res.statusCode;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error in handler:", { status: responseStatus, error: errorMessage });
        res.status(responseStatus).json({ error: "Failed to find grocery stores and supermarkets within radius", statusCode: responseStatus, details: errorMessage });
    }
}