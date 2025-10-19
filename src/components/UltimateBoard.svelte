<script lang="ts">
	import Board from "@/components/Board.svelte";
	import {
		checkWin,
		checkUltimateWinner,
		createEmptyBoard,
		createEmptyUltimateBoard,
		type MoveEvent,
		type UltimateBoard,
		type Board as BoardType,
		type CellState,
		type Player
	} from "@/lib/utils.ts";

	interface Props {
		player: Player | null;
		ultimateWinner: CellState;
		updateState: (player: Player | null, ultimateWinner: CellState) => void;
		gameBoard?: UltimateBoard;
		activeBoard?: [number, number] | null;
		onMove?: (boardRow: number, boardCol: number, row: number, col: number) => boolean;
		isMultiplayer?: boolean;
		canPlay?: boolean;
	}

	let { player, ultimateWinner, updateState, gameBoard, activeBoard, onMove, isMultiplayer = false, canPlay = true }: Props = $props();

	let boards: UltimateBoard = $state(gameBoard || createEmptyUltimateBoard());
	let localActiveBoard: [number, number] | null = $state(null);
	let wonBoards: BoardType = $state(createEmptyBoard());

	// effect runs whenever any of the props change
	// if the state of gameBoard changes, update the local boards
	$effect(() => {
		if (gameBoard && isMultiplayer) {
			boards = gameBoard;
			wonBoards = boards.map((boardRow) => boardRow.map((board) => checkWin(board)));
		}
	});

	function handleMove(event: MoveEvent, boardRow: number, boardCol: number) {
		let { row, col, player } = event;

		// Multiplayer flow delegates validation to the server
		if (isMultiplayer && onMove) {
			return onMove(boardRow, boardCol, row, col);
		}

		//#region Single Player
		// check whether game already over or whether board already won/drawn
		if (ultimateWinner) return;
		if (wonBoards[boardRow][boardCol]) return;

		// check whether move is in the active board
		const currentActive = localActiveBoard;
		if (currentActive && (currentActive[0] !== boardRow || currentActive[1] !== boardCol)) {
			return;
		}

		// make move
		boards[boardRow][boardCol][row][col] = player;

		// Check local board winner/draw and then ultimate winner
		const boardWinner = checkWin(boards[boardRow][boardCol]);
		if (boardWinner) {
			wonBoards[boardRow][boardCol] = boardWinner;
			ultimateWinner = checkUltimateWinner(wonBoards);
		}

		// get next active sub-board
		// if the target sub-board is already won/drawn OR becomes full/drawn now, allow any board
		const targetState = checkWin(boards[row][col]);
		if (targetState && !wonBoards[row][col]) {
			wonBoards[row][col] = targetState;
		}
		if (!wonBoards[row][col]) {
			localActiveBoard = [row, col]; // next move must be in the corresponding board
		} else {
			localActiveBoard = null; // any board can be played next
		}

		// switch player and update state
		player = player === "x" ? "o" : "x";
		updateState(player, ultimateWinner ?? null);

		//#endregion
	}

	function isActive(boardRow: number, boardCol: number): boolean {
		const currentActiveBoard = isMultiplayer ? activeBoard : localActiveBoard;

		return !ultimateWinner && !wonBoards[boardRow][boardCol] && (!currentActiveBoard || (currentActiveBoard[0] === boardRow && currentActiveBoard[1] === boardCol));
	}
</script>

<table class="board">
	<tbody>
		{#each boards as row, rowIndex}
			<tr>
				{#each row as board, colIndex}
					<td class="square {rowIndex === 0 ? 'top' : rowIndex === 2 ? 'bottom' : ''} {colIndex === 0 ? 'left' : colIndex === 2 ? 'right' : ''}">
						<div class="board-container">
							<Board
								{board}
								winner={wonBoards[rowIndex][colIndex]}
								{player}
								isActive={isActive(rowIndex, colIndex)}
								canPlay={canPlay && isActive(rowIndex, colIndex) && !ultimateWinner}
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
