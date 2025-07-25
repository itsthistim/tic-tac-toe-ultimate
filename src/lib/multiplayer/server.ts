import { Server } from "socket.io";
import { createServer } from "http";
import { createEmptyUltimateBoard, checkWin, checkUltimateWinner } from "../utils";
import type { Room, RoomMember, Move } from "../utils";

export class Multiplayer {
	private io: Server;
	private rooms = new Map<string, Room>();

	constructor() {
		const port = process.env.PORT ? parseInt(process.env.PORT) : 3002;

		const httpServer = createServer();

		this.io = new Server(httpServer, {
			cors: {
				origin: ["https://tic-tac-toe.thistim.me", "http://localhost:3001"],
				methods: ["GET", "POST"],
				credentials: true
			}
		});

		httpServer.listen(port);
		console.log(`Server: Listening on port ${port}`);

		this.io.on("connection", (socket) => {
			console.log("Server: New client connected:", socket.id);
			socket.on("join-room", (roomId: string) => {
				this.handlePlayerJoin(socket, roomId);
			});

			socket.on("disconnect", () => {
				this.handlePlayerDisconnect(socket.id);
			});

			socket.on("make-move", (data: Move) => {
				const room = this.rooms.get(data.roomId);
				if (!room || room.winner) return;

				const player = room.players.find((p) => p.socketId === socket.id);
				if (!player || player.playerType !== room.currentPlayer) return;

				if (!this.isValidMove(room, data, player)) return;

				// make move
				this.makeMove(room, data, player);

				const boardWinner = checkWin(room.board[data.boardRow][data.boardCol]);
				let wonBoards = room.board.map((boardRow) => boardRow.map((board) => checkWin(board)));

				// get the next active board
				let nextActiveBoard = this.getNextActiveBoard(room, data);
				room.activeBoard = nextActiveBoard;

				const ultimateWinner = checkUltimateWinner(wonBoards);
				if (ultimateWinner) {
					room.winner = ultimateWinner === "draw" ? "draw" : ultimateWinner;
				}

				if (!room.winner) {
					room.currentPlayer = room.currentPlayer === "x" ? "o" : "x";
				}

				this.io.to(data.roomId).emit("move-made", {
					...data,
					player: player.playerType,
					boardWinner,
					currentPlayer: room.currentPlayer,
					winner: room.winner,
					board: room.board,
					activeBoard: room.activeBoard
				});
			});
		});
	}

	/**
	 * Check if a move is valid
	 * @param {Room} room - The room where the move is being made
	 * @param {Move} data - The move data containing roomId, boardRow, boardCol, row, and col
	 */
	private isValidMove(room: Room, data: Move, player: RoomMember): boolean {
		// check if the cell is already occupied
		if (room.board[data.boardRow][data.boardCol][data.row][data.col] !== null) {
			return false;
		}

		// check if the move happens in the active board
		if (room.activeBoard && (room.activeBoard[0] !== data.boardRow || room.activeBoard[1] !== data.boardCol)) {
			return false;
		}

		return true;
	}

	/**
	 * Make a move on the board
	 * @param {Room} room - The room where the move is being made
	 * @param {Move} data - The move data containing roomId, boardRow, boardCol, row, and col
	 * @param {RoomMember} player - The player making the move
	 */
	private makeMove(room: Room, data: Move, player: RoomMember): void {
		room.board[data.boardRow][data.boardCol][data.row][data.col] = player.playerType;
	}

	/**
	 * Get the next active board based on the last move
	 * @param {Room} room - The room where the move was made
	 * @param {Move} data - The move data
	 * @return {Array<number, number> | null} - The next active board coordinates or null if any board can be played
	 */
	private getNextActiveBoard(room: Room, data: Move): [number, number] | null {
		const wonBoards = room.board.map((boardRow) => boardRow.map((board) => checkWin(board)));
		const targetBoard = wonBoards[data.row][data.col];

		if (!targetBoard) {
			return [data.row, data.col];
		} else {
			return null; // player can move on any board
		}
	}

	/**
	 * Handle player disconnect logic
	 * @param {string} socketId - The socket ID of the disconnected player
	 */
	private handlePlayerDisconnect(socketId: string): void {
		const room = Array.from(this.rooms.values()).find((r) => r.players.some((p) => p.socketId === socketId));

		if (room) {
			room.players = room.players.filter((p) => p.socketId !== socketId);
			if (room.players.length === 0) {
				this.rooms.delete(room.roomId);
			} else {
				this.io.to(room.roomId).emit("player-left", { playerId: socketId, playerCount: room.players.length });
			}
		}
	}

	/**
	 * Create a new room with empty default values
	 * @param {string} roomId - The ID of the room to create
	 * @returns {Room} - The created room object
	 */
	private createRoom(roomId: string): Room {
		const room: Room = {
			roomId,
			players: [],
			isGameReady: false,
			currentPlayer: "x",
			winner: null,
			board: createEmptyUltimateBoard(),
			activeBoard: null
		};
		this.rooms.set(roomId, room);
		return room;
	}

	/**
	 * Handle player joining a room
	 */
	private handlePlayerJoin(socket: any, roomId: string): void {
		socket.join(roomId);

		if (!this.rooms.has(roomId)) {
			this.createRoom(roomId);
		}

		const room = this.rooms.get(roomId)!;
		const playerCount = this.io.sockets.adapter.rooms.get(roomId)?.size || 0;

		room.isGameReady = playerCount === 2;

		const existingTypes = room.players.map((p) => p.playerType);
		let playerType: "x" | "o";
		if (!existingTypes.includes("x")) {
			playerType = "x";
		} else {
			playerType = "o";
		}

		const joinedMember: RoomMember = {
			socketId: socket.id,
			playerType,
			roomId: room.roomId
		};
		room.players.push(joinedMember);

		socket.emit("joined-room", {
			...joinedMember,
			room: room
		});

		socket.to(roomId).emit("player-joined", room);
	}
}

new Multiplayer();
