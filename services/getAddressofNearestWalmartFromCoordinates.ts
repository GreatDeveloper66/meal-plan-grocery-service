import { findNearestPlaceFromLatLongData} from "../services/findNearestPlaceFromLatlongData";
import { findWalmartPlacesWithinRadius } from "./findWalmartPlacesWithinRadius";
import { findDistanceBetweenTwoCoordinates } from "./findDistanceBetweenTwoCoordinates";
import dotenv from 'dotenv';
dotenv.config();

/**
 * Retrieves the address and distance of the nearest Walmart store from given coordinates.
 * 
 * @param lat - The latitude coordinate of the reference location
 * @param lng - The longitude coordinate of the reference location
 * @param radius - The search radius in meters to find nearby Walmart stores
 * @returns A promise that resolves to an object containing the formatted address and distance (in kilometers) of the nearest Walmart store
 * @returns The returned object has the structure: `{ address: string, distance: number }`
 * @throws Error if no Walmart stores are found within the specified radius
 * @throws Error if there is a failure fetching place details from Google Maps API
 * @throws Error if no details are found for the nearest Walmart store
 * 
 * @example
 * const result = await getAddressofNearestWalmartFromCoordinates(40.7128, -74.0060, 5000);
 * console.log(result.address); // "123 Main St, New York, NY 10001, USA"
 * console.log(result.distance); // 2.5
 */
export const getAddressofNearestWalmartFromCoordinates = async (lat: number, lng: number, radius: number) => {
    try {
        const walmartPlaces = await findWalmartPlacesWithinRadius(lat, lng, radius);
        if (walmartPlaces.length === 0) {
            throw new Error("No Walmart stores found within the specified radius");
        }
        const nearestPlaceId = await findNearestPlaceFromLatLongData({ lat, lng }, walmartPlaces);
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${nearestPlaceId}&key=${process.env.MEAL_PLAN_GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching place details: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.result) {
            const storeCoordinates = { lat: data.result.geometry.location.lat, lng: data.result.geometry.location.lng };
            const distance = findDistanceBetweenTwoCoordinates({ lat, lng }, storeCoordinates);
            return {
                address: data.result.formatted_address,
                distance: distance
            };
        } else {
            throw new Error("No details found for the nearest Walmart store");
        }
    } catch (error: any) {
        console.error("Error in getAddressofNearestWalmartFromCoordinates:", error);
        throw error;
    }
}