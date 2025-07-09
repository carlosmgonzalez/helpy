<script lang="ts">
	import { page } from '$app/state';
	import { SearchX } from '@lucide/svelte';
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
	{#if page.status === 404}
		<p class="text-2xl">Pagina no encontrada</p>
		<SearchX class="size-20" />
	{:else}
		<h1>{page.error?.message}</h1>
	{/if}
</div>
