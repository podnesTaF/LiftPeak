import axios from "axios";

export interface Prediction {
    description: string;
    place_id: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
    terms: Array<{
        offset: number;
        value: string;
    }>;
    types: string[];
}

interface GooglePlacesResponse {
    predictions: Prediction[];
    status: string;
}

export const getLocation = async (query: string) => {
    const response = await axios.get<GooglePlacesResponse>(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
            params: {
                input: query,
                types: "(cities)",
                key: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
            },
        }
    );

    return response.data;
}