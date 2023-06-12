<script>
	import Chart from "chart.js/auto";
	import "chartjs-adapter-moment";

	import { agentLink, agentHistory } from "../stores/store";

	import { onMount } from "svelte";

	let ctx;
	let chart;

	const options = {
		responsive: true,
		scales: {
			x: {
				type: "time",
				time: {
					unit: "minute",
				},
			},
		},
	};
	let data = {
		datasets: [
			{
				label: "Credits",
				data: [],
			},
		],
	};

	onMount(() => {
		ctx = document.getElementById("chart");
		// @ts-ignore
		chart = new Chart(ctx, { type: "line", data, options });
	});

	$: {
		if ($agentHistory.length>0 && chart?.data?.datasets?.[0]?.data) {
			chart.data.datasets[0].data = $agentHistory;
			chart.update("none");
		}
	}
</script>

<div>
	<canvas id="chart" />
</div>
<span class:is-hidden={true}>{$agentLink}</span>
