<script lang="ts">
	import Board from "@/components/Board.svelte";
	import {
		checkWin,
		checkUltimateWinner,
		createEmptyBoard,
		createEmptyUltimateBoard,
		type MoveEvent,
		type UltimateBoards,
		type Board as BoardType,
		type CellState,
		type Player
	} from "@/lib/utils.ts";

	interface Props {
		player: Player;
		ultimateWinner: CellState;
		updateState: (player: Player, ultimateWinner: CellState) => void;
	}

	let { player, ultimateWinner, updateState }: Props = $props();

	let boards: UltimateBoards = $state(createEmptyUltimateBoard());
	let activeBoard: [number, number] | null = $state(null);
	let wonBoards: BoardType = $state(createEmptyBoard());

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

		// update game state
		updateState(player, ultimateWinner ?? null);
	}

	function isActive(boardRow: number, boardCol: number): boolean {
		return !ultimateWinner && !wonBoards[boardRow][boardCol] && (!activeBoard || (activeBoard[0] === boardRow && activeBoard[1] === boardCol));
	}
</script>

<table class="board">
	<tbody>
		{#each boards as row, rowIndex}
			<tr>
				{#each row as board, colIndex}
					<td class="square {rowIndex === 0 ? 'top' : rowIndex === 2 ? 'bottom' : ''} {colIndex === 0 ? 'left' : colIndex === 2 ? 'right' : ''}">
						<div class="board-container">
							<Board {board} winner={wonBoards[rowIndex][colIndex]} {player} isActive={isActive(rowIndex, colIndex)} updateState={(e) => handleMove(e, rowIndex, colIndex)} />
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
