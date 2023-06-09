<script context="module">
	import { token, ships } from "../../stores/store";
	import { IHashAdd } from "../../stores/utils";
</script>

<script>
	import ContractShips from "./ContractShips.svelte";
	import HullShip from "./HullShip.svelte";
	import MainShip from "./MainShip.svelte";
	import Market from "../systems/Market.svelte";
	import PanelTabItem from "../PanelTabItem.svelte";
	import Show from "../Show.svelte";

	import { getShip } from "../../lib/api";

	export let symbol;
	let ship;
	let err;
	let subMenu = "Main";

	const onShip = async () => {
		try {
			const done = await getShip({
				shipSymbol: symbol,
				token: $token,
			});
			$ships = IHashAdd($ships, [done?.body?.data]);
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onClick = (s) => {
		subMenu = s;
	};

	$: ship = $ships?.[symbol];
</script>

<div class="panel-heading">
	{symbol}
	<span class="is-italic is-size-7">{ship.registration.role}</span>&nbsp;
	<button class="button is-small is-rounded" on:click={onShip}>
		<span class="icon is-small">
			<i class="fa-solid fa-refresh" />
		</span>
	</button>
</div>

<p class="panel-tabs">
	<PanelTabItem {subMenu} {onClick} name="Main" />
	<PanelTabItem {subMenu} {onClick} name="Hull" />
	<PanelTabItem {subMenu} {onClick} name="Market" />
	<PanelTabItem {subMenu} {onClick} name="Contracts" />
</p>

<div class:is-hidden={subMenu !== "Main"}>
	<MainShip {symbol} />
</div>

<div class:is-hidden={subMenu !== "Hull"}>
	<HullShip {symbol} />
</div>

<div class:is-hidden={subMenu !== "Market"}>
	<Market
		shipSymbol={symbol}
		systemSymbol={ship.nav.systemSymbol}
		waypointSymbol={ship.nav.waypointSymbol}
		showTitle={false}
	/>
</div>

<div class:is-hidden={subMenu !== "Contracts"}>
	<ContractShips {symbol} />
</div>

<Show value={err} />
