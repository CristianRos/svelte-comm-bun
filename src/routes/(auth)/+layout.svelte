<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const headerTitle = () => (page.data.pageType === 'login' ? 'Log in' : 'Sign up');
	const buttonText = () => (page.data.pageType === 'login' ? 'Sign up' : 'Log in');
	const buttonLink = () => (page.data.pageType === 'login' ? '/signup' : '/login');

	let { children } = $props();
</script>

<div class="flex flex-col items-start gap-2 p-12">
	<div class="flex w-full flex-col items-center gap-2">
		{@render homeButton()}
		{@render header()}
		{@render children()}
	</div>
</div>

{#snippet header()}
	<div class="w-full p-2">
		<div class="flex flex-row justify-between">
			<h1 class="text-4xl">{headerTitle()}</h1>
			<button class="btn-form" onclick={async () => await goto(buttonLink())}>
				{buttonText()}
			</button>
		</div>
		<div class="my-2 h-1 w-full rounded-md bg-black px-4"></div>
	</div>
{/snippet}

{#snippet homeButton()}
	<button
		class="cursor-pointer transition-all duration-150 ease-in-out hover:text-black/60"
		onclick={async () => await goto('/')}>{'< Home page'}</button
	>
{/snippet}
