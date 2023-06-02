<script>
	import { token } from "../../stores/store";
	import { listContracts } from "../../lib/api";

	export let onListContracts = (_) => {};
	const onButton = async () => {
		item = await listContracts({ limit:20, token: $token });
		onListContracts(item);
	}
	let item;
</script>

<div class="row">
	<button
		type="button"
		on:click={onButton}>List Contracts</button
	>
</div>
