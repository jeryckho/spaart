<script>
	import { getRelativeTimeString } from "../lib/time";
	import { surveys } from "../stores/store";
   import Copy from "./Copy.svelte";
	import Show from "./Show.svelte";
	let err;

	const onCheck = () => {
		const Now = new Date().toJSON();
		$surveys = $surveys.filter((s) => s.expiration > Now);
	};
</script>

<div class="panel-heading">
	Surveys &nbsp;
	<button class="button is-small is-rounded" on:click={onCheck}>
		<span class="icon is-small">
			<i class="fa fa-refresh" />
		</span>
	</button>
</div>

<div class="panel-block">
	<table class="table">
		<thead>
			<tr>
				<th>signature</th>
				<th>system</th>
				<th>details</th>
				<th>expiration</th>
				<th>size</th>
			</tr>
		</thead>
		<tbody>
			{#each $surveys as survey}
				<tr>
					<td><Copy value={survey.signature} /></td>
					<td><Copy value={survey.symbol} /></td>
					<td>
						<table class="table">
							<tbody>
								{#each survey.deposits as deposit}
									<tr>
										<td>{deposit.symbol}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</td>
					<td>{getRelativeTimeString(new Date(survey.expiration))}</td>
					<td>{survey.size}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Show value={err} />
