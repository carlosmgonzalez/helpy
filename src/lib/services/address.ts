import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
import type {
	ResponseReverseGeocode,
	ResponseSearchGeocode
} from '$lib/interfaces/response-geocode-mapbox';

export interface Address {
	id: string;
	coordinates: number[];
	fullAddress: string;
}

export const getAddress = async (query: string) => {
	const url = `https://api.mapbox.com/search/geocode/v6/forward?autocomplete=true&country=ar&types=address,street&access_token=${PUBLIC_MAPBOX_TOKEN}&q=${encodeURIComponent(query)}`;
	const res = await fetch(url);
	const data: ResponseSearchGeocode = await res.json();
	return data;
};

export const getReverseAddress = async (lon: string, lat: string) => {
	const url = `https://api.mapbox.com/search/geocode/v6/reverse?types=address,street&access_token=${PUBLIC_MAPBOX_TOKEN}`;
	const res = await fetch(`${url}&longitude=${lon}&latitude=${lat}`);
	const data: ResponseReverseGeocode = await res.json();
	return data;
};
