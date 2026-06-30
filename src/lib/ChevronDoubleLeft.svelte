<script lang="ts">
	interface Props {}

	let props: Props = $props();

	const viewBox = '0 0 24 24';
	const content = `<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 16l-4-4l4-4m-6 8l-4-4l4-4"/>`;
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" {viewBox} {...props}
	>{@html content}</svg
>
