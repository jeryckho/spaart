<script>
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let pageName = 0;
	export let page = undefined;
</script>

{#if pageName === 0}
	<li>
		<span class="pagination-ellipsis">&hellip;</span>
	</li>
{:else}
	<li>
		<a
			class="pagination-link"
			class:is-current={page == pageName}
			href={pageName.toString()}
			on:click|preventDefault={() => { dispatch("click", pageName)}}>{pageName}</a
		>
	</li>
{/if}
