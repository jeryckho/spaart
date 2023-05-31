import { writable } from 'svelte/store';

export const scheduler = writable([]);

const ITV = 500;
const makeTick = (ms) => Math.round(ms / ITV);
const msToTick = (tick) => Math.max(0, ITV * tick - Date.now());

export const scheduleIn = (S, fn, deltaMs = 0) => {
    let tick = makeTick(Date.now() + deltaMs);
    while ("T" + tick in S) tick++;
    S["T" + tick] = setTimeout(fn, msToTick(tick));
    return S;
}