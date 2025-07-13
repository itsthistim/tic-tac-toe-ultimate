<script lang="ts">
	import Icon from "@iconify/svelte";
	import { checkWin, type MoveEvent, type Board, type CellState, type Player } from "@/lib/utils.ts";

	interface Props {
		board: Board;
		winner: CellState;
		player: Player | null;
		isActive: boolean;
		updateState: (event: MoveEvent) => void;
	}

	let { board, winner = null, player = "x", isActive = true, updateState }: Props = $props();

	function handleMove(row: number, col: number) {
		if (!isActive || winner || board[row][col] || !player) return;

		board[row][col] = player;
		winner = checkWin(board);

		updateState({ row, col, player, winner, board });
	}
</script>

<div class="board-wrapper {isActive ? `active-${player}` : ''}">
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
							onclick={() => {
								if (!board[rowIndex][colIndex] && !winner && isActive && player) {
									handleMove(rowIndex, colIndex);
								}
							}}
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
				{:else if winner === "draw"}
					<Icon icon="ph:minus" />
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
		transition: background-color 0.2s ease;
	}

	.board-wrapper.active-x {
		background-color: rgba(0, 239, 255, 0.2);
	}

	.board-wrapper.active-o {
		background-color: rgba(207, 88, 200, 0.2);
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
		display: flex;
		align-items: center;
		justify-content: center;
		width: 110%;
		height: 110%;
	}

	.winner-icon.x {
		color: #00efff;
	}

	.winner-icon.o {
		color: #cf58c8;
	}

	.winner-icon.draw {
		color: #8689ab;
		opacity: 0.7;
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
