import { test, expect } from '@playwright/test';

test.describe('Svelte-Swipe Component', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('page should load with default slider', async ({ page }) => {
		await expect(page.locator('h1:has-text("Svelte-Swipe")')).toBeVisible();
		await expect(page.locator('#swipeElement')).toBeVisible();
	});

	test('slider should start with initial values', async ({ page }) => {
		// Check initial state values
		await expect(page.locator('p:has-text("Swipe status : false")')).toBeVisible();
		await expect(page.locator('p:has-text("Hold state : false")')).toBeVisible();
		await expect(page.locator('p:has-text("Slider Value : 0")')).toBeVisible();
	});

	test('slider should update value when dragged', async ({ page }) => {
		const slider = page.locator('#swipeElement');

		// Get initial position
		await expect(slider).toHaveValue('0');

		// Simulate drag to halfway
		const sliderBoundingBox = await slider.boundingBox();
		if (!sliderBoundingBox) throw new Error('Could not get slider bounding box');

		const startX = sliderBoundingBox.x + 5;
		const startY = sliderBoundingBox.y + sliderBoundingBox.height / 2;
		const midX = sliderBoundingBox.x + sliderBoundingBox.width / 2;

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(midX, startY);

		// Check that the value is updating and hold state is true
		await expect(page.locator('p:has-text("Hold state : true")')).toBeVisible();
		await expect(page.locator('p:has-text("Slider Value : 0")')).not.toBeVisible();

		// Complete the drag
		await page.mouse.up();

		// After releasing, it should reset since we didn't cross threshold
		await expect(page.locator('p:has-text("Hold state : false")')).toBeVisible();
		await expect(page.locator('p:has-text("Slider Value : 0")')).toBeVisible();
	});

	test('slider should complete when dragged past threshold', async ({ page }) => {
		const slider = page.locator('#swipeElement');

		// Simulate drag past threshold
		const sliderBoundingBox = await slider.boundingBox();
		if (!sliderBoundingBox) throw new Error('Could not get slider bounding box');

		//get thershold value
		const threshold = await page
			.locator('#threshold')
			.evaluate((el) => (el as HTMLInputElement).value);

		const startX = sliderBoundingBox.x + 5;
		const startY = sliderBoundingBox.y + sliderBoundingBox.height / 2;
		const endX = sliderBoundingBox.x + sliderBoundingBox.width * (+threshold / 100);

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(endX, startY);
		await page.mouse.up();

		// Check that the slider completed
		await expect(page.locator('p:has-text("Swipe status : true")')).toBeVisible();
		await expect(page.locator('p:has-text("Slider Value : 100")')).toBeVisible();

		// Verify passed threshold state
		await expect(page.locator('p:has-text("Passed Threshold : Complete side")')).toBeVisible();
	});

	test('slider base setting test', async ({ page }) => {
		const track = page.locator('.track').nth(0);
		// Change width
		await page.fill('#width', '500');
		await expect(track).toHaveCSS('width', '500px');

		// Change height
		await page.fill('#height', '60');
		await expect(track).toHaveCSS('height', '60px');

		const slider = page.locator('#swipeElement');
		// Simulate drag past threshold
		const sliderBoundingBox = await slider.boundingBox();
		if (!sliderBoundingBox) throw new Error('Could not get slider bounding box');
		//set new threshold value
		await page.fill('#threshold', '50');
		//get thershold value
		const threshold = await page
			.locator('#threshold')
			.evaluate((el) => (el as HTMLInputElement).value);

		const startX = sliderBoundingBox.x + 5;
		const startY = sliderBoundingBox.y + sliderBoundingBox.height / 2;
		const endX = sliderBoundingBox.x + +sliderBoundingBox.width * (+threshold / 100);

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(endX, startY);
		await page.mouse.up();

		// Check that the slider completed
		await expect(page.locator('p:has-text("Swipe status : true")')).toBeVisible();
		await expect(page.locator('p:has-text("Slider Value : 100")')).toBeVisible();

		// Change label text
		await page.fill('#label', 'Custom Label');
		await expect(page.locator('.label').nth(0)).toContainText('Custom Label');

		// Change complete label text
		await page.fill('#completeLabel', 'Custom Complete Label');
		await expect(page.locator('.complete_label').nth(0)).toContainText('Custom Complete Label');
	});
	test("slider's container style test", async ({ page }) => {
		const container = page.locator('.container').nth(0);

		// change padding
		await page.fill('#containerPadding', '10');
		await expect(container).toHaveCSS('padding', '10px');

		//change background color
		await page.locator('#containerBackgroundColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#ff0000';
			el.dispatchEvent(new Event('input'));
		});
		await expect(container).toHaveCSS('background-color', 'rgb(255, 0, 0)');

		//change border width
		await page.fill('#containerBorderWidth', '5');
		await expect(container).toHaveCSS('border-width', '5px');

		//change border color
		await page.locator('#containerBorderColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#00ff00';
			el.dispatchEvent(new Event('input'));
		});
		await expect(container).toHaveCSS('border-color', 'rgb(0, 255, 0)');

		//change border radius
		await page.fill('#containerRadius', '10');
		await expect(container).toHaveCSS('border-radius', '10px');
	});

	test("slider's track style test", async ({ page }) => {
		const track = page.locator('.track').nth(0);
		const completeTrack = page.locator('.progressbar').nth(0);
		//change trackBackgroundColor
		await page.locator('#trackBackgroundColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#ff0000';
			el.dispatchEvent(new Event('input'));
		});
		await expect(track).toHaveCSS('background-color', 'rgb(255, 0, 0)');

		//change completeTrackBackgroundColor
		await page.locator('#completeTrackBackgroundColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#00ff00';
			el.dispatchEvent(new Event('input'));
		});
		await expect(completeTrack).toHaveCSS('background-color', 'rgb(0, 255, 0)');

		//change trackBorderWidth
		await page.fill('#trackBorderWidth', '5');
		await expect(track).toHaveCSS('border-width', '5px');

		//change trackBorderColor
		await page.locator('#trackBorderColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#0000ff';
			el.dispatchEvent(new Event('input'));
		});
		await expect(track).toHaveCSS('border-color', 'rgb(0, 0, 255)');

		//change trackRadius
		await page.fill('#trackRadius', '10');
		await expect(track).toHaveCSS('border-radius', '10px');
	});

	test("slider's thumb style test", async ({ page }) => {
		//change thumbHeight
		await page.fill('#height', '80');

		//change thumbColor
		await page.locator('#thumbColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#ff0000';
			el.dispatchEvent(new Event('input'));
		});

		//change thumbRadius
		await page.fill('#thumbRadius', '10');

		const styles = await page.evaluate(() => {
			const slider = document.querySelector('.input-range') as HTMLElement;
			const computed = window.getComputedStyle(slider);
			return {
				// Get specific pseudo-element styles
				thumbHeight: computed.getPropertyValue('--height'),
				thumbColor: computed.getPropertyValue('--thumb__color'),
				thumbRadius: computed.getPropertyValue('--thumb__radius')
			};
		});

		await expect(styles.thumbColor).toBe('#ff0000');
		await expect(styles.thumbHeight).toBe('80px');
		await expect(styles.thumbRadius).toBe('10px');

		//change completeThumbColor
		await page.locator('#completeThumbColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#00ff00';
			el.dispatchEvent(new Event('input'));
		});

		// Simulate drag past threshold
		const slider = page.locator('#swipeElement');
		const sliderBoundingBox = await slider.boundingBox();
		if (!sliderBoundingBox) throw new Error('Could not get slider bounding box');

		//get thershold value
		const threshold = await page
			.locator('#threshold')
			.evaluate((el) => (el as HTMLInputElement).value);

		const startX = sliderBoundingBox.x + 5;
		const startY = sliderBoundingBox.y + sliderBoundingBox.height / 2;
		const endX = sliderBoundingBox.x + sliderBoundingBox.width * (+threshold / 100);

		await page.mouse.move(startX, startY);
		await page.mouse.down();
		await page.mouse.move(endX, startY);
		await page.mouse.up();

		// Check that the slider completed
		await expect(page.locator('p:has-text("Swipe status : true")')).toBeVisible();
		await expect(page.locator('p:has-text("Slider Value : 100")')).toBeVisible();

		const completedStyles = await page.evaluate(() => {
			const slider = document.querySelector('.input-range') as HTMLElement;
			const computed = window.getComputedStyle(slider);
			return {
				// Get specific pseudo-element styles
				thumbHeight: computed.getPropertyValue('--height'),
				thumbColor: computed.getPropertyValue('--thumb__color'),
				thumbRadius: computed.getPropertyValue('--thumb__radius')
			};
		});
		await expect(completedStyles.thumbColor).toBe('#00ff00');
	});

	test("slider's label style test", async ({ page }) => {
		const label = page.locator('.label').nth(0);
		const completeLabel = page.locator('.complete_label').nth(0);
		//change labelColor
		await page.locator('#labelColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#ff0000';
			el.dispatchEvent(new Event('input'));
		});
		await expect(label).toHaveCSS('color', 'rgb(255, 0, 0)');

		//change completeLabelColor
		await page.locator('#completeLabelColor').evaluate((el) => {
			(el as HTMLInputElement).value = '#00ff00';
			el.dispatchEvent(new Event('input'));
		});
		await expect(completeLabel).toHaveCSS('color', 'rgb(0, 255, 0)');
	});
});
