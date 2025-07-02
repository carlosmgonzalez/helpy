<script lang="ts">
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { Menu, MoonIcon, PanelRightClose, PanelRightOpen, SunIcon } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import { toggleMode } from 'mode-watcher';
	const sidebar = useSidebar();
</script>

<nav class={`flex h-[50px] w-full`}>
	<div class={cn('bg-primary/50 flex h-full w-full items-center justify-between px-2')}>
		<div class="w-20">
			<Button onclick={() => sidebar.toggle()} variant="ghost" size="icon">
				<Menu class="size-7" />
			</Button>
		</div>
		<h1 class="text-2xl font-semibold">HELPY</h1>
		<div class="flex w-20 justify-end">
			<Button onclick={toggleMode} variant="ghost" size="icon">
				<SunIcon class="scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
				<MoonIcon class="absolute scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0" />
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
</nav>
