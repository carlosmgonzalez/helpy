<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Google from '$lib/assets/icons/google.svelte';
	import { authClient, signInWithGoogle } from '$lib/auth-clien';
	import { Loader } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let isLoading = $state(false);

	const signUpWithEmail = async () => {
		isLoading = true;
		try {
			await authClient.signUp.email({
				email,
				password,
				name,
				fetchOptions: {
					onSuccess: () => {
						window.location.replace('/');
					}
				}
			});
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	};
</script>

<Card.Root class="mt-20 w-full max-w-sm">
	<Card.Header>
		<Card.Title>Crear una cuenta</Card.Title>
		<Card.Description>Ingresa todos los datos</Card.Description>
		<Card.Action>
			<Button href="/auth/login" variant="link">Ingresar</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<form>
			<div class="flex flex-col gap-6">
				<div class="grid gap-2">
					<Label for="email">Nombre completo</Label>
					<Input id="name" bind:value={name} name="name" type="text" placeholder="juan" required />
				</div>
				<div class="grid gap-2">
					<Label for="email">Correo</Label>
					<Input id="email" bind:value={email} type="email" placeholder="yo@ejemplo.com" required />
				</div>
				<div class="grid gap-2">
					<Label for="password">Contraseña</Label>
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
	<Card.Footer onclick={() => signUpWithEmail()} class="flex-col gap-2">
		<Button type="submit" class="w-full">
			{#if isLoading}
				<Loader class="animate-spin" />
			{:else}
				Crear cuenta
			{/if}
		</Button>
		<Button onclick={signInWithGoogle} variant="outline" class="w-full">
			Ingresar con Google
			<Google />
		</Button>
	</Card.Footer>
</Card.Root>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" width="100%">
	<path
		fill="#e05d38"
		fill-opacity="1"
		d="M0,128L80,149.3C160,171,320,213,480,218.7C640,224,800,192,960,160C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
	></path>
</svg>
