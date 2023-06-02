<script>
	import { token } from "../../stores/store";
	import { listShips } from "../../lib/api";

	export let onListShips = (_) => {};
	const onButton = async () => {
			ships = await listShips({ limit: 20, token: $token });
			onListShips(ships);
		}
	let ships;
</script>

<div class="row">
	<button
		type="button"
		on:click={onButton}>List Ships</button
	>
</div>
