<script>
  import Trait from './Trait.svelte';

	import { waypoints } from "../../stores/waypoints";
	export let waypointSymbol;

	$: waypoint = $waypoints[waypointSymbol];
	$: traits = waypoint.traits.map((t) => t.symbol);
</script>

<div class="icon-text">
	<span class="icon has-text-success" title="scanned">
		<i class="fa fa-map-marker" />
	</span>
	{#each traits as trait}
		<Trait {trait} />	
	{/each}
</div>
