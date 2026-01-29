import {VercelRequest, VercelResponse} from '@vercel/node';
import {findNearestWalmartPlaceIdFromLatLng} from "../services/googleplacesServices"

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    const {lat, lng} = req.query;
    if (!lat || !lng) {
        return res.status(400).json({error: "Missing lat or lng query parameters"});
    }
    try {
        const placeId = await findNearestWalmartPlaceIdFromLatLng(parseFloat(lat as string), parseFloat(lng as string));
        res.status(200).json({placeId});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
}