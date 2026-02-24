import { Coordinates } from "./Coordinates";

/**
 * Calculates the Euclidean distance between two geographic coordinates.
 * @param coordA - The first coordinate point with latitude and longitude properties.
 * @param coordB - The second coordinate point with latitude and longitude properties.
 * @returns The distance between the two coordinates as a number.
 */
export const findDistanceBetweenTwoCoordinates = (coordA: Coordinates, coordB: Coordinates): number => {
    return Math.sqrt((coordA.lat - coordB.lat) ** 2 + (coordA.lng - coordB.lng) ** 2);
}

