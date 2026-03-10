import dotenv from 'dotenv';
dotenv.config();
import { Coordinates } from "../helpers/Coordinates";

interface PlacesApiResponse {
    status: number;
    statusText: string;
    places: any[]; // Could be more strictly typed
}

export const findAllGroceryStoresAndSupermarketsWithinRadius = async (
    radius: number,
    currentLocation: Coordinates
): Promise<PlacesApiResponse> => {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
    const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.name,places.location,places.types,places.formattedAddress,places.businessStatus,places.openingHours,places.rating,places.userRatingsTotal,places.photos,places.priceLevel,places.coordinates"
    };

    const body = {
        "includedTypes": ["supermarket", "grocery_store"],
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": currentLocation.latitude,
                    "longitude": currentLocation.longitude
                },
                "radius": radius
            }
        },
        "maxResultCount": 10
    };

    try {
        // Network-level try - catches fetch failures
        const response = await fetch(GOOGLE_PLACES_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        // Get the raw response data
        const responseStatus = response.status;
        const responseStatusText = response.statusText;
        const responseBodyText = await response.text();

        // Handle non-200 HTTP responses
        if (responseStatus !== 200) {
            return {
                status: responseStatus,
                statusText: responseStatusText,
                places: [] // Empty array for error cases
            };
        }

        // Try to parse the JSON (this could fail)
        try {
            const data = JSON.parse(responseBodyText);
            // Check if places exist and map them
            const places = data.places && data.places.length > 0
                ? data.places.map((place: any) => ({
                    placeId: place.id,
                    name: place.name,
                    displayName: place.displayName,
                    latitude: place.location?.latitude,
                    longitude: place.location?.longitude,
                    types: place.types,
                    formattedAddress: place.formattedAddress,
                    businessStatus: place.businessStatus,
                    openingHours: place.openingHours,
                    rating: place.rating,
                    userRatingsTotal: place.userRatingsTotal,
                    photos: place.photos,
                    priceLevel: place.priceLevel,
                    coordinates: place.coordinates
                  }))
                : [];

            return {
                status: responseStatus,
                statusText: responseStatusText,
                places: places
            };

        } catch (parseError) {
            // JSON parsing failed
            console.error("JSON Parse Error:", parseError);
            return {
                status: 500,
                statusText: "Internal Server Error - Invalid JSON response from Google API",
                places: []
            };
        }

    } catch (networkError) {
        // Network-level error (no response received)
        console.error("Network Error:", networkError);
        return {
            status: 503, // Service Unavailable
            statusText: `Service Unavailable - Network Error: ${networkError instanceof Error ? networkError.message : "Unknown error"}`,
            places: []
        };
    }
};