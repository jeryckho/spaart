<script>
	import { getStatus } from "../lib/api";
	import { scheduler, scheduleIn } from "../stores/scheduler";
	const In = (what, delta = 0) => { $scheduler = scheduleIn($scheduler, what, delta); }
	const Now = (what) => () => { $scheduler = scheduleIn($scheduler, what, 0); }

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
		on:click={Now(onButton)}>Status</button
	>
</div>
