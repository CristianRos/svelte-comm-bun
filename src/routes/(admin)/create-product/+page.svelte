<script lang="ts">
	import { createProductSchema } from '$lib/schemas/products.js';

	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	import { CldUploadWidget, CldImage } from 'svelte-cloudinary';
	import { PUBLIC_CLOUDINARY_API_KEY, PUBLIC_CLOUDINARY_CLOUD_NAME } from '$env/static/public';

	let { data } = $props();

	let allUploadedImages: string[] = $state([]);

	const { form, constraints, errors, enhance } = superForm(data.form, {
		validators: zod(createProductSchema),
		validationMethod: 'oninput'
	});

	function moveImageUp(idx: number) {
		const movedIndex = idx - 1 < 0 ? $form.images.length - 1 : idx - 1;

		form.update(
			($form) => {
				[$form.images[movedIndex], $form.images[idx]] = [
					$form.images[idx],
					$form.images[movedIndex]
				];

				return $form;
			},
			{ taint: false }
		);
	}

	function moveImageDown(idx: number) {
		const movedIndex = (idx + 1) % $form.images.length;

		form.update(
			($form) => {
				[$form.images[movedIndex], $form.images[idx]] = [
					$form.images[idx],
					$form.images[movedIndex]
				];

				return $form;
			},
			{ taint: false }
		);
	}

	function deleteImage(idx: number) {
		form.update(
			($form) => {
				$form.images = $form.images.filter((_, i) => i !== idx);

				return $form;
			},
			{ taint: false }
		);
	}
</script>

{#snippet productImage(url: string, idx: number)}
	{console.log('Rendering image:', url, 'at index:', idx)}
	<div class="flex flex-row items-center justify-center gap-2">
		<div class="relative">
			<div class="overflow-hidden rounded-xl border">
				<CldImage src={url} alt={url} width={200} height={200} class="size-fit" />
			</div>
			<div class="absolute top-0 -right-14 flex h-full flex-col items-center justify-between">
				<div>
					<button
						class="size-12 cursor-pointer rounded-xl border"
						onclick={(e) => {
							e.preventDefault();
							deleteImage(idx);
						}}
					>
						Delete
					</button>
				</div>
				<div class="flex flex-col gap-2">
					<button
						class="size-12 cursor-pointer rounded-xl border"
						onclick={(e) => {
							e.preventDefault();
							moveImageUp(idx);
						}}
					>
						UP
					</button>
					<button
						class="size-12 cursor-pointer rounded-xl border"
						onclick={(e) => {
							e.preventDefault();
							moveImageDown(idx);
						}}
					>
						DOWN
					</button>
				</div>
			</div>
		</div>
		<div class="hidden">
			<input name="images" bind:value={$form.images[idx]} />
		</div>
	</div>
{/snippet}

{#snippet createProductForm()}
	<form method="POST" use:enhance class="w-full">
		<div class="flex flex-col gap-2">
			<div class="flex w-full flex-col gap-1">
				<label for="name">Name</label>
				<input name="name" type="text" id="name" bind:value={$form.name} {...$constraints.name} />
			</div>
			<div class="flex w-full flex-col gap-1">
				<label for="description">Description</label>
				<textarea
					name="description"
					id="description"
					bind:value={$form.description}
					{...$constraints.description}
					disabled={$form.use_group_description}
				></textarea>
			</div>
			<div class="flex w-full flex-col gap-1">
				<label for="price">Price</label>
				<input
					name="price"
					type="number"
					id="price"
					bind:value={$form.price}
					{...$constraints.price}
				/>
			</div>
			<div class="flex w-full flex-col gap-1">
				<label for="stock">Stock</label>
				<input
					name="stock"
					type="number"
					id="stock"
					bind:value={$form.stock}
					{...$constraints.stock}
				/>
			</div>
			<div class="flex w-full flex-col items-center justify-center gap-1">
				{#each $form.images as img, idx}
					{@render productImage(img, idx)}
				{/each}
			</div>
			<div>
				<CldUploadWidget
					uploadPreset="ml_default"
					signatureEndpoint="/api/sign-cloudinary-params"
					config={{
						cloud: {
							cloudName: PUBLIC_CLOUDINARY_CLOUD_NAME,
							apiKey: PUBLIC_CLOUDINARY_API_KEY
						}
					}}
					onSuccess={(res) => {
						const resInfo = res.info as { public_id: string };
						allUploadedImages.push(resInfo.public_id);

						form.update(
							($form) => {
								const newImages = [...$form.images, resInfo.public_id];

								if (newImages.length > 5) {
									$form.images = newImages.slice(0, 5);
									return $form;
								}

								$form.images = newImages;
								return $form;
							},
							{ taint: false }
						);
					}}
					let:open
					let:isLoading
				>
					<button type="button" class="btn-form" onclick={() => open()} disabled={isLoading}>
						Upload image
					</button>
				</CldUploadWidget>
				{#if $errors.images}
					<span class="text-error">{$errors.images._errors}</span>
				{/if}
			</div>
			<input type="hidden" name="allImages" bind:value={allUploadedImages} />
			<button type="submit" class="btn-form">Create new product</button>
		</div>
	</form>
{/snippet}

<div class="flex flex-col items-center justify-center gap-4 p-12">
	<div class="flex w-md flex-col gap-4 rounded-md border p-4">
		{@render createProductForm()}
	</div>
</div>
