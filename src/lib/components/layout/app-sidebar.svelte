<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Map, HouseIcon } from '@lucide/svelte';

	// Menu items.
	const items = [
		{
			title: 'Inicio',
			url: '/',
			icon: HouseIcon
		},
		{
			title: 'Mapa',
			url: '/map',
			icon: Map
		}
	];
</script>

<Sidebar.Root>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
