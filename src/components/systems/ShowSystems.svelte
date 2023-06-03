<script>
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	import ImportantTraits from "./ImportantTraits.svelte";
	import Pagination from "./Pagination.svelte";
	import Show from "../Show.svelte";
	import Copy from "../Copy.svelte";

	import { listSystems, listWaypoints } from "../../lib/api";

	import { token, systems, lastSystems } from "../../stores/store";
	import {
		waypoints,
		waypointsSet,
	} from "../../stores/waypoints";

	export let showTitle = false;

	let err;
	const onWaypoint = (data) => {
		dispatch("waypoint", data);
	};

	const onListSystems = async (data) => {
		try {
			const done = await listSystems({
				...data,
				limit: 20,
				token: $token,
			});
			$lastSystems = done?.body;
			$systems = done?.body?.data?.reduce((systems, current) => {
				systems[current.symbol] = current;
				return systems;
			}, $systems);
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onWPSystems = async (data) => {
		try {
			const done = await listWaypoints({
				...data,
				limit: 20,
				token: $token,
			});
			$waypoints = waypointsSet($waypoints, done?.body?.data);
		} catch (error) {
			err = error?.response?.body;
		}
	};

	// @ts-ignore
	$: Systems = $lastSystems?.data ?? [];
	// @ts-ignore
	$: Meta = $lastSystems?.meta;
</script>

{#if showTitle}
	<div class="panel-heading">
		Systems &nbsp;
		<button class="button is-small is-rounded" on:click={onListSystems}>
			<span class="icon is-small">
				<i class="fa fa-refresh" />
			</span>
		</button>
	</div>
{/if}

<div class="panel-block">
	<table class="table is-narrow">
		<thead>
			<tr>
				<th />
				<th>name</th>
				<th>type</th>
				<th>coord</th>
				<th>waypoints</th>
			</tr>
		</thead>
		<tbody>
			{#each Systems as system}
				<tr>
					<td>
						<button
							class="button is-small is-rounded is-info"
							on:click={() => {
								onWPSystems({ systemSymbol: system.symbol });
							}}
						>
							<span class="icon is-small">
								<i class="fa fa-street-view" />
							</span>
						</button>
					</td>
					<td>{system.symbol}</td>
					<td>{system.type}</td>
					<td>{`[${system.x},${system.y}]`}</td>
					<td>
						<table class="table is-narrow">
							<tbody>
								{#each system.waypoints as waypoint}
									<tr>
										<td>
											<button
												class="button is-small is-rounded"
												on:click={() => {
													onWaypoint({
														systemSymbol: system.symbol,
														waypointSymbol: waypoint.symbol,
													});
												}}
											>
												<span class="icon is-small">
													<i class="fa fa-eye" />
												</span>
											</button>
											<Copy value={waypoint.symbol} /></td
										>
										<td>{waypoint.type}</td>
										<td>{`[${waypoint.x},${waypoint.y}]`}</td>
										<td>
											{#if waypoint.symbol in $waypoints}
												<ImportantTraits
													waypointSymbol={waypoint.symbol}
												/>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="panel-block">
	<Pagination
		meta={Meta}
		on:click={(e) => {
			onListSystems({ page: e.detail });
		}}
	/>
</div>

<Show value={err} />
