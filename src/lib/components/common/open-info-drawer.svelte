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
		<MapPin class="size-7 text-red-700" />
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header class="flex flex-row items-center gap-2">
			{#if image}
				<div
					class="border-primary/40 flex items-center justify-center rounded-full border bg-white p-2"
				>
					<img src={image} alt={name} class="h-auto w-20" />
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
