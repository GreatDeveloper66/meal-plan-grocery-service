import dotenv from 'dotenv';
dotenv.config();

export interface PhotoResponse {
    photoUrl?: string;
    photoData?: string; // Base64 encoded image
    error?: string;
}

export class GooglePlacesPhotoService {
    private readonly apiKey: string;

    constructor() {
        this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
        if (!this.apiKey) {
            throw new Error('Google Maps API key is required');
        }
    }

    /**
     * Option 1: Generate a photo URL for client-side fetching
     * This returns a URL that the client can use to fetch the photo directly
     */
    getPhotoUrl(photoName: string, maxWidthPx: number = 400, maxHeightPx?: number): string {
        // The photo name is already in the format: places/PLACE_ID/photos/PHOTO_RESOURCE
        // We need to append '/media' to get the image
        const baseUrl = 'https://places.googleapis.com/v1';
        const url = new URL(`${baseUrl}/${photoName}/media`);

        url.searchParams.append('key', this.apiKey);
        url.searchParams.append('maxWidthPx', maxWidthPx.toString());

        if (maxHeightPx) {
            url.searchParams.append('maxHeightPx', maxHeightPx.toString());
        }

        return url.toString();
    }

    /**
     * Option 2: Fetch and return the photo as base64
     * This proxies the photo through your server
     */
    async fetchPhotoAsBase64(photoName: string, maxWidthPx: number = 400): Promise<PhotoResponse> {
        try {
            const photoUrl = this.getPhotoUrl(photoName, maxWidthPx);

            const response = await fetch(photoUrl);

            if (!response.ok) {
                return {
                    error: `Failed to fetch photo: ${response.status} ${response.statusText}`
                };
            }

            // Get the image as ArrayBuffer and convert to base64
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');

            // Get content type from response headers
            const contentType = response.headers.get('content-type') || 'image/jpeg';

            return {
                photoData: `data:${contentType};base64,${base64}`
            };

        } catch (error) {
            return {
                error: `Error fetching photo: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    /**
     * Option 3: Get photo metadata with skipHttpRedirect
     * This returns JSON with the photo URI instead of redirecting
     */
    async getPhotoMetadata(photoName: string, maxWidthPx: number = 400): Promise<any> {
        try {
            const baseUrl = 'https://places.googleapis.com/v1';
            const url = new URL(`${baseUrl}/${photoName}/media`);

            url.searchParams.append('key', this.apiKey);
            url.searchParams.append('maxWidthPx', maxWidthPx.toString());
            url.searchParams.append('skipHttpRedirect', 'true'); // This returns JSON instead of redirecting[citation:2]

            const response = await fetch(url.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();

        } catch (error) {
            console.error('Error fetching photo metadata:', error);
            return null;
        }
    }
}