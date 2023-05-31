<script>
	import PaginationItem from "./PaginationItem.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();
	const Range = (length) => Array.from({ length }, (_, i) => i + 1);

	export let meta;
	$: lastPage = meta?.limit ? Math.ceil(meta.total / meta.limit) : 1;
	$: page = meta?.page ?? 1;
	const onClick = (e) => {
		dispatch("click", e.detail);
	};
</script>

{#if meta}
	<nav class="pagination">
		<a
			class="pagination-previous"
			class:is-disabled={page === 1}
			href="previous"
			on:click|preventDefault={() => {
				if (page !== 1) dispatch("click", page - 1);
			}}>Previous</a
		>
		<a
			class="pagination-next"
			class:is-disabled={page === lastPage}
			href="previous"
			on:click|preventDefault={() => {
				if (page !== lastPage) dispatch("click", page + 1);
			}}>Next page</a
		>
		<ul class="pagination-list">
			{#if lastPage <= 7}
				{#each Range(7) as pageName}
					<PaginationItem on:click={onClick} {pageName} {page} />
				{/each}
			{:else if page <= 3}
				{#each Range(Math.max(page, 2) + 1) as pageName}
					<PaginationItem on:click={onClick} {pageName} {page} />
				{/each}
				<PaginationItem />
				<PaginationItem on:click={onClick} pageName={lastPage} {page} />
			{:else if page >= lastPage - 2}
				<PaginationItem on:click={onClick} pageName={1} {page} />
				<PaginationItem />
				{#if page === lastPage - 2}<PaginationItem
						on:click={onClick}
						pageName={lastPage - 3}
						{page}
					/>{/if}
				<PaginationItem on:click={onClick} pageName={lastPage - 2} {page} />
				<PaginationItem on:click={onClick} pageName={lastPage - 1} {page} />
				<PaginationItem on:click={onClick} pageName={lastPage} {page} />
			{:else}
				<PaginationItem on:click={onClick} pageName={1} {page} />
				<PaginationItem />
				<PaginationItem on:click={onClick} pageName={page - 1} {page} />
				<PaginationItem on:click={onClick} pageName={page} {page} />
				<PaginationItem on:click={onClick} pageName={page + 1} {page} />
				<PaginationItem />
				<PaginationItem on:click={onClick} pageName={lastPage} {page} />
			{/if}
		</ul>
	</nav>
{/if}
