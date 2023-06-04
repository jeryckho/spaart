<script>
	export let trait;
</script>


{#if trait === 'UNCHARTED'}
	<span class="icon has-text-danger" title="UNCHARTED">
		<i class="fa-solid fa-question-circle" />
	</span>
{/if}
{#if trait === 'MARKETPLACE'}
	<span class="icon has-text-info" title="MARKETPLACE">
		<i class="fa-solid fa-shopping-basket" />
	</span>
{/if}
{#if trait ==='SHIPYARD'}
	<span class="icon has-text-info" title="SHIPYARD">
		<i class="fa-solid fa-ship" />
	</span>
{/if}
{#if trait === 'RARE_METAL_DEPOSITS'}
	<span class="icon has-text-success" title="RARE_METAL_DEPOSITS">
		<i class="fa-solid fa-diamond" />
	</span>
{/if}
{#if trait === 'PRECIOUS_METAL_DEPOSITS'}
	<span class="icon has-text-info" title="PRECIOUS_METAL_DEPOSITS">
		<i class="fa-solid fa-diamond" />
	</span>
{/if}
{#if trait === 'COMMON_METAL_DEPOSITS'}
	<span class="icon has-text-warning" title="COMMON_METAL_DEPOSITS">
		<i class="fa-solid fa-diamond" />
	</span>
{/if}
{#if trait === 'MINERAL_DEPOSITS'}
	<span class="icon has-text-danger" title="MINERAL_DEPOSITS">
		<i class="fa-solid fa-diamond" />
	</span>
{/if}
