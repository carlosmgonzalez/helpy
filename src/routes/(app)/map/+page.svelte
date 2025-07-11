<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { onMount } from 'svelte';
	import FilterButton from '$lib/components/common/filter-button.svelte';
	import OpenInfoDrawer from '$lib/components/common/open-info-drawer.svelte';
	import type { PageProps } from './$types';
	import { House, Loader } from '@lucide/svelte';
	import SearchAddressBar from '$lib/components/search-bar/search-address-bar.svelte';

	let mapContainer: HTMLElement;
	let map: mapboxgl.Map | undefined;
	let userMarker: mapboxgl.Marker | undefined;
	let serviceMarkers: mapboxgl.Marker[] = []; // Guardar los marcadores de servicio

	const { data }: PageProps = $props();

	let isLoading = $state(true);

	// onMount se usa para inicialización que solo ocurre una vez.
	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;
	});

	// $effect se ejecuta cada vez que 'data' cambia.
	$effect(() => {
		isLoading = true;

		// Función para crear/actualizar el mapa y los marcadores
		const setupMap = (lon: number, lat: number) => {
			if (!map && mapContainer) {
				// Si el mapa no existe, créalo
				map = new mapboxgl.Map({
					container: mapContainer,
					style: 'mapbox://styles/mapbox/light-v11',
					center: [lon, lat],
					zoom: 15
				});

				const el = document.getElementById('el')!;
				userMarker = new mapboxgl.Marker(el).setLngLat([lon, lat]).addTo(map);
			} else if (map && userMarker) {
				// Si el mapa ya existe, solo actualiza el centro y la posición del marcador
				map.flyTo({ center: [lon, lat] });
				userMarker.setLngLat([lon, lat]);
			}

			// Limpiar marcadores antiguos
			serviceMarkers.forEach((marker) => marker.remove());
			serviceMarkers = [];

			// Añadir nuevos marcadores
			data.serviceOfInterest?.forEach(({ user, provider_profile }) => {
				const markerElement = document.getElementById(user.id);
				if (markerElement) {
					const newMarker = new mapboxgl.Marker(markerElement)
						.setLngLat([provider_profile.location.x, provider_profile.location.y])
						.addTo(map!);
					serviceMarkers.push(newMarker); // Guardar la referencia
				}
			});

			isLoading = false;
		};

		if (data.client) {
			const { x, y } = data.client.location;
			setupMap(x, y);
		} else if ('geolocation' in navigator) {
			// Lógica de geolocalización de respaldo
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setupMap(position.coords.longitude, position.coords.latitude);
				},
				(error) => {
					console.error('Error de geolocalización:', error.message);
					isLoading = false;
				}
			);
		}
	});
</script>

<div class="flex w-full flex-row items-start justify-center gap-2 px-2 py-3">
	<SearchAddressBar clientProfileId={data.client!.id} addressText={data.client!.address} />
	<FilterButton />
</div>
<div class="w-full flex-1 p-2">
	<div bind:this={mapContainer} class="h-full w-full rounded-md">
		<div id="el" hidden={isLoading}>
			<House class="size-7 fill-blue-800/80 text-blue-800" />
		</div>

		{#if data.serviceOfInterest}
			{#each data.serviceOfInterest as info, i (i + '-' + info.user.id)}
				<div id={info.user.id} hidden={isLoading}>
					<OpenInfoDrawer
						name={info.user.name}
						image={info.user.image}
						bio={info.provider_profile.bio!}
						priceFrom={info.provider_profile.priceFrom}
						priceTo={info.provider_profile.priceTo}
					/>
				</div>
			{/each}
		{/if}

		{#if isLoading}
			<div class="flex h-full w-full items-center justify-center">
				<Loader class="size-14 animate-spin" />
			</div>
		{/if}
	</div>
</div>
