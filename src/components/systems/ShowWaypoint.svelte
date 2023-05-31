<script>
	// import ImportantTraits from "./ImportantTraits.svelte";
	// import Pagination from "./Pagination.svelte";
	import Copy from "../Copy.svelte";
	import Show from "../Show.svelte";
	import Market from './Market.svelte';

	import { getWaypointSystems } from "../../lib/api";

	import { token } from "../../stores/store";
	import {
		waypoints,
		waypointsPut,
	} from "../../stores/waypoints";
	import { scheduler, scheduleIn } from "../../stores/scheduler";
   import Trait from "./Trait.svelte";
	const Now = (what) => () => {
		$scheduler = scheduleIn($scheduler, what, 0);
	};

	export let showTitle = false;
	export let systemSymbol;
	export let waypointSymbol;

	let err;

	const onWaypoint = async (data) => {
		try {
			const done = await getWaypointSystems({
				...data,
				token: $token,
			});
			$waypoints = waypointsPut($waypoints, done?.body?.data);
		} catch (error) {
			err = error?.response?.body;
		}
	};

	$: Waypoint = $waypoints?.[waypointSymbol];
	$: WPTraits = Waypoint?.traits.map(t=>t.symbol) ?? [];
	$: hasMarket = WPTraits.includes("MARKETPLACE");
	$: hasShipyard = WPTraits.includes("SHIPYARD");
</script>

<div class="panel">
	{#if showTitle}
		<div class="panel-heading">
			Waypoint {#if waypointSymbol}<Copy value={waypointSymbol} />{/if}&nbsp;
			<button
				class="button is-small is-rounded"
				on:click={Now(() => {
					onWaypoint({ systemSymbol, waypointSymbol });
				})}
			>
				<span class="icon is-small">
					<i class="fa fa-refresh" />
				</span>
			</button>
		</div>
	{/if}

	{#if Waypoint}
		<div class="panel-block">
			Type : {Waypoint.type}
		</div>
		<div class="panel-block">
			Position : {`[${Waypoint.x},${Waypoint.y}]`}
		</div>
		<div class="panel-block">
			<table class="table is-narrow">
				<tbody>
					{#each Waypoint.traits as trait}
						<tr>
							<td><Trait trait={trait.symbol}/></td>
							<td>{trait.symbol}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

{#if hasMarket}
	<Market {systemSymbol} {waypointSymbol}/>
{/if}

{#if hasShipyard}
	<Market {systemSymbol} {waypointSymbol}/>
{/if}

<Show value={err} />
