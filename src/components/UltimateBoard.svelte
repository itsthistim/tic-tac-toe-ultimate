<script lang="ts">
	import Board from "@/components/Board.svelte";
	import { checkWin, checkUltimateWinner, type MoveEvent } from "@/lib/utils.ts";

	interface Props {
		player: "x" | "o";
		ultimateWinner: "x" | "o" | "draw" | null;
		updateState: (player: "x" | "o", ultimateWinner: "x" | "o" | "draw" | null) => void;
	}

	let { player, ultimateWinner, updateState }: Props = $props();

	let activeBoard: [number, number] | null = $state(null);
	let boards: ("x" | "o" | null)[][][][] = $state(
		Array(3)
			.fill(null)
			.map(() =>
				Array(3)
					.fill(null)
					.map(() =>
						Array(3)
							.fill(null)
							.map(() => Array(3).fill(null))
					)
			)
	);

	let wonBoards: ("x" | "o" | "draw" | null)[][] = $state(
		Array(3)
			.fill(null)
			.map(() => Array(3).fill(null))
	);

	function handleMove(event: MoveEvent, boardRow: number, boardCol: number) {
		let { row, col, player } = event;

		// set player move
		boards[boardRow][boardCol][row][col] = player;

		const boardWinner = checkWin(boards[boardRow][boardCol]);
		if (boardWinner) {
			wonBoards[boardRow][boardCol] = boardWinner;
			ultimateWinner = checkUltimateWinner(wonBoards);
		}

		if (!wonBoards[row][col]) {
			activeBoard = [row, col]; // next move must be in the corresponding board
		} else {
			activeBoard = null; // any board can be played next
		}

		player = player === "x" ? "o" : "x";

		// update game state for Game
		updateState(player, ultimateWinner ?? null);
	}
</script>

<table class="board">
	<tbody>
		{#each boards as row, rowIndex}
			<tr>
				{#each row as board, colIndex}
					<td
						class="square {rowIndex === 0 ? 'top' : rowIndex === 2 ? 'bottom' : ''} {colIndex === 0 ? 'left' : colIndex === 2 ? 'right' : ''} {!ultimateWinner &&
						(!activeBoard || (activeBoard[0] === rowIndex && activeBoard[1] === colIndex))
							? `active-${player}`
							: ''}"
					>
						<div class="board-container">
							<Board
								{board}
								winner={wonBoards[rowIndex][colIndex]}
								{player}
								isActive={!ultimateWinner && (!activeBoard || (activeBoard[0] === rowIndex && activeBoard[1] === colIndex))}
								updateState={(e) => handleMove(e, rowIndex, colIndex)}
							/>
						</div>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.board {
		border-collapse: collapse;
	}

	.square {
		border: 0.3rem solid #fff;
		width: 150px;
		height: 150px;
		padding: 0;
		transition: background-color 0.2s ease;
	}

	.square.active-x {
		background-color: rgba(0, 239, 255, 0.2);
	}

	.square.active-o {
		background-color: rgba(207, 88, 200, 0.2);
	}

	.board-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
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
