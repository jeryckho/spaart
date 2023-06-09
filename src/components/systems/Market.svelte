<script context="module">
	import { token, keepers, agent,ships, waypoints } from "../../stores/store";
	import { IHashPatch } from "../../stores/utils";
</script>

<script>
  import BuySell from './BuySell.svelte';

	import { getMarket, sellCargo, purchaseCargo } from "../../lib/api";

	export let systemSymbol;
	export let waypointSymbol;
	export let shipSymbol = undefined;
	export let showTitle = true;

	let err;
	let  Detail;

	const onMarket = async (data) => {
		try {
			const done = await getMarket({
				...data,
				token: $token,
			});
			$waypoints = IHashPatch($waypoints, waypointSymbol, {
				market: done?.body?.data,
			});
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onSell = async (data) => {
		try {
			const done = await sellCargo({
				...data,
				shipSymbol: Ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, Ship.symbol, { cargo: done?.body?.data?.cargo });
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onBuy = async (data) => {
		try {
			const done = await purchaseCargo({
				...data,
				shipSymbol: Ship.symbol,
				token: $token,
			});
			$ships = IHashPatch($ships, Ship.symbol, { cargo: done?.body?.data?.cargo });
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;
		} catch (error) {
			err = error?.response?.body;
		}
	}

	$: Waypoint = $waypoints?.[waypointSymbol];
	$: Market = Waypoint?.market;
	$: TradeGoods = Market?.tradeGoods ?? [];
	$: SortedGoods = [...TradeGoods].sort((a, b) => (a.symbol > b.symbol ? 1 : -1));
	$: Imports = Market?.imports.map((i) => i.symbol) ?? [];
	$: Exports = Market?.exports.map((i) => i.symbol) ?? [];
	$: Exchange = Market?.exchange.map((i) => i.symbol) ?? [];
	$: {
		Detail = Market?.imports.reduce((acc, imp) => (acc[imp.symbol] = imp, acc), {});
		Detail = Market?.exports.reduce((acc, imp) => (acc[imp.symbol] = imp, acc), Detail);
		Detail = Market?.exchange.reduce((acc, imp) => (acc[imp.symbol] = imp, acc), Detail);
	}
	$: All = Array.from(new Set([...Imports, ...Exports, ...Exchange])).sort((a, b) => a > b ? 1 : -1);
	$: Ship = $ships?.[shipSymbol];
</script>

<div class="panel">
	{#if showTitle}
		<div class="panel-heading">
			Market &nbsp;
			<button
				class="button is-small is-rounded"
				on:click={() => {
					onMarket({ systemSymbol, waypointSymbol });
				}}
			>
				<span class="icon is-small">
					<i class="fa-solid fa-refresh" />
				</span>
			</button>
		</div>
	{/if}
	{#if Market}
		{#if SortedGoods.length}
			<div class="panel-block">
				<table class="table is-narrow">
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
										<i class="fa-solid fa-ban" />
									</span>
								{:else}
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<span
										class="icon has-text-success"
										on:click={() => {
											$keepers = [...$keepers, symbol];
										}}
									>
										<i class="fa-solid fa-shopping-cart" />
									</span>
								{/if}
							</td>
							<td title={Detail[symbol].description}>{symbol}</td>
							{#if Ship && Ship.nav.status === "DOCKED"}
								<td>
									{#each Ship.cargo.inventory.filter(i=>i.symbol===symbol) as Cargo}
										<BuySell type="Sell" max={Math.min(Cargo.units,tradeVolume)} value={Math.min(Cargo.units,tradeVolume)} on:click={(e)=> onSell({symbol, units:e.detail})}/>
									{/each}
								</td>
							{/if}
							<td>
								{#if (Imports.includes(symbol) || Exchange.includes(symbol))}
									<span class="icon">
										<i class="fa-solid fa-sign-in" />
									</span>
								{/if}&nbsp;{sellPrice}
							</td>
							<td>{tradeVolume}</td>
							<td>
								{#if (Exports.includes(symbol) || Exchange.includes(symbol))}
									<span class="icon">
										<i class="fa-solid fa-sign-out" />
									</span>
								{/if}&nbsp;{purchasePrice}
							</td>
							{#if Ship && Ship.nav.status === "DOCKED"}
								<td>
									<BuySell type="Buy" max={tradeVolume} on:click={(e)=> onBuy({symbol, units:e.detail})}/>
								</td>
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
											<i class="fa-solid fa-ban" />
										</span>
									{:else}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<span
											class="icon has-text-success"
											on:click={() => {
												$keepers = [...$keepers, item];
											}}
										>
											<i class="fa-solid fa-shopping-cart" />
										</span>
									{/if}
								</td>
								<td title={Detail[item].description}>{item}</td>
								<td>
									{#if (Imports.includes(item) || Exchange.includes(item))}
										<span class="icon">
											<i class="fa-solid fa-sign-in" />
										</span>
									{/if}
								</td>
								<td>
									{#if (Exports.includes(item) || Exchange.includes(item))}
										<span class="icon">
											<i class="fa-solid fa-sign-out" />
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
