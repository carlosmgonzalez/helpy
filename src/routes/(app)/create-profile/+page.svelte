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
	import { formatPrice } from '$lib/utils/formatters';
	import { Loader, Locate, Pen } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Footer from '$lib/components/layout/footer.svelte';
	import { enhance } from '$app/forms';
	import type { Attachment } from 'svelte/attachments';
	import { debounce } from '$lib/utils/debounce';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card/index';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { getAddress, getReverseAddress, type Address } from '$lib/services/address';

	const { data: loadedData, form }: PageProps = $props();

	let bio = $state('');
	let yearsOfExperience = $state(0);

	let inputSearchAddress = $state('');
	let suggestedAddressesList: Address[] | null = $state(null);
	let selectedAddress = $state<Address | null>(null);
	let noSuggestions = $state(false);

	const searchAddress = async () => {
		isLoading['searchAddress'] = true;
		try {
			const data = await getAddress(inputSearchAddress);
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

	const attachmentInputPriceFrom: Attachment = (element) => {
		if (isFocusedPriceFrom) {
			(element as HTMLInputElement).focus();
		}
	};

	const attachmentInputPriceTo: Attachment = (element) => {
		if (isFocusedPriceTo) {
			(element as HTMLInputElement).focus();
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
						const data = await getReverseAddress(longitude, latitude);

						if (data && data.features.length > 0) {
							selectedAddress = {
								id: data.features[0].id,
								coordinates: data.features[0].geometry.coordinates,
								fullAddress: data.features[0].properties.full_address
							};
							inputSearchAddress = data.features[0].properties.full_address;
						}
					} catch (e) {
						console.log(e);
					} finally {
						isLoading['reverseAddress'] = false;
					}
				},
				(error) => {
					console.error('Error de geolocalización:', error.message);
					isLoading['reverseAddress'] = false;
				}
			);
		} else {
			isLoading['reverseAddress'] = false;
		}
	};

	const services = $derived(
		loadedData.services.map((service) => ({
			id: service.id,
			value: service.name
		}))
	);

	let service = $state('');
	let serviceId = $state('');

	let openService = $state(false);
	let triggerRefService = $state<HTMLButtonElement>(null!);
	function closeAndFocusTriggerService() {
		openService = false;
		tick().then(() => {
			triggerRefService.focus();
		});
	}

	const filteringServices = $derived(services.find((f) => f.value === service)?.value);

	let openClient = $state(false);
	let triggerRefClient = $state<HTMLButtonElement>(null!);
	function closeAndFocusTriggerClient() {
		openClient = false;
		tick().then(() => {
			triggerRefClient.focus();
		});
	}

	const modalities = [
		{
			value: 'service_location',
			label: 'A domicilio'
		},
		{
			value: 'client_home',
			label: 'Oficina'
		},
		{
			value: 'online',
			label: 'Online'
		}
	];

	let selectedModalities = $state<string[]>([]);

	const textModalities = $derived(
		selectedModalities.reduce(
			(acc, item) => [...acc, modalities.find((i) => i.value === item)!.label],
			[] as string[]
		)
	);

	const triggerContent = $derived(
		textModalities.length > 0
			? textModalities.length === 3
				? 'Todas'
				: textModalities.join(', ')
			: 'Seleccione'
	);

	let priceFrom = $state(0);
	let isFocusedPriceFrom = $state(false);

	let priceTo = $state(0);
	let isFocusedPriceTo = $state(false);

	let isLoading = $state<Record<string, boolean>>({});
</script>

<div class="flex h-full flex-col justify-between">
	<div class="px-2">
		<Tabs.Root value="client">
			<Tabs.List>
				<Tabs.Trigger value="client">Cliente</Tabs.Trigger>
				<Tabs.Trigger value="service">Servicio</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="client">
				<Card.Root>
					<Card.Header>
						<Card.Title>Busca lo que necesitas</Card.Title>
						<Card.Description>Completa la información para comenzar</Card.Description>
					</Card.Header>
					<Card.Content>
						<form
							method="POST"
							action="?/createProfileClient"
							id="createProfileClient"
							class="flex flex-col gap-5"
							use:enhance={({ formData }) => {
								isLoading['createProfile'] = true;
								formData.set('serviceId', serviceId);
								formData.set('selectedAddress', JSON.stringify(selectedAddress));

								return ({ result, update }) => {
									isLoading['createProfile'] = false;
									if (result.type === 'redirect') {
										goto(result.location, { invalidateAll: true, replaceState: true });
									} else if (result.type === 'failure') {
										update({ reset: false, invalidateAll: false });
									}
								};
							}}
						>
							<div>
								<span class="mb-1 text-sm font-light">Que servicio necesitas</span>
								<Popover.Root bind:open={openClient}>
									<Popover.Trigger bind:ref={triggerRefClient}>
										{#snippet child({ props })}
											<Button
												{...props}
												variant="outline"
												class="flex w-full justify-between"
												role="combobox"
												aria-expanded={openClient}
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
									<Popover.Content class="w-[300px] p-2">
										<Command.Root>
											<Command.Input placeholder="Buscar servicio" />
											<Command.List>
												<Command.Empty>No se encontro el servicio.</Command.Empty>
												<Command.Group value="client">
													{#each services as option, i (option.value + '-' + i)}
														<Command.Item
															value={option.value}
															onSelect={() => {
																service = option.value;
																serviceId = option.id;
																closeAndFocusTriggerClient();
															}}
														>
															<CheckIcon
																class={cn(service !== option.value && 'text-transparent')}
															/>
															{option.value}
														</Command.Item>
													{/each}
												</Command.Group>
											</Command.List>
										</Command.Root>
									</Popover.Content>
								</Popover.Root>
							</div>
							<div class="flex flex-col">
								<span class="mb-1 text-sm font-light">Donde te encuentras</span>
								<div class="flex w-full flex-row items-center justify-between gap-2">
									{#if selectedAddress}
										<div class="flex w-full flex-row items-center justify-between">
											<p>{selectedAddress.fullAddress}</p>
											<Button
												onclick={() => {
													selectedAddress = null;
												}}
												variant="outline"
												size="icon"
											>
												<Pen />
											</Button>
										</div>
									{:else}
										<Input
											type="text"
											placeholder="Corrientes 254"
											bind:value={inputSearchAddress}
											{@attach attachmentInputSearch}
										/>
									{/if}
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
										class="bg-background mt-2 flex h-[150px] flex-col gap-1 overflow-y-auto rounded-sm px-3 py-1"
									>
										{#each suggestedAddressesList as option (option.id)}
											<li class="w-full list-none">
												<button
													onclick={() => {
														selectedAddress = option;
														suggestedAddressesList = null;
														inputSearchAddress = option.fullAddress;
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
							</div>
							{#if form && form.errorClient}
								<span class="tex-center font-light text-red-500">Algunos campos faltan</span>
							{/if}
						</form>
					</Card.Content>
					<Card.Footer>
						<Button type="submit" form="createProfileClient">
							{#if isLoading['createProfile']}
								<Loader class="animate-spin" />
							{:else}
								Guardar
							{/if}
						</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
			<Tabs.Content value="service">
				<Card.Root>
					<Card.Header>
						<Card.Title>Da a conocer tu servicio</Card.Title>
						<Card.Description>Completa toda la información para dar el primer paso</Card.Description
						>
					</Card.Header>
					<Card.Content>
						<form
							method="POST"
							action="?/createProviderProfile"
							id="createProviderProfile"
							class="flex flex-col gap-5"
							use:enhance={({ formData }) => {
								isLoading['createProfile'] = true;
								formData.set('serviceId', serviceId);
								formData.set('selectedModalities', JSON.stringify(selectedModalities));
								formData.set('selectedAddress', JSON.stringify(selectedAddress));
								formData.set('priceFrom', priceFrom.toString());
								formData.set('priceTo', priceTo.toString());

								return ({ result, update }) => {
									isLoading['createProfile'] = false;
									if (result.type === 'redirect') {
										goto(result.location, { invalidateAll: true, replaceState: true });
									} else if (result.type === 'failure') {
										update({ reset: false, invalidateAll: false });
									}
								};
							}}
						>
							<div>
								<span class="mb-1 text-sm font-light">Elige el servicio que vas a ofrecer</span>
								<Popover.Root bind:open={openService}>
									<Popover.Trigger bind:ref={triggerRefService}>
										{#snippet child({ props })}
											<Button
												{...props}
												variant="outline"
												class="flex w-full justify-between"
												role="combobox"
												aria-expanded={openService}
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
									<Popover.Content class="w-[300px] p-2">
										<Command.Root>
											<Command.Input placeholder="Buscar servicio" />
											<Command.List>
												<Command.Empty>No se encontro el servicio.</Command.Empty>
												<Command.Group value="service">
													{#each services as option, i (option.value + '-' + i)}
														<Command.Item
															value={option.value}
															onSelect={() => {
																service = option.value;
																serviceId = option.id;
																closeAndFocusTriggerService();
															}}
														>
															<CheckIcon
																class={cn(service !== option.value && 'text-transparent')}
															/>
															{option.value}
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
									<Input name="yearsOfExperience" bind:value={yearsOfExperience} type="number" />
								</div>
								<div class="w-full">
									<span class="mb-1 text-sm font-light">Modalidad del servicio</span>
									<Select.Root type="multiple" bind:value={selectedModalities}>
										<Select.Trigger class="bg-background w-full">
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
							<div class="flex flex-col gap-1">
								<span class="text-sm font-light">Rango de precio por tu servicio</span>
								<div class="flex flex-row items-center gap-2">
									<div class="flex w-full flex-row items-center gap-2">
										<span class="text-sm font-light">Desde:</span>
										<!-- <Input type="number" bind:value={priceFrom} /> -->
										{#if isFocusedPriceFrom}
											<Input
												type="number"
												bind:value={priceFrom}
												onfocusout={() => {
													isFocusedPriceFrom = false;
												}}
												{@attach attachmentInputPriceFrom}
											/>
										{:else}
											<Input
												type="text"
												value={formatPrice(priceFrom)}
												onclick={() => {
													isFocusedPriceFrom = true;
												}}
											/>
										{/if}
									</div>
									<div class="flex w-full flex-row items-center gap-2">
										<span class="text-sm font-light">Hasta:</span>
										{#if isFocusedPriceTo}
											<Input
												type="number"
												bind:value={priceTo}
												onfocusout={() => {
													isFocusedPriceTo = false;
												}}
												{@attach attachmentInputPriceTo}
											/>
										{:else}
											<Input
												type="text"
												value={formatPrice(priceTo)}
												onclick={() => {
													isFocusedPriceTo = true;
												}}
											/>
										{/if}
									</div>
								</div>
							</div>
							<div class="flex flex-col">
								<span class="mb-1 text-sm font-light">Dirección</span>
								<div class="flex w-full flex-row items-center justify-between gap-2">
									{#if selectedAddress}
										<div class="flex w-full flex-row items-center justify-between">
											<p>{selectedAddress.fullAddress}</p>
											<Button
												onclick={() => {
													selectedAddress = null;
												}}
												variant="outline"
												size="icon"
											>
												<Pen />
											</Button>
										</div>
									{:else}
										<Input
											type="text"
											placeholder="Corrientes 254"
											bind:value={inputSearchAddress}
											{@attach attachmentInputSearch}
										/>
									{/if}
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
										class="bg-background mt-2 flex h-[150px] flex-col gap-1 overflow-y-auto rounded-sm px-3 py-1"
									>
										{#each suggestedAddressesList as option (option.id)}
											<li class="w-full list-none">
												<button
													onclick={() => {
														selectedAddress = option;
														suggestedAddressesList = null;
														inputSearchAddress = option.fullAddress;
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
							</div>
							<div class="grid w-full gap-1.5">
								<Label for="message" class="font-light">Biografía</Label>
								<Textarea
									bind:value={bio}
									name="bio"
									maxlength={255}
									placeholder="Escribe tu biografía acá..."
									id="message"
								/>
							</div>
							{#if form && form.error}
								<span class="tex-center font-light text-red-500"
									>Algunos campos no son correctos o faltan</span
								>
							{/if}
						</form>
					</Card.Content>
					<Card.Footer>
						<Button type="submit" form="createProviderProfile">
							{#if isLoading['createProfile']}
								<Loader class="animate-spin" />
							{:else}
								Guardar
							{/if}
						</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
	<Footer />
</div>
