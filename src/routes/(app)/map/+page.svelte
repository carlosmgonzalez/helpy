<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { onMount } from 'svelte';
	import SearchBar from '$lib/components/common/search-bar.svelte';
	import FilterButton from '$lib/components/common/filter-button.svelte';
	import OpenInfoDrawer from '$lib/components/common/open-info-drawer.svelte';
	import type { PageProps } from './$types';
	import { House } from '@lucide/svelte';

	let mapContainer: HTMLElement;
	let service = $state('');

	const { data }: PageProps = $props();

	const createMap = (lon: number, lat: number) => {
		const map = new mapboxgl.Map({
			container: mapContainer,
			style: 'mapbox://styles/mapbox/light-v11',
			center: [lon, lat],
			zoom: 15
		});

		const el = document.getElementById('el')!;
		new mapboxgl.Marker(el).setLngLat([lon, lat]).addTo(map);

		// Usar setTimeout para asegurar que los elementos DOM estén disponibles
		setTimeout(() => {
			data.initialData!.forEach(({ user, service_profile }) => {
				const a = document.getElementById(user.id);
				if (a) {
					new mapboxgl.Marker(a)
						.setLngLat([service_profile.location.x, service_profile.location.y])
						.addTo(map);
				}
			});
		}, 0);
	};

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		if (data.client) {
			const { x, y } = data.client.location;
			createMap(x, y);
		} else {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const longitude = position.coords.longitude;
						const latitude = position.coords.latitude;

						createMap(longitude, latitude);
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
		}
	});
</script>

<svelte:head>
	<title>Helpy</title>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div class="flex w-full flex-row items-center justify-center gap-2 py-3">
	<SearchBar options={[]} value={service} />
	<FilterButton />
</div>
<div class="w-full flex-1 p-2">
	<div bind:this={mapContainer} class="h-full w-full rounded-md">
		<div id="el">
			<House class="size-7 fill-blue-800/80 text-blue-800" />
		</div>

		{#if data.initialData}
			{#each data.initialData as info (info.user.id)}
				<div id={info.user.id}>
					<OpenInfoDrawer
						name={info.user.name}
						image={info.user.image}
						bio={info.service_profile.bio!}
						priceFrom={info.service_profile.priceFrom}
						priceTo={info.service_profile.priceTo}
					/>
				</div>
			{/each}
		{/if}
	</div>
</div>
