<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { loginSchema, type LoginSchema } from '$lib/schemas/auth';

	import OAuthWrapper from '$lib/components/auth/OAuthWrapper.svelte';
	import FormMessage from '$lib/components/auth/FormMessage.svelte';

	let { data } = $props();

	let message = $state('');
	let submitting = $state(false);

	const { form, errors, constraints, validate, validateForm } = superForm(data.form, {
		validators: zod(loginSchema)
	});

	async function HandleBlur(event: FocusEvent) {
		const field = (event.target as HTMLInputElement).name;
		if (field) {
			validate(field as keyof LoginSchema);
		}

		message = '';
	}

	async function LogIn() {
		const res = await validateForm();
		if (!res.valid) {
			return;
		}

		authClient.signIn.email(
			{
				email: $form.email,
				password: $form.password
			},
			{
				onRequest: () => {
					submitting = true;
				},
				onError: (ctx) => {
					message = ctx.error.message;
					submitting = false;
				},
				onSuccess: async () => {
					await goto('/');
				}
			}
		);
	}
</script>

<div class="flex flex-col items-center justify-center gap-4">
	<div class="w-full">
		{@render loginForm()}
	</div>
	<div class="h-1 w-full rounded-lg bg-black"></div>
	<OAuthWrapper />
</div>

{#snippet loginForm()}
	<div class="flex w-full flex-col gap-4">
		<FormMessage {message} />
		<div class="flex flex-col gap-1">
			<div class="flex w-full flex-col gap-1">
				<label for="email">E-Mail</label>
				<input
					class={$errors.email ? 'border-error' : 'border-black'}
					name="email"
					type="text"
					id="email"
					onblur={(e) => HandleBlur(e)}
					bind:value={$form.email}
					{...$constraints.email}
				/>
				{#if $errors.email}
					<span class="text-error">{$errors.email}</span>
				{/if}
			</div>
			<div class="flex w-full flex-col gap-1">
				<label for="password">Password</label>
				<input
					class={$errors.password ? 'border-error' : 'border-black'}
					name="password"
					type="password"
					id="password"
					onblur={(e) => HandleBlur(e)}
					bind:value={$form.password}
					{...$constraints.password}
				/>
				{#if $errors.password}
					<span class="text-error">{$errors.password}</span>
				{/if}
			</div>
		</div>
		<button class="btn-form" disabled={submitting} onclick={LogIn}>
			{submitting ? 'Checking credentials' : 'Log In'}
		</button>
	</div>
{/snippet}
