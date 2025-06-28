<script lang="ts">
	import '../app.css';
	import * as Sidebar from '$lib/components/ui/sidebar/index';
	import AppSidebar from '$lib/components/layout/app-sidebar.svelte';
	import AppNavbar from '$lib/components/layout/app-navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher />
<Sidebar.Provider>
	<AppSidebar />
	<main class="w-full">
		<AppNavbar />
		{@render children()}
	</main>
</Sidebar.Provider>
