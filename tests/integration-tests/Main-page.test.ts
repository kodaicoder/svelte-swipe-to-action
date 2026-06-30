import { render } from 'vitest-browser-svelte';
import { expect, test, describe } from 'vitest';
import Page from '../../src/routes/+page.svelte';

// Page render is heavy (Tailwind + phosphor-svelte), give it more time
const PAGE_TIMEOUT = 30000;

describe('Main page', () => {
	test(
		'renders header, preview, controls, and events sections',
		{ timeout: PAGE_TIMEOUT },
		async () => {
			const screen = await render(Page, {});

			// Header
			await expect
				.element(screen.getByText('Svelte Swipe To Action'))
				.toBeVisible();

			// Swipe slider in preview (use aria-label to get the right slider)
			await expect
				.element(
					screen.getByRole('slider', {
						name: 'Slide to confirm'
					})
				)
				.toBeVisible();

			// State indicators
			await expect
				.element(screen.getByTestId('state-status'))
				.toBeVisible();

			// Events section heading
			await expect
				.element(screen.getByTestId('events-heading'))
				.toBeVisible();

			// Controls: presets heading
			await expect
				.element(
					screen.getByRole('heading', { name: 'Presets' })
				)
				.toBeVisible();

			// Controls: Slider heading
			await expect
				.element(
					screen.getByRole('heading', { name: 'Slider' })
				)
				.toBeVisible();

			// Controls: Colors heading
			await expect
				.element(
					screen.getByRole('heading', { name: 'Colors' })
				)
				.toBeVisible();
		}
	);

	test(
		'completing the swipe updates status indicator',
		{ timeout: PAGE_TIMEOUT },
		async () => {
			const screen = await render(Page, {});

			const statusIndicator = screen.getByTestId('state-status');
			await expect
				.element(statusIndicator)
				.toHaveTextContent('pending');

			// Complete the swipe by filling past threshold and dispatching change
			await screen
				.getByRole('slider', { name: 'Slide to confirm' })
				.fill('80');

			const input = screen.container.querySelector(
				'#swipeElement input[type="range"]'
			) as HTMLInputElement;
			input?.dispatchEvent(
				new Event('change', { bubbles: true })
			);

			await expect
				.element(statusIndicator)
				.toHaveTextContent('complete');
		}
	);

	test(
		'completing the swipe adds event to the events log',
		{ timeout: PAGE_TIMEOUT },
		async () => {
			const screen = await render(Page, {});

			// Events log should be empty initially
			await expect
				.element(
					screen.getByText(
						'Interact with the slider to see events'
					)
				)
				.toBeVisible();

			// Complete the swipe
			await screen
				.getByRole('slider', { name: 'Slide to confirm' })
				.fill('80');
			const input = screen.container.querySelector(
				'#swipeElement input[type="range"]'
			) as HTMLInputElement;
			input?.dispatchEvent(
				new Event('change', { bubbles: true })
			);

			// Events list should now be visible with a "complete" entry
			await expect
				.element(screen.getByTestId('events-list'))
				.toBeVisible();
			await expect
				.element(
					screen
						.getByTestId('events-list')
						.getByText('complete', { exact: true })
				)
				.toBeVisible();
		}
	);

	test(
		'clicking a preset changes the swipe label',
		{ timeout: PAGE_TIMEOUT },
		async () => {
			const screen = await render(Page, {});

			// Default label on the swipe (use exact match to avoid code/pre matches)
			await expect
				.element(
					screen.getByText('Slide to confirm', {
						exact: true
					})
				)
				.toBeVisible();

			// Click danger preset
			await screen.getByTestId('preset-danger').click();

			// Label should change
			await expect
				.element(
					screen.getByText('Slide to delete', {
						exact: true
					})
				)
				.toBeVisible();

			// Click love preset
			await screen.getByTestId('preset-love').click();
			await expect
				.element(
					screen.getByText('Slide to love', { exact: true })
				)
				.toBeVisible();

			// Click dark preset
			await screen.getByTestId('preset-dark').click();
			await expect
				.element(
					screen.getByText('Slide to activate', {
						exact: true
					})
				)
				.toBeVisible();
		}
	);

	test(
		'changing the label text input updates the swipe label',
		{ timeout: PAGE_TIMEOUT },
		async () => {
			const screen = await render(Page, {});

			const labelInput = screen.getByTestId('input-label');
			await labelInput.clear();
			await labelInput.fill('Custom action');

			// The swipe slider aria-label should reflect the new label
			const slider = screen.getByRole('slider', {
				name: 'Custom action'
			});
			await expect.element(slider).toBeVisible();
		}
	);

	test(
		'toggling RTL changes the swipe direction',
		{ timeout: PAGE_TIMEOUT },
		async () => {
			const screen = await render(Page, {});

			// Before RTL: dir attr should not be "rtl"
			const trackBefore = screen.container.querySelector(
				'.track'
			);
			expect(trackBefore?.getAttribute('dir')).not.toBe('rtl');

			// Toggle RTL checkbox
			await screen.getByTestId('checkbox-rtl').click();

			// After RTL: dir="rtl" should be set
			const trackAfter = screen.container.querySelector('.track');
			expect(trackAfter?.getAttribute('dir')).toBe('rtl');
		}
	);
});
