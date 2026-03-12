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

    const { radius, latitude, longitude } = req.body;
    if(typeof radius !== "number" || typeof latitude !== "number" || typeof longitude !== "number") {
        res.status(400).json({ status: 400, statusText: "Invalid input data. Radius, latitude, and longitude must be numbers.", results: [] });
        return;
    }


    if (radius <= 0) {
        res.status(400).json({ status: 400, statusText: "Radius must be greater than 0", results: [] });
        return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        res.status(400).json({ status: 400, statusText: "Invalid latitude or longitude values", results: [] });
        return;
    }

    if (radius > 50000) {
        res.status(400).json({ status: 400, statusText: "Radius must be less than or equal to 50,000 meters", results: [] });
        return;
    }

    try {
        const result = await findAllGroceryStoresAndSupermarketsWithinRadius(radius, currentLocation);
        res.status(result.status).json({
            status: result.status,
            statusText: result.statusText,
            places: result.places
        });
    } catch (error) {
        res.status(500).json({ status: 500, statusText: "Internal Server Error: call to findAllGroceryStoresAndSupermarketsWithinRadius failed ", results: [] });
    }
}