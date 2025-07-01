<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

{#if data.initialData}
	<ul>
		{#each data.initialData as d (d.user.id)}
			<li>{d.user.name} - {d.provider_profile?.bio}</li>
		{/each}
	</ul>
{/if}
