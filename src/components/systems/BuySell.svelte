<script>
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let type = "Buy";
	export let max = 1000;
	export let value = undefined;
	export let showRange = true;
</script>

<div class="buttons has-addons">
	<button
		class="button is-small is-rounded"
		class:is-success={type === "Sell"}
		class:is-warning={type === "Buy"}
		disabled={!value || !(value > 0 && value <= max)}
		on:click={() => {
			dispatch("click", value);
		}}
	>
		{type}
	</button>
	{#if showRange}
		<input
			class="button is-small is-rounded"
			type="number"
			min="0"
			{max}
			bind:value={value}
		/>
	{/if}
</div>
