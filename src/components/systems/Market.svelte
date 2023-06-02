<script>
	import { getMarket } from "../../lib/api";

	import { token, keepers } from "../../stores/store";
	import { waypoints, waypointsMod } from "../../stores/waypoints";

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
	$: Market = Waypoint?.market;
	$: TradeGoods = Market?.tradeGoods ?? [];
	$: SortedGoods = [...TradeGoods].sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
	$: Imports = Market?.imports.map((i) => i.symbol) ?? [];
	$: Exports = Market?.exports.map((i) => i.symbol) ?? [];
	$: Exchange = Market?.exchange.map((i) => i.symbol) ?? [];
	$: All = Array.from(new Set([...Imports, ...Exports, ...Exchange])).sort((a, b) => a > b ? 1 : -1);
</script>

<div class="panel">
	<div class="panel-heading">
		Market &nbsp;
		<button
			class="button is-small is-rounded"
			on:click={() => {
				onMarket({ systemSymbol, waypointSymbol });
			}}
		>
			<span class="icon is-small">
				<i class="fa fa-refresh" />
			</span>
		</button>
	</div>
	{#if Market}
		{#if SortedGoods.length}
			<div class="panel-block">
				<table class="table">
					<tbody>
						{#each SortedGoods as {symbol, purchasePrice, sellPrice, tradeVolume}}
						<tr>
							<td>
								{#if $keepers.includes(symbol)}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<span
										class="icon has-text-danger"
										on:click={() => {
											$keepers = $keepers.filter(
												(k) => k !== symbol
											);
										}}
									>
										<i class="fa fa-ban" />
									</span>
								{:else}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<span
										class="icon has-text-success"
										on:click={() => {
											$keepers = [...$keepers, symbol];
										}}
									>
										<i class="fa fa-shopping-cart" />
									</span>
								{/if}
							</td>
							<td>{symbol}</td>
							<td>
								{#if (Imports.includes(symbol) || Exchange.includes(symbol))}
									<span class="icon">
										<i class="fa fa-sign-in" />
									</span> &nbsp; {sellPrice}
								{/if}
							</td>
							<td>{tradeVolume}</td>
							<td>
								{#if (Exports.includes(symbol) || Exchange.includes(symbol))}
									<span class="icon">
										<i class="fa fa-sign-out" />
									</span> &nbsp; {purchasePrice}
								{/if}
						</tr>
						
						{/each}
					</tbody>
				</table>
			</div>
		{:else if All.length}
			<div class="panel-block">
				<table class="table">
					<tbody>
						{#each All as item}
							<tr>
								<td>
									{#if $keepers.includes(item.symbol)}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span
											class="icon has-text-danger"
											on:click={() => {
												$keepers = $keepers.filter(
													(k) => k !== item
												);
											}}
										>
											<i class="fa fa-ban" />
										</span>
									{:else}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span
											class="icon has-text-success"
											on:click={() => {
												$keepers = [...$keepers, item];
											}}
										>
											<i class="fa fa-shopping-cart" />
										</span>
									{/if}
								</td>
								<td>{item}</td>
								<td>
									{#if (Imports.includes(item) || Exchange.includes(item))}
										<span class="icon">
											<i class="fa fa-sign-in" />
										</span>
									{/if}
								</td>
								<td>
									{#if (Exports.includes(item) || Exchange.includes(item))}
										<span class="icon">
											<i class="fa fa-sign-out" />
										</span>
									{/if}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>
