<script lang="ts">
	let { message }: { message: string } = $props();
</script>

<div class={message ? 'visible' : 'invisible'}>
	<div class="w-full rounded-md border border-red-500 bg-red-200">
		<p class="p-2 text-lg text-red-500">
			{message}
		</p>
	</div>
</div>
