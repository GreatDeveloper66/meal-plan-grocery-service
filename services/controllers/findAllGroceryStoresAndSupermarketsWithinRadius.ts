import dotenv from 'dotenv';
dotenv.config();
import { Coordinates } from "../helpers/Coordinates";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';

const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
    'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.types'
}

//Function Inputs: radius, current location in latitude and longitude
//Function Output: List of place ids and coordinates for grocery stores and supermarkets within the specified radius


export const findAllGroceryStoresAndSupermarketsWithinRadius = async (radius: number, currentLocation: Coordinates) => {
    // Placeholder for the actual implementation
    // This function would typically call an external API (like Google Places API) to fetch the data
    // For demonstration purposes, we will return a mock list of grocery stores and supermarkets
    const body = {
        "includedTypes": ["supermarket", "grocery_store"],
        "maxResultCount": 20,
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": currentLocation.latitude,
                    "longitude": currentLocation.longitude
                },
                "radius": radius
            }
        }
    }

    try {
        const response = await fetch(GOOGLE_PLACES_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error(`Error fetching grocery stores and supermarkets: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.places && data.places.length > 0) {
            return data.places.map((place: any) => ({
                placeId: place.id,
                latitude: place.location.latitude,
                lng: place.location.longitude
            }));
        } else {
            return [];
        }
    } catch (error: any) {
        console.error("Error in findAllGroceryStoresAndSupermarketsWithinRadius:", error);
        throw error;
    }


}