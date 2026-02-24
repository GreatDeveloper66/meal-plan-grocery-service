export type Coordinates = {
    placeId?: string;
    lat: number;
    lng: number;
};

export type CoordinateWithDistance = Coordinates & {
    distance: number;
};
export type ArrayOfCoordinates = Coordinates[];
export type ArrayOfCoordinatesWithDistance = CoordinateWithDistance[];

