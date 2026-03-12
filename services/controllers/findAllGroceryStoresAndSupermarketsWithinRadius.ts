import dotenv from 'dotenv';
dotenv.config();
import { Coordinates } from "../helpers/Coordinates";

interface PlacesApiResponse {
    status: number;
    statusText: string;
    places: any[];
}

export const findAllGroceryStoresAndSupermarketsWithinRadius = async (
    radius: number,
    currentLocation: Coordinates
): Promise<PlacesApiResponse> => {
    // Wrap the ENTIRE function body in a try-catch
    try {
        // Check if process.env exists (for Vercel)
        if (typeof process === 'undefined' || !process.env) {
            console.error("process.env is not available");
            return {
                status: 500,
                statusText: "Server configuration error: Environment variables not accessible",
                places: []
            };
        }

        const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        if (!GOOGLE_MAPS_API_KEY) {
            console.error("Google Maps API key is missing");
            return {
                status: 500,
                statusText: "Server configuration error: Google Maps API key not found",
                places: []
            };
        }

        const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

        // Validate input
        if (!currentLocation || typeof currentLocation.latitude !== 'number' || typeof currentLocation.longitude !== 'number') {
            return {
                status: 400,
                statusText: "Invalid coordinates provided",
                places: []
            };
        }

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

        // This inner try-catch is for fetch-specific errors
        try {
            console.log("Making fetch request to Google Places API");
            const response = await fetch(GOOGLE_PLACES_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const responseStatus = response.status;
            const responseStatusText = response.statusText;
            const responseBodyText = await response.text();

            // Handle non-200 responses
            if (responseStatus !== 200) {
                console.error(`Google API error: ${responseStatus} - ${responseStatusText}`);
                return {
                    status: responseStatus,
                    statusText: responseStatusText,
                    places: []
                };
            }

            // Parse the response
            try {
                const data = JSON.parse(responseBodyText);
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
                    status: 200,
                    statusText: "OK",
                    places: places
                };

            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                return {
                    status: 500,
                    statusText: "Invalid JSON response from Google API",
                    places: []
                };
            }

        } catch (fetchError) {
            // Network-level errors
            console.error("Fetch Error:", fetchError);
            return {
                status: 503,
                statusText: `Network error: ${fetchError instanceof Error ? fetchError.message : "Unknown error"}`,
                places: []
            };
        }

    } catch (unexpectedError) {
        // Catch ANY other errors that might occur
        console.error("Unexpected error in findAllGroceryStoresAndSupermarketsWithinRadius:", unexpectedError);
        return {
            status: 500,
            statusText: `Internal server error: ${unexpectedError instanceof Error ? unexpectedError.message : "Unknown error"}`,
            places: []
        };
    }
};