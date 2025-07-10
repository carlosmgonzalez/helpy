<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { authClient } from '$lib/auth-clien';
	import { Loader } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	let email = $state('');
	let errorMessage = $state('');
	let isLoading = $state(false);

	const sendEmail = async () => {
		isLoading = true;

		const { data: sended, error } = await authClient.emailOtp.sendVerificationOtp({
			email,
			type: 'forget-password'
		});

		if (error?.message) {
			errorMessage = error.message;
			toast.error('Algo salio mal', {
				description: error.message,
				position: 'top-center'
			});
		} else if (sended?.success) {
			toast.success('Correo enviado', {
				description: 'Revisa tu correo para seguir con el proceso',
				position: 'top-center'
			});
			email = '';
		}

		isLoading = false;
	};
</script>

<Card.Root class="mt-20 w-full max-w-sm">
	<Card.Header>
		<Card.Title>¿Olvidaste tu contraseña?</Card.Title>
		<Card.Description>Ingresa tu correo y te enviaremos un correo para recuperarla</Card.Description
		>
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
			</div>
		</form>
	</Card.Content>
	<Card.Footer class="flex-col gap-2">
		<Button onclick={sendEmail} type="submit" class="w-full">
			{#if isLoading}
				<Loader class="animate-spin" />
			{:else}
				Enviar
			{/if}
		</Button>
	</Card.Footer>
</Card.Root>
