// import fetch from 'node-fetch';
// import { findNearestPlaceFromLatLongData } from './helpers/findNearestPlaceFromLatLongData';

// const GOOGLE_MAPS_API_KEY = process.env.MEAL_PLAN_GOOGLE_MAPS_API_KEY;

// type Coordinates = {
//     placeId?: string;
//     lat: number;
//     lng: number;
// }

// type CoordinateWithDistance = Coordinates & {
//     distance: number;
// }

// type ArrayOfCoordinates = Coordinates[];
// type ArrayOfCoordinatesWithDistance = CoordinateWithDistance[];

// //helper functions to call Google Places API
// const determineNearestPlaceIdFromResponse = (currentLocation: Coordinates, data: any) => {
//     if (data.results && data.results.length > 0) {
//         //extract place IDs and coordinates
//         const places = data.results.map((place: any) => ({
//             placeId: place.place_id,
//             lat: place.geometry.location.lat,
//             lng: place.geometry.location.lng
//         }));
//         return places[0].placeId; //return the first place ID as the nearest
//     } else {
//         throw new Error("No places found in the response");
//     }
// };

// export const findNearestWalmartPlaceIdFromLatLng = async (req: any, res: any) => {
//     const { lat, lng } = req.params;
//     try {
//         const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=store&keyword=walmart&key=${GOOGLE_MAPS_API_KEY}`;
//         const response = await fetch(url);
//         if (!response.ok) {
//             return res.status(500).json({ error: `Error fetching nearest Walmart place ID: ${response.statusText}` });
//         }
//         const data = await response.json();
//         res.json(data);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const getPlaceIdFromLatLng = async (req: any, res: any) => {
//     const { lat , lng } = req.params;
//     try {
//         const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
//         const response = await fetch(url);
//         if (!response.ok) {
//             return res.status(500).json({ error: `Error fetching place ID: ${response.statusText}` });
//         }
//         const data = await response.json();
//         res.json(data);
//     }
//     catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const getPlaceIdentification = async (req: any, res: any) => {
//     const { query } = req.params;
//     try {
//         const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`; 
//         const response = await fetch(url);
//         if (!response.ok) {
//             return res.status(500).json({ error: `Error fetching place identification: ${response.statusText}` });
//         }
//         const data = await response.json();
//         res.json(data);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };

// export const getPlaceDetails = async (req: any, res: any) => {
//     const { placeId } = req.params;
//     try {
//         const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
//         const response = await fetch(url);
//         if (!response.ok) {
//             return res.status(500).json({ error: `Error fetching place details: ${response.statusText}` });
//         }
//         const data = await response.json();
//         res.json(data);
//     } catch (error: any) {
//         res.status(500).json({ error: error.message });
//     }
// };