<script>
	import { getMarket } from "../../lib/api";

	import {
		token,
	} from "../../stores/store";
	import {
		waypoints,
		waypointsMod,
	} from "../../stores/waypoints";
	import { scheduler, scheduleIn } from "../../stores/scheduler";
	const Now = (what) => () => {
		$scheduler = scheduleIn($scheduler, what, 0);
	};

	export let systemSymbol;
	export let waypointSymbol;

	let err;

	const onMarket = async (data) => {
		try {
			const done = await getMarket({
				...data,
				token: $token,
			});
			$waypoints = waypointsMod($waypoints, waypointSymbol, {
				market: done?.body?.data,
			});
		} catch (error) {
			err = error?.response?.body;
		}
	};

	$: Waypoint = $waypoints?.[waypointSymbol];
</script>

<div class="panel">
	<div class="panel-heading">
		Market &nbsp;
		<button
			class="button is-small is-rounded"
			on:click={Now(() => {
				onMarket({ systemSymbol, waypointSymbol });
			})}
		>
			<span class="icon is-small">
				<i class="fa fa-refresh" />
			</span>
		</button>
	</div>
	{#if Waypoint?.market}
		<div class="panel-block">
			<pre>{JSON.stringify(Waypoint?.market, null, "\t")}</pre>
		</div>		
	{/if}
</div>
