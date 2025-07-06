<script lang="ts">
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index';
	import * as Popover from '$lib/components/ui/popover/index';
	import * as Select from '$lib/components/ui/select/index';
	import { Textarea } from '$lib/components/ui/textarea/index';
	import { Button } from '$lib/components/ui/button/index';
	import { Label } from '$lib/components/ui/label/index';
	import { cn } from '$lib/utils.js';
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Slider } from '$lib/components/ui/slider/index';
	import { formatPrice } from '$lib/utils/formatters';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import type { ResponseGeocode } from '$lib/interfaces/response-geocode-mapbox';
	import { Loader } from '@lucide/svelte';

	const url = `https://api.mapbox.com/search/geocode/v6/forward?autocomplete=true&country=ar&types=address,street&access_token=${PUBLIC_MAPBOX_TOKEN}`;

	interface Address {
		id: string;
		coordinates: number[];
		fullAddress: string;
	}

	let inputSearchAddress = $state('');
	let suggestedAddressesList: Address[] | null = $state(null);
	let selectedAddress = $state<Address | null>(null);
	let noSuggestions = $state(false);

	const searchAddress = async () => {
		isLoading['searchAddress'] = true;
		try {
			const res = await fetch(`${url}&q=${inputSearchAddress}`);
			const data: ResponseGeocode = await res.json();
			if (data && data.features.length > 0) {
				suggestedAddressesList = data.features.map((f) => ({
					id: f.id,
					coordinates: f.geometry.coordinates,
					fullAddress: f.properties.full_address
				}));
			} else {
				noSuggestions = true;
				setTimeout(() => {
					noSuggestions = false;
				}, 3000);
			}
		} catch (e) {
			console.log(e);
		} finally {
			isLoading['searchAddress'] = false;
		}
	};

	const services = [
		{
			value: 'veterinario',
			label: 'Veterinario'
		},
		{
			value: 'psicologo',
			label: 'Psicologo'
		}
	];

	let service = $state('');
	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const filteringServices = $derived(services.find((f) => f.value === service)?.label);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	const modalities = [
		{
			value: '1',
			label: 'Voy al lugar'
		},
		{
			value: '2',
			label: 'Vienen al lugar'
		},
		{
			value: '3',
			label: 'En linea'
		}
	];

	let modality = $state('');
	const triggerContent = $derived(
		modalities.find((f) => f.value === modality)?.label ?? 'Seleccione'
	);

	let price = $state([25, 30000]);

	let isLoading = $state<Record<string, boolean>>({});

	const saveServiceProfile = () => {
		console.log({
			selectedAddress,
			service,
			price,
			modality
		});
	};
</script>

<div class="flex h-full flex-col justify-between">
	<div class="w-full px-2">
		<h1 class="font-semibol mb-2 text-2xl">Crea tu perfil</h1>
		<form action="" class="flex flex-col gap-5">
			<div>
				<span class="mb-1 text-sm font-light">Elige el servicio que vas a ofrecer</span>
				<Popover.Root bind:open>
					<Popover.Trigger bind:ref={triggerRef}>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="secondary"
								class="flex w-full justify-between shadow-md"
								role="combobox"
								aria-expanded={open}
							>
								{#if filteringServices}
									<span class="text-sm">{filteringServices}</span>
								{:else}
									<span class="text-sm">Buscar servicio</span>
								{/if}
								<ChevronsUpDownIcon />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-full p-0">
						<Command.Root>
							<Command.Input placeholder="Buscar servicio" />
							<Command.List>
								<Command.Empty>No se encontro el servicio.</Command.Empty>
								<Command.Group value="options">
									{#each services as option, i (option.value + '-' + i)}
										<Command.Item
											value={option.value}
											onSelect={() => {
												service = option.value;
												closeAndFocusTrigger();
											}}
										>
											<CheckIcon class={cn(service !== option.value && 'text-transparent')} />
											{option.label}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="flex w-full flex-row items-center gap-2">
				<div class="w-full">
					<span class="mb-1 text-sm font-light">Años de experiencia</span>
					<Input type="number" />
				</div>
				<div class="w-full">
					<span class="mb-1 text-sm font-light">Modalidad del servicio</span>
					<Select.Root type="single" bind:value={modality}>
						<Select.Trigger class="w-full">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Modalidades</Select.Label>
								{#each modalities as option (option.value)}
									<Select.Item value={option.value} label={option.label}>
										{option.label}
									</Select.Item>
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<span class="text-sm font-light">Rango de precio por tu servicio</span>
				<div class="flex flex-row items-center gap-5">
					<span>{formatPrice(price[0])}</span>
					<Slider type="multiple" bind:value={price} max={100000} step={1} class="w-full" />
					<span>{formatPrice(price[1])}</span>
				</div>
			</div>
			<div class="flex flex-col">
				<span class="mb-1 text-sm font-light">Dirección</span>
				<div class="flex w-full flex-row items-center justify-between gap-2">
					<Input type="text" placeholder="Corrientes 254" bind:value={inputSearchAddress} />
					<Button onclick={() => searchAddress()} disabled={isLoading['searchAddress']}>
						{#if isLoading['searchAddress']}
							<Loader class="animate-spin" />
						{:else}
							Buscar
						{/if}
					</Button>
				</div>
				{#if suggestedAddressesList}
					<lu
						class="bg-card mt-2 flex h-[150px] flex-col gap-1.5 overflow-y-auto rounded-sm px-3 py-1"
					>
						{#each suggestedAddressesList as option (option.id)}
							<li class="w-full list-none">
								<button
									onclick={() => {
										selectedAddress = option;
										suggestedAddressesList = null;
										inputSearchAddress = option.fullAddress;
									}}
									class="hover:border-primary w-full rounded-sm border border-transparent p-1.5 text-start hover:cursor-pointer"
								>
									{option.fullAddress}
								</button>
							</li>
						{/each}
					</lu>
				{/if}
				{#if noSuggestions}
					<span class="text-destructive mt-3 w-full text-center font-light">
						No hubo ninguna coincidencia con tu busqueda
					</span>
				{/if}
			</div>
			<div class="grid w-full gap-1.5">
				<Label for="message" class="font-light">Biografía</Label>
				<Textarea maxlength={255} placeholder="Escribe tu biografía acá..." id="message" />
			</div>
			<Button onclick={saveServiceProfile}>Guardar</Button>
		</form>
	</div>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" width="100%">
		<path
			fill="#e05d38"
			fill-opacity="1"
			d="M0,128L80,149.3C160,171,320,213,480,218.7C640,224,800,192,960,160C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
		></path>
	</svg>
</div>

<!-- 
{
	id: '1',
	coordinates: [-57.533954, -38.025093],
	fullAddress: 'Rodríguez Peña 208, Mar del Plata, Buenos Aires Province, B7602, Argentina'
},
{
	id: '2',
	coordinates: [-58.059972, -29.798165],
	fullAddress: 'Rodríguez Peña 208, Curuzú Cuatiá, Corrientes, 3460, Argentina'
},
{
	id: '3',
	coordinates: [-58.278469, -34.714783],
	fullAddress: 'Rodríguez Peña 208, Bernal Este, Buenos Aires Province, B1876, Argentina'
},
{
	id: '4',
	coordinates: [-58.397274, -34.74154],
	fullAddress: 'Nicolás Rodríguez Peña 208, Banfield, Buenos Aires Province, B1828, Argentina'
},
{
	id: '5',
	coordinates: [-58.390736, -34.606622],
	fullAddress: 'Rodríguez Peña 208, San Nicolas, Buenos Aires, C1020, Argentina'
} -->

<style>
	:global(.search-box-mapbox) {
		/* Tus estilos aquí */
		border-radius: 0.5rem;
		background-color: red;
		/* ... */
	}
</style>
