<script>
  import ContractShips from './ContractShips.svelte';

  import MainShip from './MainShip.svelte';

  import PanelTabItem from '../PanelTabItem.svelte';

	import { token } from "../../stores/store";
	import { ships, shipsSet } from "../../stores/ships";
	import { getShip } from "../../lib/api";
   import Show from '../Show.svelte';
	import { scheduler, scheduleIn } from "../../stores/scheduler";
	const In = (what, delta = 0) => { $scheduler = scheduleIn($scheduler, what, delta); }
	const Now = (what) => () => { $scheduler = scheduleIn($scheduler, what, 0); }

	export let symbol;
	let ship;
	let err;
	let subMenu = 'Main';

	const onShip = async () => {
		try {
			const done = await getShip({
				shipSymbol: symbol,
				token: $token,
			});
			$ships = shipsSet($ships, symbol, done?.body?.data, true);
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onClick = (s) => { subMenu = s; }

	$: ship = $ships.find((current) => current.symbol === symbol);

</script>

<div class="panel-heading">
	{symbol} &nbsp;
	<button class="button is-small is-rounded" on:click={Now(onShip)}>
		<span class="icon is-small">
			<i class="fa fa-refresh" />
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
	<MainShip {symbol}/>
</div>

<div class:is-hidden={subMenu !== "Hull"}>
	<div class="panel-block">
		Hull
	</div>
</div>

<div class:is-hidden={subMenu !== "Market"}>
	<div class="panel-block">
		Market
	</div>
</div>

<div class:is-hidden={subMenu !== "Contracts"}>
	<ContractShips {symbol} />
</div>

<Show value={err} />
