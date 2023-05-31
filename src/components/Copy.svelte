<script>
	import { copy } from 'svelte-copy';
	export let value;
</script>

<code use:copy={value}>{value}</code>