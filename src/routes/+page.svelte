<script lang="ts">
	import OnlineConnection from '$lib/assets/illustrations/online-connection.svelte';
	import * as Card from '$lib/components/ui/card/index';
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Helpy</title>
	<meta name="title" content="Helpy" />
	<meta name="description" content="El lugar donde puedes encontrar tu ayuda mas cercana" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://helpy.work" />
	<meta property="og:title" content="Helpy - Tu ayuda mas cercana" />
	<meta property="og:description" content="El lugar donde puedes encontrar tu ayuda mas cercana" />
	<meta
		property="og:image"
		content="https://res.cloudinary.com/difikt7so/image/upload/v1752011993/helpy/xxmnndigjjzwmqzdnn9z.png"
	/>

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://helpy.work" />
	<meta property="twitter:title" content="Helpy - Tu ayuda mas cercana" />
	<meta
		property="twitter:description"
		content="El lugar donde puedes encontrar tu ayuda mas cercana"
	/>
	<meta
		property="twitter:image"
		content="https://res.cloudinary.com/difikt7so/image/upload/v1752011993/helpy/xxmnndigjjzwmqzdnn9z.png"
	/>
</svelte:head>

<div class="flex h-full w-full flex-col">
	<div class="relative h-[150px]">
		<div
			class="absolute right-0 left-0 flex flex-col-reverse items-center justify-center sm:flex-row sm:gap-5"
		>
			<div class="flex flex-col items-center">
				<h1 class="text-2xl font-light underline">Tu solución en un</h1>
				<h2 class="text-2xl font-bold underline">CLICK</h2>
			</div>
			<OnlineConnection width="250" height="250" />
		</div>
	</div>
	<div class="w-full">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" width="100%">
			<path
				fill="#e05d38"
				fill-opacity="1"
				d="M0,128L80,149.3C160,171,320,213,480,218.7C640,224,800,192,960,160C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
			></path>
		</svg>
	</div>
	<div class="bg-primary w-full flex-1">
		<!-- <Card.Root class="bg-card/50 border-card/60 mx-auto w-[80%]">
			<Card.Content>
				<p>Busco un servicio</p>
			</Card.Content>
		</Card.Root> -->
	</div>
</div>
