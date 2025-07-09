<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import AppNavbar from '$lib/components/layout/app-navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<link href="https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.css" rel="stylesheet" />
</svelte:head>

<Sidebar.Provider>
	<ModeWatcher />
	<AppSidebar />
	<main class="flex h-screen w-full flex-col">
		<AppNavbar />
		{@render children()}
	</main>
</Sidebar.Provider>
