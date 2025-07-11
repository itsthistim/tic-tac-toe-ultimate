export type Player = "x" | "o";
export type CellState = Player | "draw" | null;
export type Board = CellState[][];
export type UltimateBoards = Board[][];

export interface MoveEvent {
	row: number;
	col: number;
	player: Player;
	winner: CellState;
	board: Board;
}

/**
 * Check if a 3x3 board has a winner (without checking for draws)
 * @param board - 3x3 board to check
 * @returns Winning player ("x" or "o"), "draw" if all boards are completed, or null if no winner
 */
export function checkWin(board: Board): CellState {
	// Check rows
	for (let i = 0; i < 3; i++) {
		if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
			return board[i][0] as Player;
		}
	}

	// Check columns
	for (let j = 0; j < 3; j++) {
		if (board[0][j] && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
			return board[0][j] as Player;
		}
	}

	// Check diagonals
	if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
		return board[0][0] as Player;
	}
	if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
		return board[0][2] as Player;
	}

	// check for draw
	if (isBoardFull(board)) {
		return "draw";
	}

	return null;
}

/**
 * Check if there's an ultimate winner
 * @param boardWinners - 3x3 grid of board winners
 * @returns Ultimate winner or null
 */
export function checkUltimateWinner(boardWinners: Board): CellState {
	// remove boards that ended in a draw, only check boards with winners
	const filteredBoard: Board = boardWinners.map((row) => row.map((cell) => (cell === "draw" ? null : cell)));

	const winner = checkWin(filteredBoard);
	if (winner) {
		return winner;
	}

	// Check if all boards are completed (either won or drawn)
	const allBoardsCompleted = boardWinners.every((row) => row.every((cell) => cell !== null));

	if (allBoardsCompleted) {
		return "draw";
	}

	return null;
}

/**
 * Check if a boards cells are all filled
 * @param board - board to check
 * @returns true if board is full, false otherwise
 */
export function isBoardFull(board: Board): boolean {
	return board.every((row) => row.every((cell) => cell !== null));
}

/**
 * Check if a board is drawn
 * @param board - board to check
 * @returns true if board is drawn, false otherwise
 */
export function isBoardDraw(board: Board): boolean {
	return isBoardFull(board) && checkWin(board) === null;
}

/**
 * Create an empty 3x3 board
 * @returns A new empty board
 */
export function createEmptyBoard(): Board {
	return Array(3)
		.fill(null)
		.map(() => Array(3).fill(null));
}

/**
 * Create empty ultimate boards (3x3 grid of 3x3 boards)
 * @returns A new set of empty boards for ultimate tic-tac-toe
 */
export function createEmptyUltimateBoard(): UltimateBoards {
	return Array(3)
		.fill(null)
		.map(() =>
			Array(3)
				.fill(null)
				.map(() => createEmptyBoard())
		);
}
