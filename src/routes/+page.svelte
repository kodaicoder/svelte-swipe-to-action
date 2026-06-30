<script lang="ts">
	import '../app.css';
	import Swipe from '$lib/Swipe.svelte';
	import type { SwipeOptions } from '$lib/Swipe.svelte';
	import { GithubLogoIcon, EyedropperIcon } from 'phosphor-svelte';

	// ── State ────────────────────────────────────────────────
	let status = $state(false);
	let hold = $state(false);
	let value = $state(0);
	let passThreshold = $derived(status);
	let previewBg = $state('#111827');
	let customIcons = $state(false);
	let chevronSvg = $state(
		`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M230.33,141.06a24.34,24.34,0,0,0-18.61-4.77C230.5,117.33,240,98.48,240,80c0-26.47-21.29-48-47.46-48A47.58,47.58,0,0,0,156,48.75,47.58,47.58,0,0,0,119.46,32C93.29,32,72,53.53,72,80c0,11,3.24,21.69,10.06,33a31.87,31.87,0,0,0-14.75,8.4L44.69,144H16A16,16,0,0,0,0,160v40a16,16,0,0,0,16,16H120a7.93,7.93,0,0,0,1.94-.24l64-16a6.94,6.94,0,0,0,1.19-.4L226,182.82l.44-.2a24.6,24.6,0,0,0,3.93-41.56ZM119.46,48A31.15,31.15,0,0,1,148.6,67a8,8,0,0,0,14.8,0,31.15,31.15,0,0,1,29.14-19C209.59,48,224,62.65,224,80c0,19.51-15.79,41.58-45.66,63.9l-11.09,2.55A28,28,0,0,0,140,112H100.68C92.05,100.36,88,90.12,88,80,88,62.65,102.41,48,119.46,48ZM16,160H40v40H16Zm203.43,8.21-38,16.18L119,200H56V155.31l22.63-22.62A15.86,15.86,0,0,1,89.94,128H140a12,12,0,0,1,0,24H112a8,8,0,0,0,0,16h32a8.32,8.32,0,0,0,1.79-.2l67-15.41.31-.08a8.6,8.6,0,0,1,6.3,15.9Z"></path></svg>`
	);
	let completeSvg = $state(
		`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M178,40c-20.65,0-38.73,8.88-50,23.89C116.73,48.88,98.65,40,78,40a62.07,62.07,0,0,0-62,62c0,70,103.79,126.66,108.21,129a8,8,0,0,0,7.58,0C136.21,228.66,240,172,240,102A62.07,62.07,0,0,0,178,40ZM128,214.8C109.74,204.16,32,155.69,32,102A46.06,46.06,0,0,1,78,56c19.45,0,35.78,10.36,42.6,27a8,8,0,0,0,14.8,0c6.82-16.67,23.15-27,42.6-27a46.06,46.06,0,0,1,46,46C224,155.61,146.24,204.15,128,214.8Z"></path></svg>`
	);

	let opts = $state<SwipeOptions>({
		width: 400,
		height: 56,
		threshold: 75,
		label: 'Slide to confirm',
		completeLabel: 'Confirmed!',
		trackColor: '#f3f4f6',
		completeTrackColor: '#22c55e',
		trackBorderColor: '#d1d5db',
		trackBorderWidth: 1,
		trackRadius: 10,
		thumbColor: '#6b7280',
		completeThumbColor: '#16a34a',
		thumbRadius: 8,
		labelColor: '#6b7280',
		completeLabelColor: '#ffffff',
		labelSize: 'md'
	});

	let events = $state<{ type: string; time: string; detail: string }[]>([]);

	function logEvent(type: string, detail: string) {
		const time = new Date().toLocaleTimeString();
		events = [{ type, time, detail }, ...events].slice(0, 10);
	}

	function oncomplete(ev: Event, isComplete: boolean, value: number) {
		logEvent('complete', `isComplete=${isComplete}, value=${value}`);
	}
	function oncancel(ev: Event, isComplete: boolean, value: number) {
		logEvent('cancel', `isComplete=${isComplete}, value=${value}`);
	}
	function oninput(ev: Event, value: number) {
		logEvent('input', `value=${value}`);
	}
	function onpassthreshold(ev: Event, side: boolean, value: number) {
		passThreshold = side;
		logEvent('pass threshold', `side=${side}, value=${value}`);
	}

	// ── Presets ──────────────────────────────────────────────
	const presets = $state([
		{
			label: 'Default',
			opts: {
				trackColor: '#f3f4f6',
				completeTrackColor: '#22c55e',
				thumbColor: '#6b7280',
				completeThumbColor: '#16a34a',
				label: 'Slide to confirm',
				completeLabel: 'Confirmed!',
				labelColor: '#6b7280',
				completeLabelColor: '#ffffff'
			}
		},
		{
			label: 'Danger',
			opts: {
				trackColor: '#fef2f2',
				completeTrackColor: '#ef4444',
				thumbColor: '#dc2626',
				completeThumbColor: '#b91c1c',
				label: 'Slide to delete',
				completeLabel: 'Deleted!',
				labelColor: '#dc2626',
				completeLabelColor: '#ffffff'
			}
		},
		{
			label: 'Love',
			opts: {
				trackColor: '#fdf2f8',
				completeTrackColor: '#ec4899',
				thumbColor: '#db2777',
				completeThumbColor: '#be185d',
				label: 'Slide to love',
				completeLabel: 'Loved!',
				labelColor: '#db2777',
				completeLabelColor: '#ffffff'
			}
		},
		{
			label: 'Dark',
			opts: {
				trackColor: '#1f2937',
				completeTrackColor: '#6366f1',
				thumbColor: '#4b5563',
				completeThumbColor: '#4338ca',
				label: 'Slide to activate',
				completeLabel: 'Active!',
				labelColor: '#9ca3af',
				completeLabelColor: '#ffffff'
			}
		}
	]);

	function applyPreset(idx: number) {
		Object.assign(opts, presets[idx].opts);
	}

	const defaultOpts: SwipeOptions = {
		width: 400,
		height: 56,
		threshold: 75,
		label: 'Slide to confirm',
		completeLabel: 'Confirmed!',
		trackColor: '#f3f4f6',
		completeTrackColor: '#22c55e',
		trackBorderColor: '#d1d5db',
		trackBorderWidth: 1,
		trackRadius: 10,
		thumbColor: '#6b7280',
		completeThumbColor: '#16a34a',
		thumbRadius: 8,
		labelColor: '#6b7280',
		completeLabelColor: '#ffffff',
		labelSize: 'md'
	};

	// ── Code output ──────────────────────────────────────────
	const codeOutput = $derived(JSON.stringify(opts, null, 2));

	let copied = $state(false);
	let lang = $state<'ts' | 'js'>('ts');

	const usageCode = $derived.by(() => {
		const indent = codeOutput.replace(/\n/g, '\n  ');
		const svgVars = customIcons
			? "  const chevronIconSvg = '<svg>...</svg>';\n" +
				"  const completeIconSvg = '<svg>...</svg>';\n"
			: '';

		const iconBlock = customIcons
			? '<!-- Approach 1: string props (fully reactive, no extra deps) -->\n' +
				'<Swipe\n' +
				'  options={opts}\n' +
				'  bind:status\n' +
				'  chevronIconSvg={chevronIconSvg}\n' +
				'  completeIconSvg={completeIconSvg}\n' +
				'/>\n\n' +
				'<!-- Approach 2: snippets (for Svelte components like phosphor-svelte) -->\n' +
				'<Swipe options={opts} bind:status>\n' +
				'  {#snippet chevronIcon()}\n' +
				'    <HandSwipeRight />\n' +
				'  {/snippet}\n' +
				'  {#snippet completeIcon()}\n' +
				'    <Heart color="HotPink" weight="fill" />\n' +
				'  {/snippet}\n' +
				'</' +
				'Swipe>'
			: '<Swipe\n' + '  options={opts}\n' + '  bind:status\n' + '/>';

		const base = (ts: boolean) =>
			(ts
				? '<script lang="ts">\n' +
					"  import Swipe from 'svelte-swipe-to-action';\n" +
					"  import type { SwipeOptions } from 'svelte-swipe-to-action';\n" +
					'  let status = $state(false);\n' +
					'  const opts: SwipeOptions = ' +
					indent +
					';\n' +
					svgVars +
					'</' +
					'script>\n\n'
				: '<script>\n' +
					"  import Swipe from 'svelte-swipe-to-action';\n" +
					'  let status = $state(false);\n' +
					'  const opts = ' +
					indent +
					';\n' +
					svgVars +
					'</' +
					'script>\n\n') + iconBlock;

		const ts = base(true);
		const js = base(false);

		return lang === 'ts' ? ts : js;
	});

	async function copyCode() {
		await navigator.clipboard.writeText(codeOutput);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	async function copyUsage() {
		await navigator.clipboard.writeText(usageCode);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	const installCmd = 'npm i svelte-swipe-to-action';

	async function copyInstall() {
		await navigator.clipboard.writeText(installCmd);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<svelte:head>
	<title>Svelte Swipe To Action</title>
	<meta name="description" content="A highly customizable swipe-to-action component for Svelte 5" />
	<meta
		name="keywords"
		content="svelte, swipe, action, svelte-swipe, svelte-component, svelte-5, swipe-to-action, slide-to-confirm, component-library, typescript"
	/>
	<!-- Open Graph -->
	<meta property="og:title" content="Svelte Swipe To Action" />
	<meta
		property="og:description"
		content="A highly customizable swipe-to-action component for Svelte 5"
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://svelte-swipe-ashy.vercel.app/" />
	<meta
		property="og:image"
		content="https://svelte-swipe-ashy.vercel.app/icons/svelte-swipe-to-action_icon.webp"
	/>
	<meta property="og:image:width" content="512" />
	<meta property="og:image:height" content="512" />
	<meta property="og:site_name" content="Svelte Swipe To Action" />
	<meta property="og:locale" content="en_US" />
	<!-- Twitter -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Svelte Swipe To Action" />
	<meta
		name="twitter:description"
		content="A highly customizable swipe-to-action component for Svelte 5"
	/>
	<meta
		name="twitter:image"
		content="https://svelte-swipe-ashy.vercel.app/icons/svelte-swipe-to-action_icon.webp"
	/>
	<!-- Favicons -->
	<link rel="icon" type="image/png" href="/icons/favicons/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/icons/favicons/favicon.svg" />
	<link rel="apple-touch-icon" sizes="180x180" href="/icons/favicons/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Svelte Swipe" />
	<link rel="manifest" href="/icons/favicons/site.webmanifest" />
</svelte:head>

<!-- ════════════════ HEADER ═══════════════════════ -->
<div class="min-h-screen bg-gray-950 text-gray-100">
	<header class="border-b border-gray-800 px-6 py-8">
		<div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
			<div>
				<h1 class="text-3xl font-bold tracking-tight flex items-center gap-3">
					<img src="/icons/svelte-swipe-to-action_icon.webp" alt="" class="w-9 h-9 rounded" />
					Svelte Swipe To Action
				</h1>
				<p class="text-gray-400 mt-1">
					A highly customizable swipe-to-action component for Svelte 5
				</p>
			</div>
			<div class="flex items-center gap-3">
				<code class="bg-gray-800 text-sm text-gray-300 px-3 py-1.5 rounded-md select-all"
					>{installCmd}</code
				>
				<button
					onclick={copyInstall}
					class="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1.5 rounded-md transition-colors cursor-pointer"
				>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
		</div>
	</header>

	<!-- ════════════ MAIN LAYOUT ════════════ -->
	<div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
		<!-- ─── A: Component Showcase ──────────── -->
		<section
			class="rounded-xl p-4 md:p-6 border border-gray-800 flex flex-col items-center gap-6 transition-colors"
			style:background-color={previewBg}
		>
			<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide self-start">
				Preview
			</h3>
			<div class="flex w-full overflow-auto">
				<div class="mx-auto py-4 rounded-xl">
					{#if customIcons}
						<Swipe
							id="swipeElement"
							bind:status
							bind:value
							bind:hold
							options={opts}
							chevronIconSvg={chevronSvg}
							completeIconSvg={completeSvg}
							{oninput}
							{oncomplete}
							{oncancel}
							{onpassthreshold}
						/>
					{:else}
						<Swipe
							id="swipeElement"
							bind:status
							bind:value
							bind:hold
							options={opts}
							{oninput}
							{oncomplete}
							{oncancel}
							{onpassthreshold}
						/>
					{/if}
				</div>
			</div>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center w-full max-w-sm">
				<div class="bg-gray-800 rounded-lg p-2">
					<div class="text-xs text-gray-500">STATUS</div>
					<div
						class="text-sm font-mono"
						class:text-green-400={status}
						class:text-gray-400={!status}
						data-testid="state-status"
					>
						{status ? 'complete' : 'pending'}
					</div>
				</div>
				<div class="bg-gray-800 rounded-lg p-2">
					<div class="text-xs text-gray-500">VALUE</div>
					<div class="text-sm font-mono" data-testid="state-value">{value}</div>
				</div>
				<div class="bg-gray-800 rounded-lg p-2">
					<div class="text-xs text-gray-500">HOLD</div>
					<div
						class="text-sm font-mono"
						class:text-yellow-400={hold}
						class:text-gray-400={!hold}
						data-testid="state-hold"
					>
						{hold ? 'yes' : 'no'}
					</div>
				</div>
				<div class="bg-gray-800 rounded-lg p-2">
					<div class="text-xs text-gray-500">THRESHOLD</div>
					<div
						class="text-sm font-mono"
						class:text-green-400={passThreshold === true}
						class:text-red-400={passThreshold === false}
						class:text-gray-400={passThreshold === undefined}
						data-testid="state-threshold"
					>
						{passThreshold === undefined ? '—' : passThreshold ? 'passed' : 'below'}
					</div>
				</div>
			</div>

			<label class="text-xs text-gray-400 flex items-center gap-2">
				<label class="flex gap-1 justify-center items-center">
					<input
						type="color"
						bind:value={previewBg}
						class="w-6 h-6 rounded cursor-pointer border border-gray-600"
						data-testid="preview-bg-input"
					/>
					<span class="inline-flex align-middle">
						<EyedropperIcon size={18} />Preview background</span
					>
				</label>
				<button
					onclick={() => (previewBg = '#111827')}
					class="rounded text-[10px] text-gray-500 py-1 px-2 hover:bg-red-400 ml-1 cursor-pointer"
				>
					reset
				</button>
			</label>
		</section>

		<!-- ─── B: Events Log ──────────────────── -->
		<section class="bg-gray-900 rounded-xl p-5 border border-gray-800">
			<h3
				class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3"
				data-testid="events-heading"
			>
				Events
			</h3>
			{#if events.length === 0}
				<p class="text-xs text-gray-600">Interact with the slider to see events</p>
			{:else}
				<div class="space-y-1 max-h-56 overflow-y-auto" data-testid="events-list">
					{#each events as evt}
						<div class="flex items-center gap-3 text-xs font-mono">
							<span class="text-gray-600">{evt.time}</span>
							<span
								class="px-1.5 py-0.5 rounded text-[10px]"
								class:bg-green-900={evt.type === 'complete'}
								class:text-green-300={evt.type === 'complete'}
								class:bg-red-900={evt.type === 'cancel'}
								class:text-red-300={evt.type === 'cancel'}
								class:bg-blue-900={evt.type === 'input'}
								class:text-blue-300={evt.type === 'input'}
							>
								{evt.type}
							</span>
							<span class="text-gray-400">{evt.detail}</span>
						</div>
					{/each}
				</div>
			{/if}
		</section>

		<!-- ─── C: Controller ──────────────────── -->
		<aside class="space-y-6">
			<!-- Presets -->
			<div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
				<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Presets</h3>
				<div class="flex flex-wrap gap-2">
					{#each presets as preset, idx}
						<button
							onclick={() => applyPreset(idx)}
							class="text-xs px-3 py-1.5 rounded-full border border-gray-700 hover:border-gray-500 transition-colors cursor-pointer"
							data-testid={`preset-${preset.label.toLowerCase()}`}
						>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Slider settings -->
			<div class="bg-gray-900 rounded-xl p-5 border border-gray-800 space-y-4">
				<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Slider</h3>
				<div class="grid grid-cols-2 gap-3">
					<label class="text-xs text-gray-400">
						Width <span class="text-gray-600">{opts.width}px</span>
						<input
							type="range"
							min="200"
							max="600"
							bind:value={opts.width}
							class="w-full mt-1 accent-green-500"
							data-testid="input-width"
						/>
					</label>
					<label class="text-xs text-gray-400">
						Height <span class="text-gray-600">{opts.height}px</span>
						<input
							type="range"
							min="32"
							max="80"
							bind:value={opts.height}
							class="w-full mt-1 accent-green-500"
							data-testid="input-height"
						/>
					</label>
				</div>
				<label class="text-xs text-gray-400 block">
					Threshold <span class="text-gray-600">{opts.threshold}%</span>
					<input
						type="range"
						min="30"
						max="100"
						bind:value={opts.threshold}
						class="w-full mt-1 accent-green-500"
						data-testid="input-threshold"
					/>
				</label>
				<div class="grid grid-cols-2 gap-3">
					<label class="text-xs text-gray-400 block">
						Label
						<input
							type="text"
							bind:value={opts.label}
							class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
							data-testid="input-label"
						/>
					</label>
					<label class="text-xs text-gray-400 block">
						Complete label
						<input
							type="text"
							bind:value={opts.completeLabel}
							class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
							data-testid="input-complete-label"
						/>
					</label>
				</div>
				<label class="text-xs text-gray-400 flex items-center gap-2">
					<input
						type="checkbox"
						bind:checked={opts.rtlMode}
						class="accent-green-500"
						data-testid="checkbox-rtl"
					/>
					Right-to-left mode
				</label>
				<label class="text-xs text-gray-400 block mt-3">
					Label text size
					<select
						bind:value={opts.labelSize}
						class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
						data-testid="select-label-size"
					>
						<option value="xs">xs</option>
						<option value="sm">sm</option>
						<option value="md">md</option>
						<option value="lg">lg</option>
						<option value="xl">xl</option>
					</select>
				</label>
			</div>

			<!-- Colors -->
			<div class="bg-gray-900 rounded-xl p-5 border border-gray-800 space-y-4">
				<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Colors</h3>
				<div class="grid grid-cols-2 gap-3">
					<label class="text-xs text-gray-400 flex items-center gap-2">
						<input
							type="color"
							bind:value={opts.trackColor}
							class="w-6 h-6 rounded cursor-pointer border border-gray-600"
							data-testid="color-track-bg"
						/>
						<span class="inline-flex align-middle">
							<EyedropperIcon size={18} />&nbsp;Track bg
						</span>
					</label>
					<label class="text-xs text-gray-400 flex items-center gap-2">
						<input
							type="color"
							bind:value={opts.completeTrackColor}
							class="w-6 h-6 rounded cursor-pointer border border-gray-600"
							data-testid="color-track-done"
						/>
						<span class="inline-flex align-middle">
							<EyedropperIcon size={18} />&nbsp;Track done
						</span>
					</label>
					<label class="text-xs text-gray-400 flex items-center gap-2">
						<input
							type="color"
							bind:value={opts.trackBorderColor}
							class="w-6 h-6 rounded cursor-pointer border border-gray-600"
							data-testid="color-track-border"
						/>
						<span class="inline-flex align-middle">
							<EyedropperIcon size={18} />&nbsp;Track border
						</span>
					</label>
					<label class="text-xs text-gray-400 flex items-center gap-2">
						<input
							type="color"
							bind:value={opts.thumbColor}
							class="w-6 h-6 rounded cursor-pointer border border-gray-600"
							data-testid="color-thumb"
						/>
						<span class="inline-flex align-middle">
							<EyedropperIcon size={18} />&nbsp;Thumb
						</span>
					</label>
					<label class="text-xs text-gray-400 flex items-center gap-2">
						<input
							type="color"
							bind:value={opts.completeThumbColor}
							class="w-6 h-6 rounded cursor-pointer border border-gray-600"
							data-testid="color-thumb-done"
						/>
						<span class="inline-flex align-middle">
							<EyedropperIcon size={18} />&nbsp;Thumb done
						</span>
					</label>
					<label class="text-xs text-gray-400 flex items-center gap-2">
						<input
							type="color"
							bind:value={opts.labelColor}
							class="w-6 h-6 rounded cursor-pointer border border-gray-600"
							data-testid="color-label"
						/>
						<span class="inline-flex align-middle">
							<EyedropperIcon size={18} />&nbsp;Label
						</span>
					</label>
					<label class="text-xs text-gray-400 flex items-center gap-2">
						<input
							type="color"
							bind:value={opts.completeLabelColor}
							class="w-6 h-6 rounded cursor-pointer border border-gray-600"
							data-testid="color-done-label"
						/>
						<span class="inline-flex align-middle">
							<EyedropperIcon size={18} />&nbsp;Done label
						</span>
					</label>
				</div>
				<div class="grid grid-cols-3 gap-3">
					<label class="text-xs text-gray-400 block">
						Track border px
						<input
							type="number"
							min="0"
							max="10"
							bind:value={opts.trackBorderWidth}
							class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
							data-testid="input-track-border-width"
						/>
					</label>
					<label class="text-xs text-gray-400 block">
						Track radius px
						<input
							type="number"
							min="0"
							max="50"
							bind:value={opts.trackRadius}
							class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
							data-testid="input-track-radius"
						/>
					</label>
					<label class="text-xs text-gray-400 block">
						Thumb radius px
						<input
							type="number"
							min="0"
							max="50"
							bind:value={opts.thumbRadius}
							class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
							data-testid="input-thumb-radius"
						/>
					</label>
				</div>
			</div>

			<!-- Customize Icon -->
			<div class="bg-gray-900 rounded-xl p-5 border border-gray-800 space-y-4">
				<div class="flex items-center justify-between">
					<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">
						Customize Icon
					</h3>
					<label class="text-xs text-gray-400 flex items-center gap-2 cursor-pointer">
						<input type="checkbox" bind:checked={customIcons} class="accent-green-500" />
						Enable
					</label>
				</div>
				{#if customIcons}
					<div class="space-y-3">
						<label class="text-xs text-gray-400 block">
							Chevron SVG
							<textarea
								bind:value={chevronSvg}
								rows="3"
								class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 font-mono resize-none"
							></textarea>
						</label>
						<label class="text-xs text-gray-400 block">
							Complete SVG
							<textarea
								bind:value={completeSvg}
								rows="3"
								class="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs text-gray-200 font-mono resize-none"
							></textarea>
						</label>
					</div>
				{/if}
			</div>
		</aside>

		<!-- ─── D: Options + Usage ─────────────── -->
		<section class="space-y-4">
			<div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
				<div class="flex items-center justify-between mb-3">
					<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Options</h3>
					<button
						onclick={copyCode}
						class="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md transition-colors cursor-pointer"
					>
						{copied ? 'Copied!' : 'Copy JSON'}
					</button>
				</div>
				<pre
					class="text-xs text-gray-300 bg-gray-950 rounded-lg p-4 overflow-auto max-h-80 font-mono leading-relaxed">{codeOutput}</pre>
			</div>

			<div class="bg-gray-900 rounded-xl p-5 border border-gray-800">
				<div class="flex items-center justify-between mb-3">
					<div class="flex items-center gap-2">
						<h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wide">Usage</h3>
						<button
							onclick={() => (lang = 'ts')}
							class="text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer"
							class:bg-green-900={lang === 'ts'}
							class:text-green-300={lang === 'ts'}
							class:border-green-700={lang === 'ts'}
							class:border-gray-700={lang !== 'ts'}
							class:text-gray-500={lang !== 'ts'}
						>
							TS
						</button>
						<button
							onclick={() => (lang = 'js')}
							class="text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer"
							class:bg-yellow-900={lang === 'js'}
							class:text-yellow-300={lang === 'js'}
							class:border-yellow-700={lang === 'js'}
							class:border-gray-700={lang !== 'js'}
							class:text-gray-500={lang !== 'js'}
						>
							JS
						</button>
					</div>
					<button
						onclick={copyUsage}
						class="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md transition-colors cursor-pointer"
					>
						{copied ? 'Copied!' : 'Copy Code'}
					</button>
				</div>
				<pre
					class="text-xs text-gray-300 bg-gray-950 rounded-lg p-4 overflow-auto max-h-80 font-mono leading-relaxed">{usageCode}</pre>
			</div>
		</section>
	</div>

	<!-- ════════════════ DOCS ═══════════════════ -->
	<div class="max-w-7xl mx-auto p-6">
		<div class="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800 space-y-6">
			<h2 class="text-lg font-bold">Props</h2>
			<div class="overflow-x-auto">
				<table class="doc-table w-full text-sm text-left">
					<thead>
						<tr class="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
							<th class="py-2 pr-4">Prop</th><th class="py-2 pr-4">Type</th><th class="py-2 pr-4"
								>Default</th
							><th class="py-2">Description</th>
						</tr>
					</thead>
					<tbody class="text-gray-300 divide-y divide-gray-800">
						<tr
							><td class="py-2 pr-4 font-mono text-xs">status</td><td class="py-2 pr-4 text-xs"
								>boolean</td
							><td class="py-2 pr-4 text-xs">false</td><td class="py-2 text-xs"
								>Two-way bindable confirmed state</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">value</td><td class="py-2 pr-4 text-xs"
								>number</td
							><td class="py-2 pr-4 text-xs">0</td><td class="py-2 text-xs"
								>Current slider value (0-100)</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">hold</td><td class="py-2 pr-4 text-xs"
								>boolean</td
							><td class="py-2 pr-4 text-xs">false</td><td class="py-2 text-xs"
								>Whether slider is being held</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">options</td><td class="py-2 pr-4 text-xs"
								>SwipeOptions</td
							><td class="py-2 pr-4 text-xs">—</td><td class="py-2 text-xs"
								>All appearance and layout props</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">chevronIcon</td><td class="py-2 pr-4 text-xs"
								>Snippet</td
							><td class="py-2 pr-4 text-xs">chevron</td><td class="py-2 text-xs"
								>Custom thumb icon</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">completeIcon</td><td
								class="py-2 pr-4 text-xs">Snippet</td
							><td class="py-2 pr-4 text-xs">checkmark</td><td class="py-2 text-xs"
								>Custom completed icon</td
							></tr
						>
					</tbody>
				</table>
			</div>
		</div>

		<div class="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800 mt-6 space-y-4">
			<h2 class="text-lg font-bold">Events</h2>
			<div class="overflow-x-auto">
				<table class="doc-table w-full text-sm text-left">
					<thead>
						<tr class="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
							<th class="py-2 pr-4">Event</th><th class="py-2 pr-4">Signature</th><th class="py-2"
								>Description</th
							>
						</tr>
					</thead>
					<tbody class="text-gray-300 divide-y divide-gray-800">
						<tr
							><td class="py-2 pr-4 font-mono text-xs">oninput</td><td class="py-2 pr-4 text-xs"
								>(event: Event, value: number)</td
							><td class="py-2 text-xs">Fires continuously while the slider is being dragged</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">oncomplete</td><td class="py-2 pr-4 text-xs"
								>(event: Event, isComplete: boolean, value: number)</td
							><td class="py-2 text-xs">Fires when the slider is released above the threshold</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">oncancel</td><td class="py-2 pr-4 text-xs"
								>(event: Event, isComplete: boolean, value: number)</td
							><td class="py-2 text-xs">Fires when the slider is released below the threshold</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">onpassthreshold</td><td
								class="py-2 pr-4 text-xs">(event: Event, side: boolean, value: number)</td
							><td class="py-2 text-xs"
								>Fires when the slider crosses the threshold in either direction (side: true =
								forward)</td
							></tr
						>
					</tbody>
				</table>
			</div>
		</div>

		<div class="bg-gray-900 rounded-xl p-4 md:p-6 border border-gray-800 mt-6 space-y-4">
			<h2 class="text-lg font-bold">Swipe Options</h2>
			<p class="text-sm text-gray-400">
				All properties in the <code class="text-xs bg-gray-800 px-1 rounded">options</code> object:
			</p>
			<div class="overflow-x-auto">
				<table class="doc-table w-full text-sm text-left">
					<thead>
						<tr class="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
							<th class="py-2 pr-4">Option</th><th class="py-2 pr-4">Type</th><th class="py-2 pr-4"
								>Default</th
							><th class="py-2">Description</th>
						</tr>
					</thead>
					<tbody class="text-gray-300 divide-y divide-gray-800">
						<tr
							><td class="py-2 pr-4 font-mono text-xs">width</td><td class="py-2 pr-4 text-xs"
								>number</td
							><td class="py-2 pr-4 text-xs">400</td><td class="py-2 text-xs"
								>Slider width in pixels</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">height</td><td class="py-2 pr-4 text-xs"
								>number</td
							><td class="py-2 pr-4 text-xs">50</td><td class="py-2 text-xs"
								>Slider height in pixels (also sets thumb size)</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">threshold</td><td class="py-2 pr-4 text-xs"
								>number</td
							><td class="py-2 pr-4 text-xs">80</td><td class="py-2 text-xs"
								>Percentage (0-100) of slide required to confirm</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">label</td><td class="py-2 pr-4 text-xs"
								>string</td
							><td class="py-2 pr-4 text-xs">Slide to ...</td><td class="py-2 text-xs"
								>Text shown on the slider before completion</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">completeLabel</td><td
								class="py-2 pr-4 text-xs">string</td
							><td class="py-2 pr-4 text-xs">Complete</td><td class="py-2 text-xs"
								>Text shown after the slider is confirmed</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">rtlMode</td><td class="py-2 pr-4 text-xs"
								>boolean</td
							><td class="py-2 pr-4 text-xs">false</td><td class="py-2 text-xs"
								>Enables right-to-left sliding direction</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">trackColor</td><td class="py-2 pr-4 text-xs"
								>string</td
							><td class="py-2 pr-4 text-xs">#fff</td><td class="py-2 text-xs"
								>Background color of the slider track</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">completeTrackColor</td><td
								class="py-2 pr-4 text-xs">string</td
							><td class="py-2 pr-4 text-xs">#4caf50</td><td class="py-2 text-xs"
								>Track background color after confirmed</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">trackBorderColor</td><td
								class="py-2 pr-4 text-xs">string</td
							><td class="py-2 pr-4 text-xs">transparent</td><td class="py-2 text-xs"
								>Border color of the track</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">trackBorderWidth</td><td
								class="py-2 pr-4 text-xs">number</td
							><td class="py-2 pr-4 text-xs">1</td><td class="py-2 text-xs"
								>Track border width in pixels</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">trackRadius</td><td class="py-2 pr-4 text-xs"
								>number</td
							><td class="py-2 pr-4 text-xs">0</td><td class="py-2 text-xs"
								>Track border radius in pixels</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">trackClass</td><td class="py-2 pr-4 text-xs"
								>string</td
							><td class="py-2 pr-4 text-xs">—</td><td class="py-2 text-xs"
								>Additional CSS class for the track</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">completeTrackClass</td><td
								class="py-2 pr-4 text-xs">string</td
							><td class="py-2 pr-4 text-xs">—</td><td class="py-2 text-xs"
								>CSS class for the track when confirmed</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">thumbColor</td><td class="py-2 pr-4 text-xs"
								>string</td
							><td class="py-2 pr-4 text-xs">#ddd</td><td class="py-2 text-xs"
								>Color of the slider thumb (handle)</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">completeThumbColor</td><td
								class="py-2 pr-4 text-xs">string</td
							><td class="py-2 pr-4 text-xs">#ddd</td><td class="py-2 text-xs"
								>Thumb color after confirmed</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">thumbRadius</td><td class="py-2 pr-4 text-xs"
								>number</td
							><td class="py-2 pr-4 text-xs">0</td><td class="py-2 text-xs"
								>Thumb border radius in pixels</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">labelColor</td><td class="py-2 pr-4 text-xs"
								>string</td
							><td class="py-2 pr-4 text-xs">#000</td><td class="py-2 text-xs"
								>Text color of the label</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">labelClass</td><td class="py-2 pr-4 text-xs"
								>string</td
							><td class="py-2 pr-4 text-xs">—</td><td class="py-2 text-xs"
								>Additional CSS class for the label</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">completeLabelColor</td><td
								class="py-2 pr-4 text-xs">string</td
							><td class="py-2 pr-4 text-xs">#000</td><td class="py-2 text-xs"
								>Text color of the completed label</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">completeLabelClass</td><td
								class="py-2 pr-4 text-xs">string</td
							><td class="py-2 pr-4 text-xs">—</td><td class="py-2 text-xs"
								>Additional CSS class for the completed label</td
							></tr
						>
						<tr
							><td class="py-2 pr-4 font-mono text-xs">labelSize</td><td class="py-2 pr-4 text-xs"
								>string</td
							><td class="py-2 pr-4 text-xs">'md'</td><td class="py-2 text-xs"
								>Text size preset: 'xs', 'sm', 'md', 'lg', 'xl'. Scales with height</td
							></tr
						>
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<footer class="border-t border-gray-800 py-6 text-center text-xs text-gray-600">
		<p>
			<small>
				svelte-swipe-to-action v1.0.0 — MIT License — Made with ❤️ by kodaicoder
				<a
					class="p-1 inline-flex align-middle rounded-full text-slate-300 hover:bg-slate-300 hover:text-gray-800 transition-colors"
					href="https://github.com/kodaicoder/svelte-swipe-to-action"
					target="_blank"
				>
					<GithubLogoIcon size={18} weight="duotone" />
				</a>
			</small>
		</p>
	</footer>
</div>
