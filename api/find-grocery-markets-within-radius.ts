import { VercelRequest, VercelResponse } from "@vercel/node";
import { findAllGroceryStoresAndSupermarketsWithinRadius } from "../services/controllers/findAllGroceryStoresAndSupermarketsWithinRadius";
import { randomUUID } from 'crypto';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const requestId = randomUUID().slice(0, 8);
    console.log(`[${requestId}] Request started`);

    if (req.method !== "POST") {
        res.status(405).json({ status: 405, statusText: "Must be Method Post", places: [] });
        return;
    }

    const { radius, latitude, longitude } = req.body;

    // ... validation code ...
    if(typeof radius !== 'number' || typeof latitude !== 'number' || typeof longitude !== 'number') {
        console.warn(`[${requestId}] Invalid input:`, { radius, latitude, longitude });
        res.status(400).json({ status: 400, statusText: "Invalid input: radius, latitude, and longitude must be numbers", places: [] });
        return;
    }

    if(radius <= 0 || radius > 50000) { // Arbitrary upper limit to prevent abuse
        console.warn(`[${requestId}] Invalid radius:`, radius);
        let statusText = radius <= 0 ? "Invalid input: radius must be a positive number" : "Invalid input: radius exceeds maximum allowed value of 50,000 meters";
        res.status(400).json({ status: 400, statusText: statusText, places: [] });
        return;
    }

    if(latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        console.warn(`[${requestId}] Invalid coordinates:`, { latitude, longitude });
        res.status(400).json({ status: 400, statusText: "Invalid input: latitude must be between -90 and 90, longitude must be between -180 and 180", places: [] });
        return;
    }

    try {
        console.log(`[${requestId}] Calling findAllGroceryStoresAndSupermarketsWithinRadius with:`, { radius, latitude, longitude });

        const result = await findAllGroceryStoresAndSupermarketsWithinRadius(
            radius,
            { latitude, longitude },
            requestId // Pass the request ID
        );

        console.log(`[${requestId}] Result received:`, {
            status: result.status,
            statusText: result.statusText,
            placesCount: result.places?.length
        });

        res.status(result.status).json(result);

    } catch (error) {
        console.error(`[${requestId}] Handler caught unexpected error:`, error);
        res.status(500).json({
            status: 500,
            statusText: `Internal Server Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            places: []
        });
    }
}