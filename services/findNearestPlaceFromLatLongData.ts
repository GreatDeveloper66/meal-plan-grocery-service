import { findDistanceBetweenTwoCoordinates } from "./findDistanceBetweenTwoCoordinates";

type Coordinates = {
    placeId?: string;
    lat: number;
    lng: number;
}

type CoordinateWithDistance = Coordinates & {
    distance: number;
}

type ArrayOfCoordinates = Coordinates[];
type ArrayOfCoordinatesWithDistance = CoordinateWithDistance[];
//helper function that determines nearest coordinates in an array of
// coordinates based on distance from current location
/**
 * Finds the nearest place from a given current position using latitude and longitude data.
 * 
 * @param currentPosition - The current coordinates (latitude and longitude) to measure distance from
 * @param places - An array of place coordinates to search through
 * @returns The placeId of the nearest place to the current position
 * 
 * @example
 * const currentPos = { lat: 40.7128, lng: -74.0060 };
 * const places = [
 *   { lat: 40.7489, lng: -73.9680, placeId: 'place1' },
 *   { lat: 40.7614, lng: -73.9776, placeId: 'place2' }
 * ];
 * const nearestPlaceId = await findNearestPlaceFromLatLongData(currentPos, places);
 */
export const findNearestPlaceFromLatLongData = async (currentPosition: Coordinates, places: ArrayOfCoordinates) => {
    
    const placesWithDistance: ArrayOfCoordinatesWithDistance = places.map((place) => {
        const distance = findDistanceBetweenTwoCoordinates(currentPosition, place);
        return {
            ...place,
            distance
        }
    });
    const sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance);
    return sortedPlaces[0].placeId;
}

