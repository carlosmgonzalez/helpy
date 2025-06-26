interface Coordinates {
	latitude: number;
	longitude: number;
}

export interface Location {
	name: string;
	coordinates: Coordinates;
}
