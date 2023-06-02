<script>
	import { getStatus } from "../lib/api";

	export let onStatus = (_) => {};

	const onButton = async () => {
		status = await getStatus();
		onStatus(status);
	}
	let status;
</script>

<div class="row">
	<button
		type="button"
		on:click={onButton}>Status</button
	>
</div>
