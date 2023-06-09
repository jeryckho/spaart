import { writable } from 'svelte/store';

export const agent = writable({});

export const contracts = writable([]);

export const keepers = writable(["ANTIMATTER"]);

export const lastSystems = writable({});

export const page = writable({
	selected: "Ships",
	back: undefined,
	waypointData: undefined
});

export const queries = writable({});

export const ships = writable({});

export const surveys = writable([]);

export const systems = writable({});

export const token = writable(import.meta.env.VITE_TOKEN);

export const waypoints = writable({});

