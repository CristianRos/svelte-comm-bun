<script lang="ts">
	import OAuthButton from '$lib/components/auth/buttons/OAuthButton.svelte';
</script>

<div class="flex flex-row items-center justify-center gap-2">
	<OAuthButton provider="google" />
	<OAuthButton provider="github" />
</div>
