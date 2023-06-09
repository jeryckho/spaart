<script context="module">
	import { ships } from "../../stores/store";
</script>

<script>
	import jsonata from "jsonata";

	import ShowShip from "./ShowShip.svelte";

	let Search;
	let Found = [];
	const TrySearch = (term) => {
		if (term) {
			jsonata(`[$[**.symbol~>/${term}/i or **.role~>/${term}/i].symbol]`)
				.evaluate(Object.values($ships))
				.then((res) => (Found = res))
				.catch(() => (Found = []));
		} else {
			Found = [];
		}
	};
</script>

<nav class="panel">
	<div class="panel-block">
		<p class="control has-icons-left">
			<input
				class="input"
				type="text"
				placeholder="Search"
				bind:value={Search}
				on:change={() => TrySearch(Search)}
			/>
			<span class="icon is-left">
				<i class="fa-solid fa-search" />
			</span>
		</p>
	</div>
</nav>

<div class="columns is-desktop is-multiline">
	{#each Object.keys($ships) as symbol (symbol)}
		<div
			class="column is-full-mobile is-full-tablet is-half-desktop is-half-widescreen is-half-fullhd"
			class:is-hidden={Found.length != 0 && !Found.includes(symbol)}
		>
			<nav class="panel">
				<ShowShip {symbol} />
			</nav>
		</div>
	{/each}
</div>
