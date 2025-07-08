<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index';
	import { MapPin } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';

	interface Props {
		name: string;
		bio: string;
		priceFrom: number;
		priceTo: number;
		image?: string | null;
	}

	const { name, image, bio, priceFrom, priceTo }: Props = $props();
</script>

<Drawer.Root>
	<Drawer.Trigger>
		<MapPin class="fill-primary/80 text-primary size-7" />
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header class="flex flex-row items-center gap-2">
			{#if image}
				<div
					class="border-primary/80 flex items-center justify-center rounded-full border-2 bg-white p-0.5"
				>
					<img src={image} alt={name} class="h-auto w-20 rounded-full" />
				</div>
			{/if}
			<div class="flex flex-col">
				<Drawer.Title>{name}</Drawer.Title>
				<Drawer.Description>{bio}</Drawer.Description>
			</div>
		</Drawer.Header>
		<Drawer.Footer>
			<Button>Submit</Button>
			<Drawer.Close>Cancel</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
