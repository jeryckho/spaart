<script>
	// import ImportantTraits from "./ImportantTraits.svelte";
	// import Pagination from "./Pagination.svelte";
	import Copy from "../Copy.svelte";
	import Show from "../Show.svelte";
	import Market from './Market.svelte';
	import Shipyard from "./Shipyard.svelte";

	import { getWaypoint } from "../../lib/api";

	import { token } from "../../stores/store";
	import { page, pageSet } from "../../stores/page";
	import {
		waypoints,
		waypointsPut,
	} from "../../stores/waypoints";
   import Trait from "./Trait.svelte";

	export let showTitle = false;
	export let systemSymbol;
	export let waypointSymbol;

	let err;

	const onWaypoint = async (data) => {
		try {
			const done = await getWaypoint({
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
	$: back = $page?.back
</script>

<div class="panel">
	{#if showTitle}
		<div class="panel-heading">
			Waypoint {#if waypointSymbol}<Copy value={waypointSymbol} />{/if}&nbsp;
			<button
				class="button is-small is-rounded"
				on:click={() => {
					onWaypoint({ systemSymbol, waypointSymbol });
				}}
			>
				<span class="icon is-small">
					<i class="fa-solid fa-refresh" />
				</span>
			</button>
			{#if back}
				<button
					class="button is-small is-rounded"
					on:click={() => { $page = pageSet($page, { selected: back })}}
				>
					<span class="icon is-small">
						<i class="fa-solid fa-backward" />
					</span>
				</button>
			{/if}
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
	<Shipyard {systemSymbol} {waypointSymbol}/>
{/if}

<Show value={err} />
