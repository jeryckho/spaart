import { writable } from 'svelte/store';
import { produce } from "immer";

export const contracts = writable([]);

export const contractsSet = produce((draft, id, item, all = false) => {
	// @ts-ignore
	const index = draft.findIndex((i) => i.id === id);
	if (all) {
		if (item) draft[index] = item;
	} else {
		for (const [key, value] of Object.entries(item)) {
			if (value) draft[index][key] = value;
		}
	}
});