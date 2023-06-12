<script context="module">
	import { agent, token } from "../stores/store";
</script>

<script>
	import CredGraph from './CredGraph.svelte';

	import { myAgentDetails } from "../lib/api";
	
	const onAgent = async () => {
		try {
			const done = await myAgentDetails({ token:$token });
			if (done?.body?.data) $agent = done?.body?.data;
		} catch (error) {
			// err = error?.response?.body;
		}
	};
</script>

<nav class="panel">
	<div class="panel-heading">
		Agent &nbsp;
		<button class="button is-small is-rounded" on:click={onAgent}>
			<span class="icon is-small">
				<i class="fa-solid fa-refresh" />
			</span>
		</button>
	</div>
	<div class="panel-block">
		<pre>{JSON.stringify($agent, null, 1)}</pre>
	</div>
	<CredGraph/>
</nav>


