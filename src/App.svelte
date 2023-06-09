<script>
	import "bulma/css/bulma.css";
	import "./assets/fontawesome/css/fontawesome.css";
	import "./assets/fontawesome/css/solid.css";

	import Connect from "./components/connect/Connect.svelte";
	import CustomQuery from "./components/CustomQuery.svelte";
	import InitSequence from "./components/InitSequence.svelte";
	import LevelItem from "./components/LevelItem.svelte";
	import Register from "./components/connect/Register.svelte";
	import ScreenShips from './components/ships/ScreenShips.svelte';
	import Show from "./components/Show.svelte";
	import ShowAgent from "./components/ShowAgent.svelte";
	import ShowSurveys from "./components/ShowSurveys.svelte";
	import ShowSystems from "./components/systems/ShowSystems.svelte";
	import ShowWaypoint from "./components/systems/ShowWaypoint.svelte";

	import { agent, page, ships, surveys, systems, token } from "./stores/store";
	import { IObjectPatch } from "./stores/utils";

	import { registerNewAgent } from "./lib/api";

	let show;
	let selected = "Ships";
	let back;
	let waypointData;

	const onConnect = (x) => {
		$token = x;
	};

	const onRegister = async (x) => {
		try {
			const done = await registerNewAgent(x);
			$token = done?.body?.data?.token;
		} catch (error) {
			console.log("Arf");
		}
	}

	const onClick = (s) => {
		$page = IObjectPatch($page, { selected: s });
	};
	const credFormat = (ag) =>
		`(${ag?.credits?.toLocaleString?.("en-US") ?? "?"})`;

	$: {
		back = $page.back;
		waypointData = $page.waypointData;
		selected = $page.selected;
	}
</script>

<main class="container">
	{#if $token}
		<nav class="level">
			<LevelItem item="Ships" detail={`(${Object.keys($ships).length})`} {onClick} />
			<LevelItem item="Surveys" detail={`(${$surveys.length})`} {onClick} />
			<LevelItem
				item="Systems"
				detail={`(${Object.keys($systems).length})`}
				{onClick}
			/>
			<LevelItem item="Misc" detail={credFormat($agent)} {onClick} />
		</nav>

		<div class:is-hidden={selected !== "Ships"}>
			<ScreenShips />
		</div>

		<div class:is-hidden={selected !== "Misc"}>
			<nav class="panel">
				<div class="panel-heading">
					Init <InitSequence />
				</div>
			</nav>			
			<ShowAgent />
			<CustomQuery />
			<Show value={show} />
		</div>

		<div class:is-hidden={selected !== "Systems"}>
			<ShowSystems
				showTitle={true}
			/>
		</div>

		<div class:is-hidden={selected !== "Surveys"}>
			<ShowSurveys />
		</div>

		<div class:is-hidden={selected !== "Waypoint"}>
			<ShowWaypoint
				showTitle={true}
				systemSymbol={waypointData?.systemSymbol}
				waypointSymbol={waypointData?.waypointSymbol}
			/>
		</div>
	{:else}
		<Connect pw={$token} {onConnect} />
		<hr />
		<Register {onRegister}/>
	{/if}
</main>
