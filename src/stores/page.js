import { writable } from 'svelte/store';
import { produce } from "immer";

export const page = writable({
	selected: "Ships",
	back: undefined,
	waypointData: undefined
});

export const pageSet = produce((draft, item) => {
	for (const [key, value] of Object.entries(item)) {
		if (value) draft[key] = value;
	}
});
