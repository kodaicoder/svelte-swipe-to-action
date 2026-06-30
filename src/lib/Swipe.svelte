<script lang="ts">
	import { type Snippet } from 'svelte';
	import ChevronDoubleRight from './ChevronDoubleRight.svelte';
	import ChevronDoubleLeft from './ChevronDoubleLeft.svelte';
	import CheckmarkCircle from './CheckmarkCircle.svelte';

	export interface SwipeOptions {
		/** The label displayed on the slider. Default: 'Slide to ...' */
		label?: string;
		/** The label displayed after confirmation. Default: 'Complete' */
		completeLabel?: string;
		/** The percentage of slide required to confirm (0-100). Default: 80 */
		threshold?: number;
		/** The width of the slider in pixels. Default: 400 */
		width?: number;
		/** The height of the slider in pixels. Default: 50 */
		height?: number;
		/** Right-to-left mode. Default: false */
		rtlMode?: boolean;

		// Track
		trackColor?: string;
		completeTrackColor?: string;
		trackBorderColor?: string;
		trackBorderWidth?: number;
		trackRadius?: number;
		trackClass?: string;
		completeTrackClass?: string;

		// Thumb
		thumbColor?: string;
		completeThumbColor?: string;
		thumbRadius?: number;

		// Label styling
		labelColor?: string;
		labelClass?: string;
		completeLabelColor?: string;
		completeLabelClass?: string;

		/** Text size preset for label & completeLabel: 'xs' | 'sm' | 'md' | 'lg' | 'xl'. Scales with height. Default: 'md' */
		labelSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	}

	export type SwipeProps = {
		/** Whether the slider is checked (confirmed). */
		status?: boolean;
		/** The value of the slider. */
		value?: number;
		/** Whether the slider is being held. */
		hold?: boolean;

		/** All appearance/layout options in one object. */
		options?: SwipeOptions;

		/** Callback function triggered when the slider value changes while dragging. */
		oninput?: (event: Event, value: number) => void;
		/** Callback function triggered when the slider is checked. */
		oncomplete?: (event: Event, isComplete: boolean, value: number) => void;
		/** Callback function triggered when the slider is canceled. */
		oncancel?: (event: Event, isComplete: boolean, value: number) => void;
		/** Callback function triggered when the slider passes the threshold. */
		onpassthreshold?: (event: Event, side: boolean, value: number) => void;
		/** The icon displayed on the slider thumb.(Svelte Snippet) */
		chevronIcon?: Snippet;
		/** The icon displayed on the slider thumb after confirmation.(Svelte Snippet) */
		completeIcon?: Snippet;
		/** Raw SVG markup for the chevron icon (used instead of snippet when provided). */
		chevronIconSvg?: string;
		/** Raw SVG markup for the complete icon. */
		completeIconSvg?: string;
		/** Any additional props. */
		[key: string]: unknown;
	};
	let {
		status = $bindable(false),
		value = $bindable(status ? 100 : 0),
		hold = $bindable(false),
		options = {},
		oninput = () => {},
		oncomplete = () => {},
		oncancel = () => {},
		onpassthreshold = () => {},
		chevronIcon,
		completeIcon,
		chevronIconSvg,
		completeIconSvg,
		...rest
	}: SwipeProps = $props();

	const label = $derived(options.label ?? 'Slide to ...');
	const completeLabel = $derived(options.completeLabel ?? 'Complete');
	const threshold = $derived(options.threshold ?? 80);
	const width = $derived(options.width ?? 400);
	const height = $derived(options.height ?? 50);
	const rtlMode = $derived(options.rtlMode ?? false);
	const trackColor = $derived(options.trackColor ?? '#ffffff');
	const completeTrackColor = $derived(options.completeTrackColor ?? '#4caf50');
	const trackBorderColor = $derived(options.trackBorderColor ?? 'transparent');
	const trackBorderWidth = $derived(options.trackBorderWidth ?? 1);
	const trackRadius = $derived(options.trackRadius ?? 0);
	const trackClass = $derived(options.trackClass ?? '');
	const completeTrackClass = $derived(options.completeTrackClass ?? '');
	const thumbColor = $derived(options.thumbColor ?? '#dddddd');
	const completeThumbColor = $derived(options.completeThumbColor ?? '#dddddd');
	const thumbRadius = $derived(options.thumbRadius ?? 0);
	const labelColor = $derived(options.labelColor ?? '#000000');
	const labelClass = $derived(options.labelClass ?? '');
	const completeLabelColor = $derived(options.completeLabelColor ?? '#000000');
	const completeLabelClass = $derived(options.completeLabelClass ?? '');
	const labelSize = $derived(options.labelSize ?? 'md');
	const labelSizeMap: Record<string, number> = { xs: 0.2, sm: 0.28, md: 0.35, lg: 0.45, xl: 0.55 };
	let labelFontSize = $derived(`clamp(10px, ${height * (labelSizeMap[labelSize] ?? 0.35)}px, 24px)`);

	let sliderValue = $state(status ? 100 : 0);
	let focused = $state(false);

	$effect(() => {
		sliderValue = status ? 100 : 0;
	});

	let chevronContainer: HTMLDivElement;
	let checkMarkContainer: HTMLDivElement;
	let chevronUri = $state('');
	let checkMarkUri = $state('');
	let readjustThreshold = $derived.by(() => Math.min(threshold, 100));

	function toBase64(str: string): string {
		const bytes = new TextEncoder().encode(str);
		const binString = String.fromCharCode(...bytes);
		return btoa(binString);
	}
	// Track threshold passing state
	let hasPassedThresholdForward = $state(false);
	let hasPassedThresholdBackward = $state(false);
	let passThreshold = $derived.by(() => {
		return sliderValue >= readjustThreshold;
	});

	let adjustedProgressWidth = $derived.by(() => {
		const thumbOffset = height / 2.1;
		const availableWidth = width - height;
		const progressPercentage = sliderValue / 100;
		return Math.max(0, Math.min(width, progressPercentage * availableWidth + thumbOffset)) + 'px';
	});
	function handleInput(ev: Event) {
		value = sliderValue;
		oninput(ev, sliderValue);

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
		const completed = sliderValue >= readjustThreshold;
		completed ? (sliderValue = 100) : (sliderValue = 0);
		if (completed) {
			status = true;
			value = 100;
			oncomplete(ev, true, sliderValue);
			hasPassedThresholdForward = false;
			hasPassedThresholdBackward = true;
		} else {
			status = false;
			value = 0;
			oncancel(ev, false, sliderValue);
			hasPassedThresholdForward = true;
			hasPassedThresholdBackward = false;
		}
	}

	function onkeyup(ev: KeyboardEvent) {
		if (ev.key.toLowerCase() !== 'enter') {
			ev.preventDefault();
			return;
		}
		if (!status) {
			status = true;
			value = 100;
			sliderValue = 100;
			onpassthreshold(ev, true, sliderValue);
		} else {
			status = false;
			value = 0;
			sliderValue = 0;
			onpassthreshold(ev, false, sliderValue);
		}
		onchange(ev);
	}

	$effect(() => {
		rtlMode;

		if (chevronIconSvg) {
			chevronUri = `data:image/svg+xml;base64,${toBase64(chevronIconSvg.trim())}`;
		} else if (chevronContainer) {
			const svgHtml = chevronContainer.innerHTML;
			const cleanSvgHtml = svgHtml.replace(/>\s+</g, '><').trim();
			chevronUri = `data:image/svg+xml;base64,${toBase64(cleanSvgHtml)}`;
		}

		if (completeIconSvg) {
			checkMarkUri = `data:image/svg+xml;base64,${toBase64(completeIconSvg.trim())}`;
		} else if (checkMarkContainer) {
			const svgHtml = checkMarkContainer.innerHTML;
			const cleanSvgHtml = svgHtml.replace(/>\s+</g, '><').trim();
			checkMarkUri = `data:image/svg+xml;base64,${toBase64(cleanSvgHtml)}`;
		}
	});
</script>

<div bind:this={chevronContainer} style="display: none;">
	{#if chevronIcon}
		{@render chevronIcon()}
	{:else}
		{#if rtlMode}
			<ChevronDoubleLeft />
		{:else}
			<ChevronDoubleRight />
		{/if}
	{/if}
</div>
<div bind:this={checkMarkContainer} style="display: none;">
	{#if completeIcon}
		{@render completeIcon()}
	{:else}
		<CheckmarkCircle />
	{/if}
</div>

<div
	style:--width={width + 'px'}
	style:--height={height + 'px'}
	dir={rtlMode ? 'rtl' : undefined}
	style:--track__color={trackColor}
	style:--track__border-color={trackBorderColor}
	style:--track__border-width={trackBorderWidth + 'px'}
	style:--track__radius={trackRadius + 'px'}
	class={`track ${trackClass}`.trim()}
	class:focused
	style:--label__font-size={labelFontSize}
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
		aria-hidden="true"
		style:left={rtlMode ? undefined : '0'}
		style:right={rtlMode ? '0' : undefined}
		style:--progress={adjustedProgressWidth}
		style:--complete_track-color={completeTrackColor}
	></div>
	<input
		{...rest}
		type="range"
		onpointerdown={() => (hold = true)}
		onpointerup={() => (hold = false)}
		onpointercancel={() => (hold = false)}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
		min="0"
		max="100"
		aria-label={label}
		aria-valuemin="0"
		aria-valuemax="100"
		aria-valuenow={sliderValue}
		aria-valuetext={status ? completeLabel : label}
		aria-live="assertive"
		aria-disabled={!!rest.disabled}
		bind:value={sliderValue}
		oninput={handleInput}
		{onchange}
		{onkeyup}
		style={`width: ${width}px`}
		style:--thumb__color={passThreshold ? completeThumbColor : thumbColor}
		style:--thumb__radius={thumbRadius + 'px'}
		style:--thumb__hold={hold
			? 'inset 2px 2px 4px rgba(0,0,0,0.3), 1px 1px 2px rgba(0,0,0,0.2)'
			: '0 1px 3px rgba(0,0,0,0.15)'}
		style:--icon={sliderValue > readjustThreshold
			? `url("${checkMarkUri}")`
			: `url("${chevronUri}")`}
		class={`input-range`}
	/>
</div>

<style>
	.track,
	.track > * {
		box-sizing: border-box;
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
	.track:has(.input-range:focus),
	.track.focused {
		outline: 2px solid var(--track__border-color, black);
		outline-offset: 2px;
	}
	/* Basic styling for the slider track */
	.input-range {
		margin: 0;
		border: 0;
		width: 100%;
		-webkit-appearance: none;
		appearance: none;
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
		box-shadow: var(--thumb__hold);
		transition: box-shadow 0.1s ease;
	}

	.input-range::-moz-range-thumb {
		appearance: none;
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
		box-shadow: var(--thumb__hold);
		transition: box-shadow 0.1s ease;
	}

	.input-range:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.input-range:disabled::-webkit-slider-thumb {
		cursor: not-allowed;
	}

	.input-range:disabled::-moz-range-thumb {
		cursor: not-allowed;
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
		font-size: var(--label__font-size);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: calc(100% - var(--height) * 1.4);
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
		font-size: var(--label__font-size);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: calc(100% - var(--height) * 1.4);
	}

	.progressbar {
		z-index: 0;
		position: absolute;
		height: var(--height);
		width: var(--progress);
		background-color: var(--complete_track-color);
	}
</style>
