<script>
	import { token } from "../../stores/store";
	import { ships } from "../../stores/ships";
	import { contracts } from "../../stores/contracts";
	import { negotiateContractShip } from "../../lib/api";
	import Show from "../Show.svelte";
	import ShowContracts from "../contracts/ShowContracts.svelte";

	export let symbol;
	let ship;
	let err;

	const onNegotiate = async () => {
		try {
			const done = await negotiateContractShip({
				shipSymbol: symbol,
				token: $token,
			});
			if (done?.body?.data?.contract)
				$contracts = [...$contracts, done?.body?.data?.contract]
		} catch (error) {
			err = error?.response?.body;
		}
	};

	$: ship = $ships.find((current) => current.symbol === symbol);
</script>

<ShowContracts showTitle={true}/>
<div class="panel-block">
	New contract : &nbsp; <button
		class="button is-small is-rounded is-success"
		type="button"
		on:click={onNegotiate}
	>
		Negotiate
	</button>
</div>

<Show value={err} />
