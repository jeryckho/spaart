<script>
	import { contracts, contractsSet } from "../../stores/contracts";
	import { token, agent } from "../../stores/store";
	import {
		listContracts,
		fulfillContract,
		acceptContract,
	} from "../../lib/api";
	import Show from "../Show.svelte";
	import { getRelativeTimeString } from "../../lib/time";
   import Copy from "../Copy.svelte";

	let err;
	export let showTitle = false;

	const onListContracts = async () => {
		try {
			const done = await listContracts({
				limit: 20,
				token: $token,
			});
			$contracts = done?.body?.data;
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onFulfill = async (data) => {
		try {
			const done = await fulfillContract({
				...data,
				token: $token,
			});
			$contracts = contractsSet(
				$contracts,
				data.contractId,
				done?.body?.data?.contract,
				true
			);
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;
		} catch (error) {
			err = error?.response?.body;
		}
	};

	const onAccept = async (data) => {
		try {
			const done = await acceptContract({
				...data,
				token: $token,
			});
			$contracts = contractsSet(
				$contracts,
				data.contractId,
				done?.body?.data?.contract,
				true
			);
			if (done?.body?.data?.agent) $agent = done?.body?.data?.agent;
		} catch (error) {
			err = error?.response?.body;
		}
	};
</script>

{#if showTitle}
	<div class="panel-heading">
		Contracts &nbsp;
		<button class="button is-small is-rounded" on:click={onListContracts}>
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
				<!-- <th>faction</th> -->
				<th>type</th>
				<th>expiration</th>
				<th>deadline</th>
				<th>payment</th>
				<th>details</th>
				<th>accepted</th>
				<th>fulfilled</th>
			</tr>
		</thead>
		<tbody>
			{#each $contracts as contract}
				<tr>
					<!-- <td>{contract.factionSymbol}</td> -->
					<td>{contract.type}</td>
					<td
						>{getRelativeTimeString(
							new Date(contract.deadlineToAccept)
						)}</td
					>
					<td
						>{getRelativeTimeString(
							new Date(contract.terms.deadline)
						)}</td
					>
					<td
						title={`${contract.terms.payment.onAccepted} + ${contract.terms.payment.onFulfilled}`}
						>{contract.terms.payment.onAccepted +
							contract.terms.payment.onFulfilled}</td
					>
					<td>
						<table class="table is-narrow">
							<tbody>
								{#each contract.terms.deliver as deliver}
									<tr>
										<td>{deliver.tradeSymbol}</td>
										<td><Copy value={deliver.destinationSymbol} /></td>
										<td
											>{deliver.unitsFulfilled}/{deliver.unitsRequired}</td
										>
									</tr>
								{/each}
							</tbody>
						</table>
					</td>
					<td
						>{contract.accepted}
						{#if !contract.accepted}
							<button
								class="button is-small is-rounded is-success"
								type="button"
								disabled={contract.fulfilled}
								on:click={()=>onAccept({ contractId: contract.id })}
							>
								<span class="icon is-small">
									<i class="fa fa-check" />
								</span>
							</button>
						{/if}
					</td>
					<td
						>{contract.fulfilled}
						{#if !contract.fulfilled}
							<button
								class="button is-small is-rounded is-success"
								type="button"
								disabled={contract.fulfilled}
								on:click={()=>onFulfill({ contractId: contract.id })}
							>
								<span class="icon is-small">
									<i class="fa fa-check" />
								</span>
							</button>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<Show value={err} />
