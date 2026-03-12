import { VercelRequest, VercelResponse } from "@vercel/node";
import { findAllGroceryStoresAndSupermarketsWithinRadius } from "../services/controllers/findAllGroceryStoresAndSupermarketsWithinRadius";

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== "POST") {
        res.status(405).json({ status: 405, statusText: "Must be Method Post", places: [] });
        return;
    }

    const { radius, latitude, longitude } = req.body;
    // Validate input
    if(typeof radius !== "number" || typeof latitude !== "number" || typeof longitude !== "number") {
        res.status(400).json({
            status: 400,
            statusText: "Invalid input data. Radius, latitude, and longitude must be numbers.", 
            places: []
        });
        return;
    }

    if (radius <= 0 || radius > 50000) {
        res.status(400).json({
            status: 400,
            statusText: radius <= 0 ? "Radius must be greater than 0" : "Radius must be less than or equal to 50,000 meters", 
            places: []
        });
        return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({
            status: 400,
            statusText: "Invalid latitude or longitude values",
            places: []
        });
        return;
    }

    try {
        console.log("Calling findAllGroceryStoresAndSupermarketsWithinRadius with:", { radius, latitude, longitude });
        const result = await findAllGroceryStoresAndSupermarketsWithinRadius(radius, { latitude, longitude });

        console.log("Result received:", {
            status: result.status,
            statusText: result.statusText,
            placesCount: result.places?.length
        });

        res.status(result.status).json(result);

    } catch (error) {
        // This should rarely happen now since the controller catches everything
        console.error("Handler caught unexpected error:", error);

        // Log the full error details
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
        }

        res.status(500).json({
            status: 500,
            statusText: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            places: []
        });
    }
}