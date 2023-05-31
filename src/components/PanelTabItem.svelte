<script>
   import { type } from "superagent/lib/utils";

	export let onClick = (_) => {};
	export let subMenu;
	export let name;
	export let disabled=false;
</script>

<a class:is-active={subMenu === name} class:isDisabled={disabled} href={name} on:click|preventDefault={() => {onClick(name);}}>{name}</a>

<style>
	.isDisabled {
		color: currentColor;
		cursor: not-allowed;
		opacity: 0.5;
		text-decoration: none;
	 }
</style>
