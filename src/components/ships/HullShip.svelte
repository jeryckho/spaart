<script context="module">
	import { ships } from "../../stores/store";
</script>
<script>
	export let symbol;
	let ship;

	$: ship = $ships?.[symbol];
	$: Frame = ship?.frame;
	$: Reactor = ship?.reactor;
	$: Engine = ship?.engine;
	$: Modules = ship?.modules;
	$: Mounts = ship?.mounts;
</script>

<div class="panel-block">
	<span class="icon is-small">
		<i class="fa-solid fa-user-astronaut" />
	</span> &nbsp; 
	<span title={Frame.description}>{Frame.symbol}</span> &nbsp; {JSON.stringify(Frame,null,1)}
</div>

<div class="panel-block">
	<span class="icon is-small">
		<i class="fa-solid fa-bolt" />
	</span> &nbsp; 
	<span title={Reactor.description}>{Reactor.symbol}</span> &nbsp; {JSON.stringify(Reactor,null,1)}
</div>

<div class="panel-block">
	<span class="icon is-small">
		<i class="fa-solid fa-fire-flame-simple" />
	</span> &nbsp; 
	<span title={Engine.description}>{Engine.symbol}</span> &nbsp; {JSON.stringify(Engine,null,1)}
</div>

{#each Modules as Module}
	<div class="panel-block">
		<span class="icon is-small">
			<i class="fa-solid fa-box" />
		</span> &nbsp; 
		<span title={Module.description}>{Module.symbol}</span> &nbsp; ({Module.requirements.slots}/{Frame.moduleSlots}) &nbsp; {JSON.stringify(Module,null,1)}
	</div>	
{/each}

{#each Mounts as Mount}
	<div class="panel-block">
		<span class="icon is-small">
			<i class="fa-solid fa-cubes" />
		</span> &nbsp; 
		<span title={Mount.description}>{Mount.symbol}</span> &nbsp; ({Mount.requirements.slots ?? 1}/{Frame.mountingPoints}) &nbsp; {JSON.stringify(Mount,null,1)}
	</div>	
{/each}
