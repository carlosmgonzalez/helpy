<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { onMount } from 'svelte';
	import SearchBar from '$lib/components/common/search-bar.svelte';
	import FilterButton from '$lib/components/common/filter-button.svelte';
	import OpenInfoDrawer from '$lib/components/common/open-info-drawer.svelte';

	let mapContainer: HTMLElement;

	let service = $state('');

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const longitude = position.coords.longitude;
					const latitude = position.coords.latitude;

					const map = new mapboxgl.Map({
						container: mapContainer,
						style: 'mapbox://styles/mapbox/streets-v12',
						center: [longitude, latitude],
						zoom: 15
					});

					const el = document.getElementById('el')!;

					new mapboxgl.Marker(el).setLngLat([longitude, latitude]).addTo(map);
					// .setPopup(new mapboxgl.Popup().setHTML('<h1>Hello World!</h1>'))
				},
				(error) => {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							console.error('Usuario denegó la solicitud de geolocalización.');
							break;
						case error.POSITION_UNAVAILABLE:
							console.error('Información de ubicación no disponible.');
							break;
						case error.TIMEOUT:
							console.error('La solicitud de obtener la ubicación ha caducado.');
							break;
						default:
							console.error('Un error desconocido ocurrió.');
							break;
					}
				}
			);
		}
	});
</script>

<svelte:head>
	<title>Helpy</title>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div bind:this={mapContainer} class="relative h-[calc(100%-50px)] w-full">
	<div
		class="absolute top-[10px] right-0 left-0 z-20 flex w-full flex-row items-center justify-center gap-2"
	>
		<SearchBar options={[]} value={service} />
		<FilterButton />
	</div>
</div>

<div id="el">
	<OpenInfoDrawer />
</div>
