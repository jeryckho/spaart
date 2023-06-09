<script context="module">
	import { token, page, waypoints } from "../../stores/store";
	import { IHashAdd, IObjectPatch } from "../../stores/utils";
</script>

<script>
	import Copy from "../Copy.svelte";
	import Show from "../Show.svelte";
	import Market from './Market.svelte';
	import Shipyard from "./Shipyard.svelte";
   import Trait from "./Trait.svelte";

	import { getWaypoint } from "../../lib/api";

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
			$waypoints = IHashAdd($waypoints, [done?.body?.data]);
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
					on:click={() => { $page = IObjectPatch($page, { selected: back })}}
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
