<script context="module">
	import { token, systems, lastSystems, page, waypoints  } from "../../stores/store";
	import { IHashAdd, IObjectPatch } from "../../stores/utils";
</script>

<script>
	import jsonata from "jsonata";

	import ImportantTraits from "./ImportantTraits.svelte";
	import Pagination from "./Pagination.svelte";
	import Show from "../Show.svelte";
	import Copy from "../Copy.svelte";

	import { listSystems, listWaypoints } from "../../lib/api";

	export let showTitle = false;

	let Search;
	let Found = [];
	let err;
	const onWaypoint = ({ systemSymbol, waypointSymbol }) => {
		$page = IObjectPatch($page, {
			selected: "Waypoint",
			back: "Systems",
			waypointData: { systemSymbol, waypointSymbol }
		});
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
			$waypoints = IHashAdd($waypoints, done?.body?.data);
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const TrySearch = (term) => {
		if (term) {
			jsonata(`[$[**.symbol~>/${term}/i or **.type~>/${term}/i].symbol]`)
				.evaluate(Object.values($waypoints))
				.then((res) => Found = res)
				.catch(()=> Found = []);
		} else { Found = []; }
	}

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
				<i class="fa-solid fa-refresh" />
			</span>
		</button>
	</div>
{/if}

<div class="panel-block">
	<p class="control has-icons-left">
	  <input class="input" type="text" placeholder="Search" bind:value={Search} on:blur={()=>TrySearch(Search)}>
	  <span class="icon is-left">
		 <i class="fa-solid fa-search"></i>
	  </span>
	</p>
 </div>

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
								<i class="fa-solid fa-street-view" />
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
									{#if Found.length == 0 || Found.includes(waypoint.symbol)}
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
														<i class="fa-solid fa-eye" />
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
									{/if}
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
