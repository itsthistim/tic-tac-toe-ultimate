<script lang="ts">
	import Icon from "@iconify/svelte";

	export let board: ("x" | "o" | null)[][];

	let winner: "x" | "o" | null = null;
</script>

<div class="board-wrapper">
	<table class="board">
		<tbody>
			{#each board as row, rowIndex}
				<tr>
					{#each row as cell, colIndex}
						<td
							class="square
							{rowIndex === 0 ? 'top' : ''}
							{rowIndex === board.length - 1 ? 'bottom' : ''}
							{colIndex === 0 ? 'left' : ''}
							{colIndex === row.length - 1 ? 'right' : ''}"
						>
							{#if cell === "x"}
								<div class="x"><Icon icon="ph:x" /></div>
							{:else if cell === "o"}
								<div class="o"><Icon icon="ph:circle" /></div>
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	{#if winner}
		<div class="winner-overlay">
			<div class="winner-icon {winner}">
				{#if winner === "x"}
					<Icon icon="ph:x" />
				{:else if winner === "o"}
					<Icon icon="ph:circle" />
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.x {
		color: #00efff;
	}

	.o {
		color: #cf58c8;
	}

	.board-wrapper {
		position: relative;
		display: inline-block;
	}

	.board {
		border-collapse: collapse;
	}

	.winner-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}

	.winner-icon {
		font-size: 10rem;
		opacity: 0.9;
	}

	.winner-icon.x {
		color: #00efff;
	}

	.winner-icon.o {
		color: #cf58c8;
	}

	.square {
		border: 0.3rem solid #8689ab;
		width: 40px;
		height: 40px;
		text-align: center;
		font-size: 1.5rem;
		cursor: pointer;
		padding: 0;
	}

	.top {
		border-top: none;
	}

	.bottom {
		border-bottom: none;
	}

	.left {
		border-left: none;
	}

	.right {
		border-right: none;
	}
</style>
