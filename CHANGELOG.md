# Changelog

## [1.0.1] - 2026-06-30

### Fixed

- Vercel build failure: replaced `@sveltejs/adapter-auto` with `@sveltejs/adapter-vercel` directly to avoid auto-install error during build

## [1.0.0] - 2026-06-30

### Breaking Changes

#### Props restructured: flat props → `options` object

All layout and color props moved into a single `SwipeOptions` object.

```svelte
<!-- v0.1.x -->
<Swipe width={400} height={50} trackColor="#fff" />

<!-- v1.0.0 -->
<Swipe options={{ width: 400, height: 50, trackColor: '#fff' }} />
```

#### `container*` props removed

`containerPadding`, `containerColor`, `containerBorderColor`, `containerBorderWidth`,
`containerRadius`, `containerClass` are gone. Use `trackColor`, `trackBorderColor`,
`trackBorderWidth`, `trackRadius`, `trackClass` instead.

#### Svelte 5 runes required

Svelte 5.0+ only. Uses `$props()`, `$state`, `$derived`, `$effect`, `$bindable`.
No Svelte 4 support.

#### Snippet props renamed

| v0.1.x      | v1.0.0          |
| ----------- | --------------- |
| `chevron`   | `chevronIcon`   |
| `checkMark` | `completeIcon`  |

#### Layout props are `$derived`, not `$bindable`

The `options` object is reactive (mutate it with `Object.assign` or spread).
Individual properties are no longer `$bindable`.

```svelte
<!-- v0.1.x -->
<Swipe bind:width={w} />
<!-- v1.0.0 -->
<script>opts.width = 500</script>
<Swipe options={opts} />
```

#### CSS class renamed

| v0.1.x       | v1.0.0  |
| ------------ | ------- |
| `.container` | `.track` |

### New Features

- **RTL mode** — `options.rtlMode: true` for right-to-left sliding
- **`oninput` callback** — fires continuously while dragging: `(event, value) => void`
- **`hold` and `value` bindables** — two-way bound hold state and slider value
- **Raw SVG icon strings** — `chevronIconSvg` and `completeIconSvg` accept raw SVG markup
- **Keyboard accessibility** — Enter toggles the slider; full ARIA attributes
- **Component tests** — 22 tests (vitest-browser-svelte) covering unit and integration

### Migration Example

```svelte
<!-- v0.1.x -->
<Swipe
  bind:status
  width={400}
  height={56}
  threshold={80}
  label="Slide to confirm"
  completeLabel="Confirmed!"
  trackColor="#f3f4f6"
  completeTrackColor="#22c55e"
  oncomplete={handleComplete}
  oncancel={handleCancel}
  chevron={plusIcon}
/>

<!-- v1.0.0 -->
<script>
  let opts = $state({
    width: 400, height: 56, threshold: 80,
    label: 'Slide to confirm', completeLabel: 'Confirmed!',
    trackColor: '#f3f4f6', completeTrackColor: '#22c55e',
  });
</script>
<Swipe
  bind:status
  options={opts}
  oncomplete={handleComplete}
  oncancel={handleCancel}
  chevronIcon={plusIcon}
/>
```
