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
        "X-Goog-FieldMask": "places.id,places.displayName,places.location,places.types"
    }

    const body = {
        "includedTypes": ["supermarket", "grocery_store"], // Use place types from Table A
        "locationRestriction": {
            "circle": {
                "center": {
                    "latitude": currentLocation.latitude,
                    "longitude": currentLocation.longitude
                },
                "radius": radius // Radius in meters (max 50,000)
            }
        },
        "maxResultCount": 10 // Optional: limit results
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
                longitude: place.location.longitude
            }));
        } else {
            return [];
        }
    } catch (error: any) {
        console.error("Error in findAllGroceryStoresAndSupermarketsWithinRadius:", error);
        throw error;
    }

}


// const headers = {
//     'Content-Type': 'application/json',
//     'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
//     // 'X-Goog-FieldMask': 'places.id,places.displayName,places.location,places.types'
// }

// //Function Inputs: radius, current location in latitude and longitude
// //Function Output: List of place ids and coordinates for grocery stores and supermarkets within the specified radius


// export const findAllGroceryStoresAndSupermarketsWithinRadius = async (radius: number, currentLocation: Coordinates) => {
//     // Placeholder for the actual implementation
//     // This function would typically call an external API (like Google Places API) to fetch the data
//     // For demonstration purposes, we will return a mock list of grocery stores and supermarkets
//     // const body = {
//     //     "input": "grocery store supermarket",
//     //     "maxResults": 20,
//     //     "locationRestriction": {
//     //         "circle": {
//     //             "center": {
//     //                 "latitude": currentLocation.latitude,
//     //                 "longitude": currentLocation.longitude
//     //             },
//     //             "radius": radius
//     //         }
//     //     }
//     // }

//     const body = {
//         "textQuery": "Grocery Store"
//     }

//     try {
//         const response = await fetch(GOOGLE_PLACES_API_URL, {
//             method: 'POST',
//             headers: headers,
//             body: JSON.stringify(body)
//         });
//         if (!response.ok) {
//             throw new Error(`Error fetching grocery stores and supermarkets: ${response.statusText}`);
//         }
//         const data = await response.json();
//         if (data.places && data.places.length > 0) {
//             return data.places.map((place: any) => ({
//                 placeId: place.id,
//                 latitude: place.location.latitude,
//                 lng: place.location.longitude
//             }));
//         } else {
//             return [];
//         }
//     } catch (error: any) {
//         console.error("Error in findAllGroceryStoresAndSupermarketsWithinRadius:", error);
//         throw error;
//     }


// }