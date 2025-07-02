<script lang="ts">
	let { children } = $props();
</script>

<div class="mx-2 flex h-full flex-col items-center justify-between">
	{@render children()}
</div>
