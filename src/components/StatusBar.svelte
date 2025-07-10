<script lang="ts">
	import Icon from "@iconify/svelte";

	interface Props {
		player: "x" | "o";
		winner: "x" | "o" | "draw" | null;
	}

	let { player, winner }: Props = $props();
</script>

<div class="status-bar">
	{#if !winner}
		Player
		{#if player === "x"}
			<span class="x"><Icon icon="ph:x" /></span>
		{:else}
			<span class="o"><Icon icon="ph:circle" /></span>
		{/if}
	{:else if winner === "x"}
		Player <span class="x"><Icon icon="ph:x" /></span> wins!
	{:else if winner === "o"}
		Player <span class="o"><Icon icon="ph:circle" /></span> wins!
	{:else if winner === "draw"}
		It's a draw! <span class="draw"><Icon icon="ph:minus" /></span>
	{/if}
</div>

<style>
	.status-bar {
		color: #e2e8f0;
		font-size: 2rem;
		font-weight: 300;
		text-align: center;
		letter-spacing: 0.02em;
		margin-bottom: 4rem !important;
	}

	.x {
		color: #00efff;
		font-weight: 500;
		vertical-align: middle;
	}

	.o {
		color: #cf58c8;
		font-weight: 500;
		vertical-align: middle;
	}

	.draw {
		color: #8689ab;
		font-weight: 500;
		vertical-align: middle;
	}
</style>
