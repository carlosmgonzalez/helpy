<script lang="ts">
	import mapboxgl from 'mapbox-gl';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import { onMount } from 'svelte';

	onMount(() => {
		mapboxgl.accessToken = PUBLIC_MAPBOX_TOKEN;

		new mapboxgl.Map({
			container: 'map',
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [-74.5, 40],
			zoom: 9
		});
	});
</script>

<svelte:head>
	<title>Helpy</title>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<div id="map" class="h-full w-full"></div>
