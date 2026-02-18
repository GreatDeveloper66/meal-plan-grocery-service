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

export const findNearestPlaceFromLatLongData = async (currentPosition: Coordinates, places: ArrayOfCoordinates) => {
    const findDistanceBetweenPoints = (pointA: Coordinates, pointB: Coordinates): number => {
        return Math.sqrt((pointA.lat - pointB.lat) ** 2 + (pointA.lng - pointB.lng) ** 2);
    }
    const placesWithDistance: ArrayOfCoordinatesWithDistance = places.map((place) => {
        const distance = findDistanceBetweenPoints(currentPosition, place);
        return {
            ...place,
            distance
        }
    });
    const sortedPlaces = placesWithDistance.sort((a, b) => a.distance - b.distance);
    return sortedPlaces[0].placeId;
}

