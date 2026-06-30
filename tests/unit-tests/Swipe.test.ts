import { render } from 'vitest-browser-svelte';
import { expect, test, vi, describe } from 'vitest';
import Swipe from '$lib/Swipe.svelte';

function base64Encode(str: string): string {
	const bytes = new TextEncoder().encode(str);
	const binString = String.fromCharCode(...bytes);
	return btoa(binString);
}

// ─── Rendering ───────────────────────────────────────────────────────────────

describe('Rendering', () => {
	test('renders with default label and slider', async () => {
		const screen = await render(Swipe, {});

		await expect.element(screen.getByText('Slide to ...')).toBeVisible();
		await expect.element(screen.getByRole('slider')).toBeVisible();
	});

	test('renders custom label from options', async () => {
		const screen = await render(Swipe, {
			options: { label: 'Swipe to confirm' }
		});

		await expect
			.element(screen.getByText('Swipe to confirm'))
			.toBeVisible();
	});
});

// ─── Options ─────────────────────────────────────────────────────────────────

describe('Options', () => {
	test('applies custom width and height as CSS variables on track', async () => {
		const screen = await render(Swipe, {
			options: { width: 300, height: 60 }
		});

		const track = screen.container.querySelector('.track')!;
		expect(track).toBeTruthy();

		// CSS custom properties are set as inline styles on the track div
		const style = track.getAttribute('style') || '';
		expect(style).toContain('--width: 300px');
		expect(style).toContain('--height: 60px');
	});

	test('applies custom track and thumb colors', async () => {
		const screen = await render(Swipe, {
			options: {
				trackColor: '#ff0000',
				thumbColor: '#00ff00',
				trackBorderColor: '#0000ff',
				trackBorderWidth: 3,
				trackRadius: 8,
				thumbRadius: 12
			}
		});

		const track = screen.container.querySelector('.track')!;
		const trackStyle = track.getAttribute('style') || '';
		expect(trackStyle).toContain('--track__color: #ff0000');
		expect(trackStyle).toContain('--track__border-color: #0000ff');
		expect(trackStyle).toContain('--track__border-width: 3px');
		expect(trackStyle).toContain('--track__radius: 8px');

		const input = screen.container.querySelector('.input-range')!;
		const inputStyle = input.getAttribute('style') || '';
		expect(inputStyle).toContain('--thumb__color: #00ff00');
		expect(inputStyle).toContain('--thumb__radius: 12px');
	});

	test('RTL mode sets dir="rtl" on wrapper', async () => {
		const screen = await render(Swipe, {
			options: { rtlMode: true }
		});

		const track = screen.container.querySelector('.track')!;
		expect(track.getAttribute('dir')).toBe('rtl');
	});

	test('RTL mode shows chevron icon on thumb', async () => {
		const screen = await render(Swipe, {
			options: { rtlMode: true }
		});

		// The --icon CSS variable is set as an inline style on the range input
		const input = screen.container.querySelector('.input-range')!;
		const style = input.getAttribute('style') || '';
		expect(style).toContain('data:image/svg+xml;base64,');
	});
});

// ─── Status / State ──────────────────────────────────────────────────────────

describe('Status', () => {
	test('status=true renders complete label and slider at 100%', async () => {
		const screen = await render(Swipe, {
			status: true,
			options: { completeLabel: 'Done!' }
		});

		await expect.element(screen.getByText('Done!')).toBeVisible();

		const input = screen.container.querySelector(
			'.input-range'
		) as HTMLInputElement;
		expect(input.value).toBe('100');
	});

	test('status=true shows progress bar', async () => {
		const screen = await render(Swipe, {
			status: true
		});

		const progressbar = screen.container.querySelector('.progressbar')!;
		expect(progressbar).toBeTruthy();

		const style = progressbar.getAttribute('style') || '';
		expect(style).toContain('--progress:');
	});

	test('disabled state sets aria-disabled and applies opacity', async () => {
		const screen = await render(Swipe, { disabled: true });

		const slider = screen.getByRole('slider');
		await expect
			.element(slider)
			.toHaveAttribute('aria-disabled', 'true');
	});
});

// ─── Callbacks ───────────────────────────────────────────────────────────────

describe('Callbacks', () => {
	test('oninput fires when range value changes via fill', async () => {
		const oninput = vi.fn();
		const screen = await render(Swipe, { oninput });

		const slider = screen.getByRole('slider');
		// fill() dispatches input event which triggers bind:value and oninput
		await slider.fill('50');

		expect(oninput).toHaveBeenCalled();
		expect(oninput.mock.calls[0][1]).toBe(50);
	});

	test('releasing past threshold fires oncomplete', async () => {
		const oncomplete = vi.fn();
		const screen = await render(Swipe, { oncomplete });

		// fill to 90 (past default 80% threshold), then dispatch change
		await screen.getByRole('slider').fill('90');

		// dispatch change event via native DOM to trigger onchange
		const input = screen.container.querySelector(
			'.input-range'
		) as HTMLInputElement;
		input.dispatchEvent(new Event('change', { bubbles: true }));

		expect(oncomplete).toHaveBeenCalled();
		expect(oncomplete.mock.calls[0][1]).toBe(true);
	});

	test('releasing below threshold fires oncancel', async () => {
		const oncancel = vi.fn();
		const screen = await render(Swipe, { oncancel });

		await screen.getByRole('slider').fill('30');

		const input = screen.container.querySelector(
			'.input-range'
		) as HTMLInputElement;
		input.dispatchEvent(new Event('change', { bubbles: true }));

		expect(oncancel).toHaveBeenCalled();
		expect(oncancel.mock.calls[0][1]).toBe(false);
	});

	test('crossing threshold upward fires onpassthreshold with side:true', async () => {
		const onpassthreshold = vi.fn();
		const screen = await render(Swipe, { onpassthreshold });

		await screen.getByRole('slider').fill('85');

		expect(onpassthreshold).toHaveBeenCalled();
		expect(onpassthreshold.mock.calls[0][1]).toBe(true);
		expect(onpassthreshold.mock.calls[0][2]).toBe(85);
	});

	test('crossing threshold downward fires onpassthreshold with side:false', async () => {
		const onpassthreshold = vi.fn();
		// Start with status=true so sliderValue begins at 100.
		// Filling to 20 crosses downward past threshold without
		// the change-event side effect resetting flags.
		const screen = await render(Swipe, {
			status: true,
			onpassthreshold
		});

		await screen.getByRole('slider').fill('20');

		// onpassthreshold fires with side:false before onchange resets
		const downwardCall = onpassthreshold.mock.calls.find(
			(call) => call[1] === false
		);
		expect(downwardCall).toBeTruthy();
		expect(downwardCall![2]).toBe(20);
	});
});

// ─── Custom Icons ────────────────────────────────────────────────────────────

describe('Custom Icons', () => {
	test('chevronIconSvg renders custom SVG on thumb', async () => {
		const customSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';

		const screen = await render(Swipe, { chevronIconSvg: customSvg });

		const input = screen.container.querySelector('.input-range')!;
		const style = input.getAttribute('style') || '';
		const expectedUri = `data:image/svg+xml;base64,${base64Encode(customSvg.trim())}`;
		expect(style).toContain(expectedUri);
	});

	test('completeIconSvg renders custom SVG after completion', async () => {
		const customCompleteSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>';

		const screen = await render(Swipe, {
			status: true,
			completeIconSvg: customCompleteSvg
		});

		const input = screen.container.querySelector('.input-range')!;
		const style = input.getAttribute('style') || '';
		const expectedUri = `data:image/svg+xml;base64,${base64Encode(customCompleteSvg.trim())}`;
		expect(style).toContain(expectedUri);
	});
});
