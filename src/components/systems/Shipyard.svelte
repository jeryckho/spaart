<script context="module">
	import { token, agent, ships, waypoints } from "../../stores/store";
	import { IHashAdd, IHashPatch } from '../../stores/utils';
</script>

<script>
  import BuySell from './BuySell.svelte';

	import { getShipyard, purchaseShip } from "../../lib/api";

	export let systemSymbol;
	export let waypointSymbol;
	export let showTitle = true;

	let err;

	const credFormat = (cred) =>
		`${cred?.toLocaleString?.("en-US") ?? ""}`;

	const onShipyard = async (data) => {
		try {
			const done = await getShipyard({
				...data,
				token: $token,
			});
			$waypoints = IHashPatch($waypoints, waypointSymbol, {
				shipyard: done?.body?.data,
			});
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onBuy = async ({shipType}) => {
		try {
			const done = await purchaseShip({
				shipType,
				waypointSymbol:waypointSymbol,
				token: $token
			})
			$ships = IHashAdd($ships, [done?.body?.data?.ship]);
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;			
		} catch (error) {
			err = error?.response?.body;			
		}
	}

	$: Waypoint = $waypoints?.[waypointSymbol];
	$: Shipyard = Waypoint?.shipyard;
	$: Ships = Shipyard?.ships ?? [];
</script>

<div class="panel">
	{#if showTitle}
		<div class="panel-heading">
			Shipyard &nbsp;
			<button
				class="button is-small is-rounded"
				on:click={() => {
					onShipyard({ systemSymbol, waypointSymbol });
				}}
			>
				<span class="icon is-small">
					<i class="fa-solid fa-refresh" />
				</span>
			</button>
		</div>
	{/if}
	{#if Shipyard}
		{#if Ships.length}
			<div class="panel-block">
				<table class="table">
					<tbody>
						{#each Ships as {type, name, description, purchasePrice}}
						<tr>
							<td>
								{name}
							</td>
							<td>
								{description}
							</td>
							<td>
								{credFormat(purchasePrice)}
							</td>
							<td>
								<BuySell type="Buy" max={1} value={1} showRange={false} on:click={(e)=> onBuy({shipType:type})}/>
							</td>
						</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>
