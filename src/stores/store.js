import { writable } from 'svelte/store';

export const token = writable(import.meta.env.VITE_TOKEN);

export const agent = writable({});

export const keepers = writable(["ANTIMATTER"]);

export const surveys = writable([]);

export const systems = writable({});

export const lastSystems = writable({});

export const queries = writable({});