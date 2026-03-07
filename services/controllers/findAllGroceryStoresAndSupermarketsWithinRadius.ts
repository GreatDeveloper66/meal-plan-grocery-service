import dotenv from 'dotenv';
dotenv.config();
import { Coordinates } from "../helpers/Coordinates";

export const findAllGroceryStoresAndSupermarketsWithinRadius = async (radius: number, currentLocation: Coordinates) => {
    const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || '';
    const GOOGLE_PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby';

    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.name,places.location,places.types, places.formattedAddress, places.businessStatus, places.openingHours, places.rating, places.userRatingsTotal, places.photos,places.priceLevel,places.coordinates"
    }

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
    }

    try {
        console.log("Making request to Google Places API with:", {
            url: GOOGLE_PLACES_API_URL,
            body,
            headers: { ...headers, "X-Goog-Api-Key": "REDACTED" }
        });

        const response = await fetch(GOOGLE_PLACES_API_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Google Places API error response:", {
                status: response.status,
                statusText: response.statusText,
                body: errorText
            });
            throw new Error(`Error fetching grocery stores and supermarkets: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Google Places API response data:", JSON.stringify(data, null, 2));

        if (data.places && data.places.length > 0) {
            return data.places.map((place: any) => ({
                placeId: place.id,
                latitude: place.location.latitude,
                longitude: place.location.longitude
            }));
        } else {
            console.log("No places found in response");
            return [];
        }
    } catch (error: any) {
        console.error("Error in findAllGroceryStoresAndSupermarketsWithinRadius:", error);
        throw error;
    }
}