<script lang="ts">
	import { Button } from '$lib/components/ui/button/index';
	import Input from '$lib/components/ui/input/input.svelte';
	import { PUBLIC_MAPBOX_TOKEN } from '$env/static/public';
	import type {
		ResponseReverseGeocode,
		ResponseSearchGeocode
	} from '$lib/interfaces/response-geocode-mapbox';
	import { Loader, Locate, Pen } from '@lucide/svelte';
	import type { Attachment } from 'svelte/attachments';
	import { debounce } from '$lib/utils/debounce';
	import { invalidate } from '$app/navigation';

	const urlSearch = `https://api.mapbox.com/search/geocode/v6/forward?autocomplete=true&country=ar&types=address,street&access_token=${PUBLIC_MAPBOX_TOKEN}`;
	const urlReverse = `https://api.mapbox.com/search/geocode/v6/reverse?types=address,street&access_token=${PUBLIC_MAPBOX_TOKEN}`;

	interface Props {
		clientProfileId: string;
		addressText: string;
	}

	const { clientProfileId, addressText }: Props = $props();

	interface Address {
		id: string;
		coordinates: number[];
		fullAddress: string;
	}

	let isLoading = $state<Record<string, boolean>>({});
	let inputSearchAddress = $derived(addressText ?? '');
	let suggestedAddressesList: Address[] | null = $state(null);
	let selectedAddress = $state<Address | null>(null);
	let noSuggestions = $state(false);
	let errorGeolocation = $state(false);

	const searchAddress = async () => {
		isLoading['searchAddress'] = true;
		try {
			const res = await fetch(`${urlSearch}&q=${inputSearchAddress}`);
			const data: ResponseSearchGeocode = await res.json();
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

	const debounceSearchAddress = debounce(searchAddress, 1000);

	const attachmentInputSearch: Attachment = (element) => {
		element.addEventListener('input', () => {
			debounceSearchAddress();
		});
	};

	const changeAddress = async (address: Address) => {
		isLoading['changeAddress'] = true;
		try {
			const res = await fetch('/api/client-profile/change-address', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					clientProfileId,
					address
				})
			});

			const data = await res.json();

			if (data.ok) {
				console.log('Todo salio correctamente');
				await invalidate('app:load-map');
			}
		} catch (err) {
			console.log(err);
		} finally {
			isLoading['changeAddress'] = false;
		}
	};

	const searchReverseAddress = () => {
		isLoading['reverseAddress'] = true;
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				async (position) => {
					try {
						const longitude = position.coords.longitude.toString();
						const latitude = position.coords.latitude.toString();

						const res = await fetch(`${urlReverse}&longitude=${longitude}&latitude=${latitude}`);
						const data: ResponseReverseGeocode = await res.json();
						if (data && data.features.length > 0) {
							const address = {
								id: data.features[0].id,
								coordinates: data.features[0].geometry.coordinates,
								fullAddress: data.features[0].properties.full_address
							};
							changeAddress(address);
						}
					} catch (e) {
						console.log(e);
					} finally {
						isLoading['reverseAddress'] = false;
					}
				},
				(error) => {
					isLoading['reverseAddress'] = false;
					console.error('Error de geolocalización:', error.message);
					errorGeolocation = true;
					setTimeout(() => {
						errorGeolocation = false;
					}, 3000);
				}
			);
		} else {
			isLoading['reverseAddress'] = false;
		}
	};
</script>

<div class="relative flex w-full flex-col">
	<div class="flex w-full flex-row items-center justify-between gap-2">
		<Input
			type="text"
			placeholder="Corrientes 254"
			bind:value={inputSearchAddress}
			{@attach attachmentInputSearch}
		/>
		{#if isLoading['searchAddress']}
			<Loader class="animate-spin" />
		{/if}
		<Button
			onclick={() => searchReverseAddress()}
			size="icon"
			disabled={isLoading['reverseAddress']}
		>
			{#if isLoading['reverseAddress']}
				<Loader class="animate-spin" />
			{:else}
				<Locate />
			{/if}
		</Button>
	</div>
	{#if suggestedAddressesList}
		<lu
			class="bg-card absolute top-12 z-20 mt-2 flex h-[150px] flex-col gap-1 overflow-y-auto rounded-sm px-3 py-1"
		>
			{#each suggestedAddressesList as option (option.id)}
				<li class="w-full list-none">
					<button
						onclick={() => {
							selectedAddress = option;
							suggestedAddressesList = null;
							inputSearchAddress = option.fullAddress;
							changeAddress(option);
						}}
						class="hover:border-primary w-full rounded-sm border border-transparent p-1.5 text-start text-sm font-light hover:cursor-pointer"
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
	{#if errorGeolocation}
		<span class="text-destructive mt-3 w-full text-center font-light">
			Error de geolocalización
		</span>
	{/if}
</div>
