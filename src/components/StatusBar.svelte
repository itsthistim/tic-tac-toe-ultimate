<script lang="ts">
	import Icon from "@iconify/svelte";
	import { type Player, type CellState } from "@/lib/utils.ts";

	interface Props {
		player: Player | null;
		winner: CellState;
	}

	let { player, winner }: Props = $props();
</script>

<div class="status-bar">
	{#if !winner}
		{#if player === null}
			Choose a game mode to start playing
		{:else}
			Player
			{#if player === "x"}
				<span class="x"><Icon icon="ph:x" /></span>
			{:else if player === "o"}
				<span class="o"><Icon icon="ph:circle" /></span>
			{/if}
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
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		font-size: 2rem;
		font-weight: 400;
		margin-bottom: 3rem !important;
	}

	.x {
		display: flex;
		align-items: center;
		color: #00efff;
		font-weight: 500;
	}

	.o {
		display: flex;
		align-items: center;
		color: #cf58c8;
		font-weight: 500;
	}

	.draw {
		display: flex;
		align-items: center;
		color: #8689ab;
		font-weight: 500;
	}
</style>
