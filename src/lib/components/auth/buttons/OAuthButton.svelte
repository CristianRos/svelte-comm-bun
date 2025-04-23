<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { setContext } from 'svelte';

	type Provider = 'google' | 'github';

	interface Props {
		provider: Provider;
	}

	function OAuthLogin(provider: Provider) {
		authClient.signIn.social(
			{
				provider: provider
			},
			{
				onError: (ctx) => {
					setContext('signup-message', ctx.error.message);
				}
			}
		);
	}

	let { provider }: Props = $props();
</script>

<button class="btn-form" onclick={() => OAuthLogin(provider)}>
	Continue with {provider.charAt(0).toUpperCase() + provider.slice(1)}
</button>
