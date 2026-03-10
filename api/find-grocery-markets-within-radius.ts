import { VercelRequest, VercelResponse } from "@vercel/node";
import { findAllGroceryStoresAndSupermarketsWithinRadius } from "../services/controllers/findAllGroceryStoresAndSupermarketsWithinRadius";


export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
    if (req.method !== "POST") {
        res.status(405).json({ status: 405, statusText: "Must be Method Post", results: [] });
        return;
    }

    const { radius, currentLocation } = req.body;
    if (typeof radius !== "number" || !currentLocation || typeof currentLocation.latitude !== "number" || typeof currentLocation.longitude !== "number") {
        res.status(400).json({ status: 400, statusText: "Invalid request body", results: [] });
        return;
    }

    const result = await findAllGroceryStoresAndSupermarketsWithinRadius(radius, currentLocation);
    res.status(result.status).json({
        status: result.status,
        statusText: result.statusText,
        places: result.places
    });
}