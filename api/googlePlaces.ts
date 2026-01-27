import fetch from 'node-fetch';

const GOOGLE_MAPS_API_KEY = process.env.MEAL_PLAN_GOOGLE_MAPS_API_KEY;

export const findNearestWalmartPlaceIdFromLatLng = async (req: any, res: any) => {
    const { lat, lng } = req.params;
    try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=store&keyword=walmart&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(500).json({ error: `Error fetching nearest Walmart place ID: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPlaceIdFromLatLng = async (req: any, res: any) => {
    const { lat , lng } = req.params;
    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(500).json({ error: `Error fetching place ID: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    }
    catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPlaceIdentification = async (req: any, res: any) => {
    const { query } = req.params;
    try {
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`; 
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(500).json({ error: `Error fetching place identification: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPlaceDetails = async (req: any, res: any) => {
    const { placeId } = req.params;
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(500).json({ error: `Error fetching place details: ${response.statusText}` });
        }
        const data = await response.json();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// export async function findNearestWalmartPlaceIdFromLatLng(lat: number, lng: number, radius: number = 5000) {
//   const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=store&keyword=walmart&key=${GOOGLE_MAPS_API_KEY}`;
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Error fetching nearest Walmart place ID: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
// }

// export async function getPlaceIdFromLatLng(lat: number, lng: number) {
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Error fetching place ID: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
// }


// export async function getPlaceIdentification(query: string) {
//   const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${GOOGLE_MAPS_API_KEY}`;
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Error fetching place identification: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
// }

// export async function getPlaceDetails(placeId: string) {
//   const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAPS_API_KEY}`;
//     const response = await fetch(url);
//     if (!response.ok) {
//         throw new Error(`Error fetching place details: ${response.statusText}`);
//     }
//     const data = await response.json();
//     return data;
// }