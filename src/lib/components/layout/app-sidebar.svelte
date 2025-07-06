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
			<Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each items as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								<!-- {#snippet child({ props })}
									<a href={item.url} {...props}>
										<item.icon class="size-10" />
										<span class="text-xl">{item.title}</span>
									</a>
								{/snippet} -->
								<a href={item.url} class="flex w-full flex-row items-center gap-2">
									<span class="text-2xl">{item.title}</span>
									<!-- <item.icon class="size-5" /> -->
								</a>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
</Sidebar.Root>
