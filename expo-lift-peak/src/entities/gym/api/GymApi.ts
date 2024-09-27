import axios from "axios";
import {IGym} from "@entities/gym";

const GooglePlacesAPIKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

export const getGyms = async (text: string): Promise<IGym[]> => {
    const {data} = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json`,
        {
            params: {
                query: `gym ${text}`,
                key: GooglePlacesAPIKey,
            },
        }
    );
    return data.results.map((gym: any) => ({
        name: gym.name,
        place_id: gym.place_id,
        address: gym.formatted_address,
        latitude: gym.geometry.location.lat,
        longtitude: gym.geometry.location.lng,
    }))
}