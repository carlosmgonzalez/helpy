<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index';
	import { MapPin } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
</script>

<Drawer.Root>
	<Drawer.Trigger>
		<MapPin class="size-7 text-red-700" />
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
			<Drawer.Description>This action cannot be undone.</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Button>Submit</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
