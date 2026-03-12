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
    currentLocation: Coordinates,
    requestId?: string
): Promise<PlacesApiResponse> => {
    const log = (message: string, data?: any) => {
        console.log(`[${requestId || 'no-id'}] ${message}`, data || '');
    };

    try {
        log("Function called", { radius, currentLocation });

        const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
        if (!GOOGLE_MAPS_API_KEY) {
            log("API key missing");
            return {
                status: 500,
                statusText: "Server configuration error: Google Maps API key not found",
                places: []
            };
        }

        const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

        // Simplified field mask - let's start with just the basics
        const headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
            "X-Goog-FieldMask": "places.id,places.displayName,places.name,places.location,places.types,places.formattedAddress,places.businessStatus,places.regularOpeningHours,places.currentOpeningHours,places.rating,places.userRatingCount,places.photos,places.priceLevel,places.internationalPhoneNumber,places.websiteUri"
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

        log("Making fetch request to Google Places API");
        log("Request headers:", headers);
        log("Request body:", JSON.stringify(body, null, 2));

        const response = await fetch(GOOGLE_PLACES_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        const responseStatus = response.status;
        const responseStatusText = response.statusText;
        const responseBodyText = await response.text();

        log(`Google API Response - Status: ${responseStatus}`);
        log(`Response body: ${responseBodyText}`); // This will show us the actual error

        if (responseStatus !== 200) {
            // Try to parse error message from Google
            let errorMessage = responseStatusText;
            try {
                const errorData = JSON.parse(responseBodyText);
                errorMessage = errorData.error?.message || responseStatusText;
                log("Google error details:", errorData);
            } catch {
                // If we can't parse, use the raw response
                errorMessage = responseBodyText || responseStatusText;
            }

            return {
                status: responseStatus,
                statusText: errorMessage,
                places: []
            };
        }

        // Parse successful response
        try {
            const data = JSON.parse(responseBodyText);
            log("Successfully parsed response", { placesFound: data.places?.length });

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
                    regularOpeningHours: place.regularOpeningHours, // Weekly hours
                    currentOpeningHours: place.currentOpeningHours, // Current/realtime hours
                    rating: place.rating,
                    userRatingCount: place.userRatingCount,
                    photos: place.photos, // Contains photo_reference for later retrieval
                    priceLevel: place.priceLevel,
                    phoneNumber: place.internationalPhoneNumber,
                    website: place.websiteUri
                }))
                : [];

            return {
                status: 200,
                statusText: "OK",
                places: places
            };

        } catch (parseError) {
            log("JSON Parse Error:", parseError);
            return {
                status: 500,
                statusText: "Invalid JSON response from Google API",
                places: []
            };
        }

    } catch (unexpectedError) {
        log("Unexpected error:", unexpectedError);
        return {
            status: 500,
            statusText: `Internal server error: ${unexpectedError instanceof Error ? unexpectedError.message : "Unknown error"}`,
            places: []
        };
    }
};