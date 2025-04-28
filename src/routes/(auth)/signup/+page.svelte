<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { signupSchema, type SignupSchema } from '$lib/schemas/auth';

	import OAuthWrapper from '$lib/components/auth/OAuthWrapper.svelte';
	import FormMessage from '$lib/components/auth/FormMessage.svelte';

	let { data } = $props();

	let message = $state('');
	let submitting = $state(false);

	const { form, errors, constraints, validate, validateForm } = superForm(data.form, {
		validators: zod(signupSchema)
	});

	async function HandleBlur(event: FocusEvent) {
		const field = (event.target as HTMLInputElement).name;
		if (field) {
			validate(field as keyof SignupSchema);
		}

		message = '';
	}

	async function SignUp() {
		const res = await validateForm();
		if (!res.valid) {
			return;
		}

		authClient.signUp.email(
			{
				name: $form.username,
				email: $form.email,
				password: $form.password
			},
			{
				onRequest: () => {
					submitting = true;
				},
				onError: (ctx) => {
					submitting = false;
					message = ctx.error.message;
				},
				onSuccess: async () => {
					await goto('/');
				}
			}
		);
	}
</script>

{#snippet signupForm()}
	<div class="flex w-full flex-col gap-4">
		<FormMessage {message} />
		<div class="flex flex-col gap-1">
			<div class="flex w-full flex-col gap-1">
				<label for="email">Username</label>
				<input
					class={$errors.username ? 'border-error' : 'border-black'}
					name="username"
					type="text"
					id="username"
					onblur={(e) => HandleBlur(e)}
					bind:value={$form.username}
					{...$constraints.username}
				/>
				{#if $errors.username}
					<span class="text-error">{$errors.username}</span>
				{/if}
			</div>
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
			<div class="flex w-full flex-col gap-1">
				<label for="passwordConfirmation">Repeat password</label>
				<input
					class={$errors.passwordConfirmation ? 'border-error' : 'border-black'}
					name="passwordConfirmation"
					type="password"
					id="passwordConfirmation"
					onblur={(e) => HandleBlur(e)}
					bind:value={$form.passwordConfirmation}
					{...$constraints.passwordConfirmation}
				/>
				{#if $errors.passwordConfirmation}
					<span class="text-error">{$errors.passwordConfirmation}</span>
				{/if}
			</div>
		</div>
		<button class="btn-form" disabled={submitting} onclick={SignUp}>
			{submitting ? 'Checking credentials' : 'Sign up'}
		</button>
	</div>
{/snippet}

<div class="flex flex-col items-center justify-center gap-4">
	<div class="w-full">
		{@render signupForm()}
	</div>
	<div class="h-1 w-full rounded-lg bg-black"></div>
	<OAuthWrapper />
</div>
