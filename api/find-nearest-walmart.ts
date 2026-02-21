import {VercelRequest, VercelResponse} from '@vercel/node';
import { getAddressofNearestWalmartFromCoordinates } from "../services/getAddressofNearestWalmartFromCoordinates"

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
        return res.status(400).json({error: "Missing lat or lng query parameters"});
    }
    try {
        const { address, distance } = await getAddressofNearestWalmartFromCoordinates(parseFloat(lat as string), parseFloat(lng as string), radius ? parseFloat(radius as string) : 5000);
        res.status(200).json({address, distance});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}