import { io, Socket } from "socket.io-client";
import type { Room, RoomMember, Player, UltimateBoard } from "../utils";

export class MultiplayerClient {
	private socket: Socket;
	private connected: boolean = false;

	constructor() {
		this.socket = io("http://localhost:3001");

		this.socket.on("connect", () => {
			this.connected = true;
		});

		this.socket.on("disconnect", () => {
			this.connected = false;
		});

		this.socket.on("connect_error", (error) => {
			this.connected = false;
			console.error("Client: Connection error:", error);
		});
	}

	isConnected(): boolean {
		return this.connected;
	}

	joinRoom(roomId: string): void {
		this.socket.emit("join-room", roomId);
	}

	onRoomJoined(callback: (data: RoomMember & { room: Room }) => void): void {
		this.socket.on("joined-room", callback);
	}

	onPlayerJoined(callback: (data: Room) => void): void {
		this.socket.on("player-joined", callback);
	}

	makeMove(roomId: string, boardRow: number, boardCol: number, row: number, col: number): void {
		this.socket.emit("make-move", { roomId, boardRow, boardCol, row, col });
	}

	onMoveMade(callback: (data: {
		roomId: string;
		boardRow: number;
		boardCol: number;
		row: number;
		col: number;
		player: Player;
		boardWinner: Player | "draw" | null;
		currentPlayer: Player;
		winner: Player | "draw" | null;
		board: UltimateBoard;
		activeBoard: [number, number] | null;
	}) => void): void {
		this.socket.on("move-made", callback);
	}

	disconnect(): void {
		this.socket.disconnect();
	}
}
