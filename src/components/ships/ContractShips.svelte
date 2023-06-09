<script context="module">
	import { token, ships, contracts } from "../../stores/store";
</script>

<script>
	import { negotiateContract } from "../../lib/api";
	import Show from "../Show.svelte";
	import ShowContracts from "../contracts/ShowContracts.svelte";

	export let symbol;
	let ship;
	let err;

	const onNegotiate = async () => {
		try {
			const done = await negotiateContract({
				shipSymbol: symbol,
				token: $token,
			});
			if (done?.body?.data?.contract)
				$contracts = [...$contracts, done?.body?.data?.contract];
		} catch (error) {
			err = error?.response?.body;
		}
	};

	$: ship = $ships?.[symbol];
</script>

<ShowContracts showTitle={true} />
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
