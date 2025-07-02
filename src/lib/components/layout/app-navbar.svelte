<script lang="ts">
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { LogIn, LogOut, Menu, MoonIcon, SunIcon } from '@lucide/svelte';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import Button from '../ui/button/button.svelte';
	import { toggleMode } from 'mode-watcher';
	import Logo from '$lib/assets/icons/logo.svelte';
	import { authClient } from '$lib/auth-clien';
	import type { User } from 'better-auth';
	import * as DropdownMenu from '../ui/dropdown-menu/index';

	const sidebar = useSidebar();

	let user = $state<User | null>(null);

	const getSession = async () => {
		const { data } = await authClient.getSession();
		if (data) {
			user = data.user;
		}
	};

	$effect(() => {
		getSession();
	});
</script>

<nav class="flex h-[80px] w-full">
	<div class="flex h-full w-full items-center justify-between px-2">
		<div class="w-20">
			<Button onclick={() => sidebar.toggle()} variant="ghost" size="icon">
				<Menu class="size-7" />
			</Button>
		</div>
		<Logo width="140" height="100" />
		<div class="flex w-20 items-center justify-end">
			<Button onclick={toggleMode} variant="ghost" size="icon">
				<SunIcon class="size-6 scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90" />
				<MoonIcon
					class="absolute size-6 scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			{#if user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root class="border-primary/50 border-2">
							<Avatar.Image src={user.image} alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						<DropdownMenu.Label>Mi cuenta</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							{user.email}
						</DropdownMenu.Item>
						<DropdownMenu.Item
							onclick={() =>
								authClient.signOut({
									fetchOptions: {
										onSuccess: () => {
											window.location.replace('/auth/login');
										}
									}
								})}
							class="flex flex-row items-center justify-between gap-2"
						>
							<span> Cerrar sesión </span>
							<LogOut class="text-destructive size-5" />
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<Button href="/auth/login" variant="ghost" size="icon">
					<LogIn class="text-primary size-6" />
				</Button>
			{/if}
		</div>
	</div>
</nav>
