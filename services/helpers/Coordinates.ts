export type Coordinates = {
    placeId?: string;
    latitude: number;
    longitude: number;
};

export type CoordinateWithDistance = Coordinates & {
    distance: number;
};
export type ArrayOfCoordinates = Coordinates[];
export type ArrayOfCoordinatesWithDistance = CoordinateWithDistance[];

