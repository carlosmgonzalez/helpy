<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-full flex-col items-center justify-between">
	<div class="mx-2 flex w-full items-center justify-center">
		{@render children()}
	</div>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" width="100%">
		<path
			fill="#e05d38"
			fill-opacity="1"
			d="M0,128L80,149.3C160,171,320,213,480,218.7C640,224,800,192,960,160C1120,128,1280,96,1360,80L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
		></path>
	</svg>
</div>
