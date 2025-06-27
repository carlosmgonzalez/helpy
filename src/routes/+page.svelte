<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { onMount } from 'svelte';
	import { House } from '@lucide/svelte';

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		const map = new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [-58.3981812000879, -34.604164455920625],
			zoom: 12
		});

		const el = document.getElementById('el')!;

		new mapboxgl.Marker(el)
			.setLngLat([-58.3981812000879, -34.604164455920625])
			.setPopup(new mapboxgl.Popup().setHTML('<h1>Hello World!</h1>'))
			.addTo(map);
	});
</script>

<svelte:head>
	<title>Helpy</title>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div id="map" class="h-screen w-screen"></div>
<div id="el" class="rounded-full bg-sky-400 p-1">
	<House class="h-auto w-[20px] text-sky-800" />
</div>

<style>
	/* .marker {
		background-image: url('https://i.pinimg.com/736x/fc/48/7b/fc487b390a02aa1e82be4c32dd53b0ab.jpg');
		background-size: cover;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		cursor: pointer;
	} */
</style>
