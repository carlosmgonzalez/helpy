<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	type option = {
		value: string;
		label: string;
	};

	interface Props {
		options: option[];
		value: string;
	}

	let { options, value = $bindable() }: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(options.find((f) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="secondary"
				class="flex w-[300px] justify-between"
				role="combobox"
				aria-expanded={open}
			>
				{#if selectedValue}
					<span class="text-sm">{selectedValue}</span>
				{:else}
					<span class="text-sm">Buscar servicio</span>
				{/if}
				<ChevronsUpDownIcon />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="p-2">
		<Command.Root>
			<Command.Input placeholder={`Buscar servicio`} />
			<Command.List>
				<Command.Empty>No se encontro el servicio.</Command.Empty>
				<Command.Group value="options">
					{#each options as option, i (option.value + '-' + i)}
						<Command.Item
							value={option.value}
							onSelect={() => {
								value = option.value;
								closeAndFocusTrigger();
							}}
						>
							<CheckIcon class={cn(value !== option.value && 'text-transparent')} />
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
