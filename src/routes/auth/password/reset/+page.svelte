<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { authClient } from '$lib/auth-clien';
	import type { PageProps } from './$types';
	import { Loader } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	const { data }: PageProps = $props();

	let email = $state('');
	let password = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);

	const resetPassword = async () => {
		isLoading = true;

		if (!data.otp) {
			return (errorMessage = 'Problemas con el link');
		}

		const { data: state, error } = await authClient.emailOtp.resetPassword({
			email,
			otp: data.otp,
			password
		});

		if (error?.message) {
			errorMessage = error.message;
			toast.error('Algo salio mal', {
				description: error.message,
				position: 'top-center'
			});
		} else if (state?.success) {
			toast.success('Contraseña cambiada', {
				description: 'Ahora puedes ingresar con la nueva contraseña',
				position: 'top-center'
			});
			email = '';
			password = '';
		}

		isLoading = false;
	};
</script>

<Card.Root class="mt-20 w-full max-w-sm">
	<Card.Header>
		<Card.Title>Recupera la contraseña</Card.Title>
		<Card.Description>Ingresa tu correo y contraseña nueva</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="flex flex-col gap-6">
				<div class="grid gap-2">
					<Label for="email">Correo</Label>
					<Input
						id="email"
						bind:value={email}
						type="email"
						placeholder="juan@ejemplo.com"
						required
					/>
				</div>
				<div class="grid gap-2">
					<Label for="password">Contraseña nueva</Label>
					<Input
						id="password"
						bind:value={password}
						type="password"
						placeholder="******"
						required
					/>
				</div>
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Button onclick={resetPassword} type="button" class="w-full">
			{#if isLoading}
				<Loader class="animate-spin" />
			{:else}
				Cambiar
			{/if}
		</Button>
	</Card.Footer>
</Card.Root>
