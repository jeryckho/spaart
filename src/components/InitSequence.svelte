<script>
	import { token, agent, systems, lastSystems } from "../stores/store";
	import { ships } from "../stores/ships";
	import { contracts } from "../stores/contracts";
	
	import { listShips, listContracts, myAgentDetails, listSystems } from "../lib/api";
	
	const listAllShips = async () => {
		try {
			let limit = 20, page = 0, total = 0, Ships = [];	
			do {
				page++;
				const done = await listShips({ token:$token, page, limit });
				if (done?.body?.data) Ships.push(...done?.body?.data);
				total = done?.body?.meta?.total 
			} while (total > limit*page);
			$ships = Ships;			
		} catch (error) {
			throw error;
		}
	}

	const listAllContracts = async () => {
		try {
			let limit = 20, page = 0, total = 0, Contracts = [];	
			do {
				page++;
				const done = await listContracts({ token:$token, page, limit });
				if (done?.body?.data) Contracts.push(...done?.body?.data);
				total = done?.body?.meta?.total 
			} while (total > limit*page);
			$contracts = Contracts;			
		} catch (error) {
			throw error;
		}
	}

	const getAgent = async () => {
		try {
			const done = await myAgentDetails({ token:$token });
			if (done?.body?.data) $agent = done?.body?.data;
		} catch (error) {
			throw error;			
		}
	}
	const listFirstSystem = async () => {
		try {
			const done = await listSystems({page:1, limit:20});
			$lastSystems = done?.body;
			$systems = done?.body?.data?.reduce((systems, current) => {
				systems[current.symbol] = current;
				return systems;
			}, $systems);
		} catch (error) {
			throw error;
		}
	}
	const initAll = async  () => {
		try {
			step = "fa-battery-empty";
			await listAllShips();
			step = "fa-battery-quarter";
			await listAllContracts();
			step = "fa-battery-half";
			await getAgent();
			step = "fa-battery-three-quarters";
			await listFirstSystem();
			step = "fa-battery-full";
		} catch (error) {
			step = step + " is-danger";
		}
	}

	let step = "fa-battery-empty";
</script>

<button
	class="button is-small is-rounded"
	on:click={initAll}
>
	<span class="icon is-small">
		<i
			class={`fa-solid ${step}`}
		/>
	</span>
</button>
