<script>
	import Icon from "@iconify/svelte";
	export let currentPlayer = "x";
	export let gameStatus = "playing";
</script>

<div class="status-bar">
	{#if gameStatus === "playing"}
		Player
		{#if currentPlayer === "x"}
			<span class="x"><Icon icon="ph:x" /></span>
		{:else}
			<span class="o"><Icon icon="ph:circle" /></span>
		{/if}
	{:else if gameStatus === "x"}
		Player <span class="x"><Icon icon="ph:x" /></span> wins!
	{:else if gameStatus === "o"}
		Player <span class="o"><Icon icon="ph:circle" /></span> wins!
	{:else if gameStatus === "draw"}
		It's a draw!
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
</style>
