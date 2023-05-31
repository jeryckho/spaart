<script>
	import { token } from "../../stores/store";
	import { listContracts } from "../../lib/api";
	import { scheduler, scheduleIn } from "../../stores/scheduler";
	const In = (what, delta = 0) => { $scheduler = scheduleIn($scheduler, what, delta); }
	const Now = (what) => () => { $scheduler = scheduleIn($scheduler, what, 0); }

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
		on:click={Now(onButton)}>List Contracts</button
	>
</div>
