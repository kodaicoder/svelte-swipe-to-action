# svelte-swipe-to-action

A highly customizable swipe-to-action component for Svelte 5.

[![npm](https://img.shields.io/npm/v/svelte-swipe-to-action)](https://www.npmjs.com/package/svelte-swipe-to-action)
[![license](https://img.shields.io/npm/l/svelte-swipe-to-action)](./LICENSE)

[**Live Demo**](https://svelte-swipe-ashy.vercel.app/)

![Svelte-Swipe-To-Action Demo](./static/demo/svelte-swipe-demo.png)

## Installation

```bash
npm install svelte-swipe-to-action

# or

pnpm add svelte-swipe-to-action
```

## Quick Start

```svelte
<script>
	import Swipe from 'svelte-swipe-to-action';
	import type { SwipeOptions } from 'svelte-swipe-to-action';

	let status = $state(false);
	const opts: SwipeOptions = {
		label: 'Slide to confirm',
		completeLabel: 'Confirmed!'
	};
</script>

<Swipe options={opts} bind:status />
```

## API

### State Props (`$bindable`)

These are two-way bindable state variables on the component.

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `boolean` | `false` | Whether the slider is in completed state |
| `value` | `number` | `0` | Current slider value (0–100) |
| `hold` | `boolean` | `false` | Whether the thumb is being pressed/held |

### Options (`options` prop)

All appearance and behavior settings are grouped in a reactive `SwipeOptions` object:

```typescript
interface SwipeOptions {
	// Sizing & behavior
	width?: number;              // default: 400
	height?: number;             // default: 50
	threshold?: number;          // default: 80 (percentage, 0–100)
	label?: string;              // default: 'Slide to ...'
	completeLabel?: string;      // default: 'Complete'
	rtlMode?: boolean;           // default: false
	labelSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';  // default: 'md'

	// Track
	trackColor?: string;         // default: '#ffffff'
	completeTrackColor?: string; // default: '#4caf50'
	trackBorderColor?: string;   // default: 'transparent'
	trackBorderWidth?: number;   // default: 1
	trackRadius?: number;        // default: 0
	trackClass?: string;         // default: ''
	completeTrackClass?: string; // default: ''

	// Thumb
	thumbColor?: string;         // default: '#dddddd'
	completeThumbColor?: string; // default: '#dddddd'
	thumbRadius?: number;        // default: 0

	// Label styling
	labelColor?: string;         // default: '#000000'
	labelClass?: string;         // default: ''
	completeLabelColor?: string; // default: '#000000'
	completeLabelClass?: string; // default: ''
}
```

All properties in `options` are individually reactive — changing any one triggers an immediate update.

### `labelSize` Presets

| Size | Multiplier | At 50px height | At 80px height |
|------|-----------|----------------|----------------|
| `xs` | 0.20 | 10px | 16px |
| `sm` | 0.28 | 14px | 22.4px |
| `md` | 0.35 | 17.5px | 24px (clamped) |
| `lg` | 0.45 | 22.5px | 24px (clamped) |
| `xl` | 0.55 | 24px (clamped) | 24px (clamped) |

Font size is clamped between 10px and 24px. Labels that exceed the track width are truncated with an ellipsis (`…`).

### Event Handlers

| Prop | Signature | Description |
|---|---|---|
| `oninput` | `(event: Event, value: number) => void` | Fires on every slider value change |
| `oncomplete` | `(event: Event, isComplete: boolean, value: number) => void` | Fires when the slider completes (passes threshold and is released) |
| `oncancel` | `(event: Event, isComplete: boolean, value: number) => void` | Fires when the slider is released before passing threshold |
| `onpassthreshold` | `(event: Event, side: boolean, value: number) => void` | Fires when the threshold is crossed in either direction (`true` = pass, `false` = back) |

### Custom Icons

Two approaches for customizing the chevron and checkmark icons:

**Approach 1 — SVG string props (reactive, no dependencies)**

```svelte
<script>
	import Swipe from 'svelte-swipe-to-action';

	const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000" viewBox="0 0 256 256"><path d="..."/></svg>`;
	const completeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000" viewBox="0 0 256 256"><path d="..."/></svg>`;
</script>

<Swipe
	options={{ label: 'Slide to confirm' }}
	chevronIconSvg={chevronSvg}
	completeIconSvg={completeSvg}
/>
```

String props are fully reactive — changing the SVG string instantly updates the icon.

**Approach 2 — Snippets (for Svelte components)**

```svelte
<script>
	import Swipe from 'svelte-swipe-to-action';
	import { HandSwipeRight, Heart } from 'phosphor-svelte';
</script>

<Swipe options={{ label: 'Slide to confirm', completeLabel: 'Done!' }}>
	{#snippet chevronIcon()}
		<HandSwipeRight />
	{/snippet}
	{#snippet completeIcon()}
		<Heart color="HotPink" weight="fill" />
	{/snippet}
</Swipe>
```

Snippets accept any Svelte component. For reactivity when toggling snippet props, wrap `<Swipe>` in `{#key}`.

### Other Props

Any additional HTML attributes are spread onto the underlying `<input type="range">` element:

| Prop | Type | Description |
|---|---|---|
| `id` | `string` | HTML id attribute on the range input |
| `disabled` | `boolean` | Disables the slider |
| `class` | `string` | Additional CSS class on the track element |

## Examples

### With Options Object

```svelte
<script>
	import Swipe from 'svelte-swipe-to-action';

	let status = $state(false);
	let opts = $state({
		width: 320,
		height: 60,
		threshold: 75,
		label: 'Slide to unlock',
		completeLabel: 'Unlocked!',
		completeTrackColor: '#4caf50',
		trackRadius: 14,
		thumbRadius: 12
	});
</script>

<Swipe bind:status options={opts} />

{#if status}
	<p>Device unlocked!</p>
{/if}
```

### With All Event Handlers

```svelte
<script>
	import Swipe from 'svelte-swipe-to-action';

	let message = $state('');
	let status = $state(false);
	const opts = $state({
		label: 'Slide to submit',
		completeLabel: 'Submitted!'
	});

	function handleComplete(event, isComplete, value) {
		message = 'Action completed!';
	}

	function handleCancel(event, isComplete, value) {
		message = 'Action canceled!';
	}

	function handleThreshold(event, side, value) {
		message = side ? 'Passed threshold' : 'Below threshold';
	}

	function handleInput(event, value) {
		console.log('Slider value:', value);
	}
</script>

<Swipe
	options={opts}
	bind:status
	oncomplete={handleComplete}
	oncancel={handleCancel}
	onpassthreshold={handleThreshold}
	oninput={handleInput}
/>

<p>{message}</p>
```

### RTL Support

```svelte
<script>
	import Swipe from 'svelte-swipe-to-action';

	const opts = $state({
		rtlMode: true,
		label: 'للتأكيد',
		completeLabel: 'تم!'
	});
</script>

<Swipe options={opts} />
```

Sets `dir="rtl"` on the track element, swaps the chevron direction, and aligns the progress bar from the right. No CSS transforms needed.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server (demo page)
pnpm dev

# Build the library
pnpm build

# Type check
pnpm check
```

## License

MIT

Copyright (c) 2026 Nutchapon (Kodaicoder)
