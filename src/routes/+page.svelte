<script lang="ts">
	import '../app.postcss';
	import Swipe from '$lib/Swipe.svelte';
	import { HandSwipeRight, Heart } from 'phosphor-svelte';

	let status = $state(false);
	let hold = $state(false);
	let value = $state(0);
	let passThershold = $state();

	let width = $state(400);
	let height = $state(50);
	let rtlMode = $state(false);
	let threshold = $state(80);
	let label = $state('Slide to unlock');
	let completeLabel = $state('Unlocked');

	let containerPadding = $state(2);
	let containerBackgroundColor = $state('#ffffff');
	let containerBorderColor = $state('#000000');
	let containerBorderWidth = $state(2);
	let containerRadius = $state(0);
	let trackBackgroundColor = $state('#ffffff');
	let completeTrackBackgroundColor = $state('#4caf50');
	let trackBorderColor = $state('#000000');
	let trackBorderWidth = $state(1);
	let trackRadius = $state(0);
	let thumbColor = $state('#dddddd');
	let completeThumbColor = $state('#dddddd');
	let thumbRadius = $state(0);
	let labelColor = $state('#000000');
	let completeLabelColor = $state('#000000');

	function onpassthreshold(ev: Event, side: boolean, sliderValue: number) {
		passThershold = side;
	}
	function oncomplete(ev: Event, isComplete: boolean, sliderValue: number) {
		console.log('Complete', isComplete, sliderValue);
	}
	function oncancel(ev: Event, isComplete: boolean, sliderValue: number) {
		console.log('Cancel', isComplete, sliderValue);
	}
</script>

<div class="grid place-content-center my-8">
	<h1 class="font-bold text-3xl text-center mb-3 underline">Svelte-Swipe-To-Action</h1>
	<Swipe
		id="swipeElement"
		bind:status
		bind:value
		bind:hold
		{onpassthreshold}
		{oncomplete}
		{oncancel}
		bind:width
		bind:height
		bind:rtlMode
		bind:threshold
		bind:label
		bind:completeLabel
		bind:containerPadding
		bind:containerColor={containerBackgroundColor}
		bind:containerBorderWidth
		bind:containerBorderColor
		bind:containerRadius
		bind:trackColor={trackBackgroundColor}
		bind:completeTrackColor={completeTrackBackgroundColor}
		bind:trackBorderColor
		bind:trackBorderWidth
		bind:trackRadius
		bind:thumbColor
		bind:completeThumbColor
		bind:thumbRadius
		bind:labelColor
		bind:completeLabelColor
	/>
</div>
<div class="grid grid-cols-1 lg:grid-cols-3 my-8 border border-gray-300 m-4">
	<div class="grid gap-4 p-2 border border-gray-300">
		<h2 class="underline text-xl font-bold">State & Value</h2>
		<p>Swipe status : {status}</p>
		<p>Hold state : {hold}</p>
		<p>Slider Value : {value}</p>
		<p>
			Passed Threshold :
			{#if passThershold !== undefined}
				{passThershold ? 'Complete side' : 'Cancel Side'}
			{/if}
		</p>
	</div>
	<div class="grid gap-4 p-2 border border-gray-300">
		<h2 class="underline text-xl font-bold">Base setting</h2>
		<div>
			Slider width :
			<input id="width" type="number" class="border px-2" min="0" max="1000" bind:value={width} />
			px
		</div>
		<div>
			Slider height :
			<input id="height" type="number" class="border px-2" min="0" max="100" bind:value={height} />
			px
		</div>
		<div>
			Threshold for completion :
			<input
				id="threshold"
				type="number"
				class="border px-2"
				min="0"
				max="100"
				bind:value={threshold}
			/>
			%
		</div>
		<div>
			Label text :
			<input id="label" type="text" class="border px-2" bind:value={label} />
		</div>
		<div>
			Complete label text :
			<input id="completeLabel" type="text" class="border px-2" bind:value={completeLabel} />
		</div>
		<div>
			Right to left mode :
			<input id="rtlMode" type="checkbox" class="size-4" bind:checked={rtlMode} />
		</div>
	</div>
	<div class="grid gap-4 p-2 border border-gray-300">
		<h2 class="underline text-xl font-bold">Container Style</h2>
		<div>
			container padding :
			<input
				id="containerPadding"
				type="number"
				class="border px-2"
				min="0"
				max="100"
				bind:value={containerPadding}
			/>
			px
		</div>
		<div>
			container background color :
			<input
				id="containerBackgroundColor"
				type="color"
				class="border px-2"
				bind:value={containerBackgroundColor}
			/>
		</div>
		<div>
			container border width :
			<input
				id="containerBorderWidth"
				type="number"
				class="border px-2"
				min="0"
				max="100"
				bind:value={containerBorderWidth}
			/>
		</div>
		<div>
			container border color :
			<input
				id="containerBorderColor"
				type="color"
				class="border px-2"
				bind:value={containerBorderColor}
			/>
		</div>
		<div>
			container border radius :
			<input
				id="containerRadius"
				type="number"
				class="border px-2"
				min="0"
				max="999"
				bind:value={containerRadius}
			/>
		</div>
	</div>
	<div class="grid gap-4 p-2 border border-gray-300">
		<h2 class="underline text-xl font-bold">Track Style</h2>

		<div>
			track background color :
			<input
				id="trackBackgroundColor"
				type="color"
				class="border px-2"
				bind:value={trackBackgroundColor}
			/>
		</div>
		<div>
			complete track background color :
			<input
				id="completeTrackBackgroundColor"
				type="color"
				class="border px-2"
				bind:value={completeTrackBackgroundColor}
			/>
		</div>
		<div>
			track border width :
			<input
				id="trackBorderWidth"
				type="number"
				class="border px-2"
				min="0"
				max="100"
				bind:value={trackBorderWidth}
			/> px
		</div>
		<div>
			track border color :
			<input id="trackBorderColor" type="color" class="border px-2" bind:value={trackBorderColor} />
		</div>
		<div>
			track border radius :
			<input
				id="trackRadius"
				type="number"
				class="border px-2"
				min="0"
				max="999"
				bind:value={trackRadius}
			/> px
		</div>
	</div>
	<div class="grid gap-4 p-2 border border-gray-300">
		<h2 class="underline text-xl font-bold">Thumb Style</h2>
		<div>
			thumb color :
			<input id="thumbColor" type="color" class="border px-2" bind:value={thumbColor} />
		</div>
		<div>
			complete thumb color :
			<input
				id="completeThumbColor"
				type="color"
				class="border px-2"
				bind:value={completeThumbColor}
			/>
		</div>
		<div>
			thumb radius :
			<input
				id="thumbRadius"
				type="number"
				class="border px-2"
				min="0"
				max="999"
				bind:value={thumbRadius}
			/> px
		</div>
		<div></div>
	</div>
	<div class="grid gap-4 p-2 border border-gray-300">
		<h2 class="underline text-xl font-bold">Label Style</h2>
		<div>
			label color :
			<input id="labelColor" type="color" class="border px-2" bind:value={labelColor} />
		</div>
		<div>
			complete label color :
			<input
				id="completeLabelColor"
				type="color"
				class="border px-2"
				bind:value={completeLabelColor}
			/>
		</div>
		<div></div>
		<div></div>
		<div></div>
	</div>
</div>

<div class="grid place-content-center my-8">
	<h1 class="font-bold text-3xl text-center mb-3 underline">Custom Icons</h1>
	<Swipe
		id="swipeElementCustomIcon"
		bind:status
		bind:value
		bind:hold
		{onpassthreshold}
		{oncomplete}
		{oncancel}
		bind:width
		bind:height
		bind:threshold
		label="Slide to Love"
		completeLabel="Loved<3"
		bind:containerPadding
		bind:containerColor={containerBackgroundColor}
		bind:containerBorderWidth
		bind:containerBorderColor
		bind:containerRadius
		bind:trackColor={trackBackgroundColor}
		bind:completeTrackColor={completeTrackBackgroundColor}
		bind:trackBorderColor
		bind:trackBorderWidth
		bind:trackRadius
		bind:thumbColor
		bind:completeThumbColor
		bind:thumbRadius
		bind:labelColor
		bind:completeLabelColor
	>
		{#snippet chevron()}
			<HandSwipeRight />
		{/snippet}
		{#snippet checkMark()}
			<Heart color="HotPink" weight="fill" />
		{/snippet}
	</Swipe>
</div>

<style>
	/* Create collapsed borders for grid */
	.grid {
		border-collapse: collapse;
	}

	.grid > div {
		margin: -1px; /* Negative margin trick for border collapse */
	}
</style>
