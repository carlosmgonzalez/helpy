<script>
	import * as Sheet from '$lib/components/ui/sheet/index';
	import { ListFilter } from '@lucide/svelte';
	import { buttonVariants } from '../ui/button';
</script>

<Sheet.Root>
	<Sheet.Trigger
		class={buttonVariants({ variant: 'secondary', size: 'icon', class: 'bg-background' })}
	>
		<ListFilter class="size-5" />
	</Sheet.Trigger>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
			<Sheet.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Sheet.Description>
		</Sheet.Header>
	</Sheet.Content>
</Sheet.Root>
