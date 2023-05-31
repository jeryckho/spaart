<script>
	import { token } from "../../stores/store";
	import { listShips } from "../../lib/api";
	import { scheduler, scheduleIn } from "../../stores/scheduler";
	const In = (what, delta = 0) => { $scheduler = scheduleIn($scheduler, what, delta); }
	const Now = (what) => () => { $scheduler = scheduleIn($scheduler, what, 0); }

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
		on:click={Now(onButton)}>List Ships</button
	>
</div>
