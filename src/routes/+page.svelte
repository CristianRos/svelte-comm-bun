<script>
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	const session = authClient.useSession();
</script>

{#if $session.data}
	<button class="btn-form" onclick={async () => await authClient.signOut()}> Sign out </button>
{:else}
	<button class="btn-form" onclick={async () => await goto('/login')}> Log in </button>
{/if}
