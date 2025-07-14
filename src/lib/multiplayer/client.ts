import { io, Socket } from "socket.io-client";
import type { Room, RoomMember, Player, UltimateBoard } from "../utils";

export class MultiplayerClient {
	private socket: Socket;
	private connected: boolean = false;

	private roomJoinedCallback?: (data: RoomMember & { room: Room }) => void;
	private playerJoinedCallback?: (data: Room) => void;
	private moveMadeCallback?: (data: any) => void;
	private connectionStatusCallback?: (connected: boolean) => void;

	constructor() {
		this.socket = io(import.meta.env.VITE_SOCKET_ENDPOINT);

		this.socket.on("connect", () => {
			this.connected = true;
			this.connectionStatusCallback?.(true);
		});

		this.socket.on("disconnect", () => {
			this.connected = false;
			this.connectionStatusCallback?.(false);
		});

		this.socket.on("connect_error", (error) => {
			this.connected = false;
			console.error("🚨 Client: Connection error:", error);
			this.connectionStatusCallback?.(false);
		});

		this.socket.on("joined-room", (data) => {
			this.roomJoinedCallback?.(data);
		});

		this.socket.on("player-joined", (data) => {
			this.playerJoinedCallback?.(data);
		});

		this.socket.on("move-made", (data) => {
			this.moveMadeCallback?.(data);
		});
	}

	isConnected(): boolean {
		return this.connected;
	}

	joinRoom(roomId: string): void {
		this.socket.emit("join-room", roomId);
	}

	onRoomJoined(callback: (data: RoomMember & { room: Room }) => void): void {
		this.roomJoinedCallback = callback;
	}

	onPlayerJoined(callback: (data: Room) => void): void {
		this.playerJoinedCallback = callback;
	}

	makeMove(roomId: string, boardRow: number, boardCol: number, row: number, col: number): void {
		this.socket.emit("make-move", { roomId, boardRow, boardCol, row, col });
	}

	onMoveMade(
		callback: (data: {
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
		}) => void
	): void {
		this.moveMadeCallback = callback;
	}

	onConnectionStatusChange(callback: (connected: boolean) => void): void {
		this.connectionStatusCallback = callback;
		// Immediately call with current status
		callback(this.connected);
	}

	disconnect(): void {
		this.socket.disconnect();
	}
}
