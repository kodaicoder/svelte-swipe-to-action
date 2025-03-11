<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import type { ChangeEventHandler } from 'svelte/elements';

	export type SwipeProps = {
		/** Whether the slider is checked (confirmed). */
		status?: boolean;
		/** The value of the slider. */
		value?: number;
		/** The padding of the container. (pixel unit) (default value is 0) */
		containerPadding?: number;
		/** The color of the container. */
		containerColor?: string;
		/** The border color of the container. */
		containerBorderColor?: string;
		/** The border width of the container.(pixel unit) (default value is 0) */
		containerBorderWidth?: number;
		/** The radius of the container.(pixel unit) (default value is 0) */
		containerRadius?: number;
		/** The class of the container. */
		containerClass?: string;
		/** The color of the track. */
		trackColor?: string;
		/** The color of the track after completed*/
		completeTrackColor?: string;
		/** The border color of the track. */
		trackBorderColor?: string;
		/** The border width of the track. (pixel unit) (default value is 1)*/
		trackBorderWidth?: number;
		/** The radius of the track. (pixel unit) (default value is 0)*/
		trackRadius?: number;
		/** The class of the track. */
		trackClass?: string;
		/** The class of the track on completed */
		completeTrackClass?: string;
		/** The color of the thumb. */
		thumbColor?: string;
		/** The color of the thumb on completed. */
		completeThumbColor?: string;
		/** The radius of the thumb. (pixel unit) (default value is 0)*/
		thumbRadius?: number;
		/** The label displayed on the slider. */
		label?: string;
		/** The color of the label. */
		labelColor?: string;
		/** The class of the label. */
		labelClass?: string;
		/** The label displayed after confirmation. */
		completeLabel?: string;
		/** The color of the label after confirmation. */
		completeLabelColor?: string;
		/** The class of the label after confirmation. */
		completeLabelClass?: string;
		/** The percentage of slide required to confirm (0-100). (default value is 80) */
		threshold?: number;
		/** The width of the slider. (default value is 400) */
		width?: number;
		/** The height of the slider. (default value is 50) */
		height?: number;
		/** Callback function triggered when the slider is checked. */
		oncomplete?: (event: Event, isComplete: boolean, value: number) => void;
		/** Callback function triggered when the slider is canceled. */
		oncancel?: (event: Event, isComplete: boolean, value: number) => void;
		/** Callback function triggered when the slider passes the threshold. */
		onpassthreshold?: (event: Event, side: boolean, value: number) => void;
		/** The icon displayed on the slider thumb.(Svelte Snippet) */
		chevron?: Snippet;
		/** The icon displayed on the slider thumb after confirmation.(Svelte Snippet) */
		checkMark?: Snippet;
		/** Any additional props. */
		[key: string]: unknown;
	};
	let {
		status = $bindable(false),
		value = $bindable(status ? 100 : 0),
		hold = $bindable(false),
		containerPadding = $bindable(0),
		containerColor = $bindable('transparent'),
		containerBorderColor = $bindable('transparent'),
		containerBorderWidth = $bindable(0),
		containerRadius = $bindable(0),
		containerClass = '',
		trackColor = $bindable('#fff'),
		completeTrackColor = $bindable('#4caf50'),
		trackBorderColor = $bindable('transparent'),
		trackBorderWidth = $bindable(1),
		trackRadius = $bindable(0),
		trackClass = '',
		completeTrackClass = '',
		thumbColor = $bindable('#ddd'),
		completeThumbColor = $bindable('#ddd'),
		thumbRadius = $bindable(0),
		label = $bindable('Slide to ...'),
		labelColor = $bindable('#000'),
		labelClass = '',
		completeLabel = $bindable('Complete'),
		completeLabelColor = $bindable('#000'),
		completeLabelClass = '',
		threshold = $bindable(80),
		width = $bindable(400),
		height = $bindable(50),
		oncomplete = () => {},
		oncancel = () => {},
		onpassthreshold = () => {},
		chevron,
		checkMark,
		...rest
	}: SwipeProps = $props();

	let sliderValue = $state(status ? 100 : 0);
	let chevronContainer: HTMLDivElement;
	let checkMarkContainer: HTMLDivElement;
	let chevronUri = $state('');
	let checkMarkUri = $state('');
	let readjustThreshold = $derived.by(() => {
		return threshold > 100 ? (threshold = 100) : threshold;
	});
	// Track threshold passing state
	let hasPassedThresholdForward = $state(false);
	let hasPassedThresholdBackward = $state(false);
	let passThreshold = $derived.by(() => {
		return sliderValue >= readjustThreshold;
	});

	let isComplete = $derived.by(() => {
		if (!hold) {
			return sliderValue >= readjustThreshold;
		} else {
			return false;
		}
	});

	let transitionProgress = $derived.by(() => {
		if (sliderValue >= readjustThreshold - 30) {
			return Math.min(1, (sliderValue - (readjustThreshold - 30)) / 10);
		} else {
			return 0;
		}
	});

	let adjustedProgressWidth = $derived.by(() => {
		const thumbOffset = height / 2.1;
		const availableWidth = width - height;
		const progressPercentage = sliderValue / 100;
		return Math.max(0, Math.min(width, progressPercentage * availableWidth + thumbOffset)) + 'px';
	});
	function oninput(ev: Event) {
		hold = true;
		value = sliderValue;

		const isPastThreshold = sliderValue >= readjustThreshold;

		if (isPastThreshold && !hasPassedThresholdForward) {
			hasPassedThresholdForward = true;
			hasPassedThresholdBackward = false;
			onpassthreshold(ev, true, sliderValue);
		} else if (!isPastThreshold && !hasPassedThresholdBackward) {
			hasPassedThresholdBackward = true;
			hasPassedThresholdForward = false;
			onpassthreshold(ev, false, sliderValue);
		}
	}

	function onchange(ev: Event) {
		hold = false;
		isComplete ? (sliderValue = 100) : (sliderValue = 0);
		if (isComplete) {
			value = 100;
			oncomplete(ev, isComplete, sliderValue);
			hasPassedThresholdForward = false;
			hasPassedThresholdBackward = true;
		} else {
			value = 0;
			oncancel(ev, isComplete, sliderValue);
			hasPassedThresholdForward = true;
			hasPassedThresholdBackward = false;
		}
	}

	onMount(() => {
		if (chevronContainer) {
			const svgHtml = chevronContainer.innerHTML;
			const cleanSvgHtml = svgHtml.replace(/>\s+</g, '><').trim();
			chevronUri = `data:image/svg+xml;base64,${btoa(cleanSvgHtml)}`;
		}
		if (checkMarkContainer) {
			const svgHtml = checkMarkContainer.innerHTML;
			const cleanSvgHtml = svgHtml.replace(/>\s+</g, '><').trim();
			checkMarkUri = `data:image/svg+xml;base64,${btoa(cleanSvgHtml)}`;
		}
	});

	$effect(() => {
		status = isComplete;
	});
</script>

<div bind:this={chevronContainer} style="display: none;">
	{#if chevron}
		{@render chevron()}
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M12.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L17.586 12l-5.293-5.293a1 1 0 0 1 0-1.414m-6 0a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L11.586 12L6.293 6.707a1 1 0 0 1 0-1.414"
			/>
		</svg>
	{/if}
</div>
<div bind:this={checkMarkContainer} style="display: none;">
	{#if checkMark}
		{@render checkMark()}
	{:else}
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M9.86 18a1 1 0 0 1-.73-.32l-4.86-5.17a1 1 0 1 1 1.46-1.37l4.12 4.39l8.41-9.2a1 1 0 1 1 1.48 1.34l-9.14 10a1 1 0 0 1-.73.33Z"
			/>
		</svg>
	{/if}
</div>

<div
	style:--width={width + 'px'}
	style:--height={height + 'px'}
	style:--container__padding={containerPadding + 'px'}
	style:--container__color={`${containerColor}`}
	style:--container__border-color={containerBorderColor}
	style:--container__border-width={containerBorderWidth + 'px'}
	style:--container__radius={containerRadius + 'px'}
	class={`container ${containerClass}`}
>
	<div
		style:--track__color={trackColor}
		style:--track__border-color={trackBorderColor}
		style:--track__border-width={trackBorderWidth + 'px'}
		style:--track__radius={trackRadius + 'px'}
		class={`track ${trackClass}`}
	>
		<p
			class={`label ${labelClass}`}
			style:--label__opacity={(100 - sliderValue * 1.5) / 100}
			style:--label__color={labelColor}
		>
			{label}
		</p>
		<p
			class={`complete_label  ${completeLabelClass}`}
			style:--complete_label__opacity={sliderValue / 100}
			style:--complete_label__color={completeLabelColor}
		>
			{completeLabel}
		</p>

		<div
			class={`progressbar ${completeTrackClass}`}
			style:--progress={adjustedProgressWidth}
			style:--complete_track-color={completeTrackColor}
		></div>
		<input
			{...rest}
			type="range"
			min="0"
			max="100"
			bind:value={sliderValue}
			{oninput}
			{onchange}
			style={`width: ${width}px`}
			style:--thumb__color={passThreshold ? completeThumbColor : thumbColor}
			style:--thumb__radius={thumbRadius + 'px'}
			style:--transitionProgress={transitionProgress}
			style:--icon={sliderValue > threshold ? `url("${checkMarkUri}")` : `url("${chevronUri}")`}
			class={`input-range`}
		/>
	</div>
</div>

<style>
	.container,
	.container > * {
		box-sizing: border-box;
	}
	.container {
		width: fit-content;
		overflow: hidden;
		padding: var(--container__padding);
		background-color: var(--container__color);
		border-radius: var(--container__radius);
		border: var(--container__border-width) solid var(--container__border-color);
	}
	.track {
		width: var(--width);
		height: var(--height);
		position: relative;
		display: flex;
		align-items: center;
		overflow: hidden;
		border-radius: var(--track__radius);
		border: var(--track__border-width) solid var(--track__border-color);
		background-color: var(--track__color, #fff);
	}
	/* Basic styling for the slider track */
	.input-range {
		margin: 0;
		border: 0;
		width: 100%;
		-webkit-appearance: none;
		background: transparent;
		z-index: 20;
		outline: none;
		pointer-events: none;
	}

	/* Style the slider thumb */
	.input-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: var(--height);
		width: var(--height);
		border-radius: var(--thumb__radius);
		background: var(--thumb__color);
		background-image: var(--icon);
		background-size: 60%;
		background-repeat: no-repeat;
		background-position: center;
		cursor: pointer;
		pointer-events: all;
	}

	.input-range::-moz-range-thumb {
		-webkit-appearance: none;
		height: var(--height);
		width: var(--height);
		border-radius: var(--thumb__radius);
		background: var(--thumb__color);
		background-image: var(--icon);
		background-size: 60%;
		background-repeat: no-repeat;
		background-position: center;
		cursor: pointer;
		pointer-events: all;
	}

	.label {
		margin: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 5;
		opacity: var(--label__opacity);
		color: var(--label__color);
	}

	.complete_label {
		margin: 0;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 5;
		opacity: var(--complete_label__opacity);
		color: var(--complete_label__color);
	}

	.progressbar {
		z-index: 0;
		position: absolute;
		height: var(--height);
		width: var(--progress);
		background-color: var(--complete_track-color);
	}
</style>
