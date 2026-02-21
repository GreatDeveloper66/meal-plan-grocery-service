//helper service to find Walmart places within a certain radius of a given location using Google Places API
import dotenv from 'dotenv';
dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';

type Coordinates = {
    placeId?: string;
    lat: number;
    lng: number;
}

/**
 * Finds Walmart store locations within a specified radius of a given coordinate.
 * @param lat - The latitude of the center point for the search
 * @param lng - The longitude of the center point for the search
 * @param radius - The search radius in meters
 * @returns A promise that resolves to an array of Coordinates objects containing placeId, lat, and lng for each Walmart location found
 * @throws {Error} Throws an error if the API request fails or if the response cannot be parsed
 */
export const findWalmartPlacesWithinRadius = async (lat: number, lng: number, radius: number): Promise<Coordinates[]> => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=store&keyword=walmart&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching Walmart places: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            return data.results.map((place: any) => ({
                placeId: place.place_id,
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng
            }));
        } else {
            return [];
        }
    } catch (error: any) {
        console.error("Error in findWalmartPlacesWithinRadius:", error);
        throw error;
    }
}