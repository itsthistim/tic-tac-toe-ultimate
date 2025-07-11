import { io, Socket } from "socket.io-client";
import type { Player } from "../utils";

export interface Room {
	roomId: string;
	playerCount: number;
	playerType: Player;
	isGameReady: boolean;
}

export interface GameState {
	currentPlayer: Player;
	winner: Player | "draw" | null;
}

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
			console.error("Client: Connection error:", error);
		});
	}

	isConnected(): boolean {
		return this.connected;
	}

	joinRoom(roomId: string): void {
		this.socket.emit("join-room", roomId);
	}

	onRoomJoined(callback: (data: Room) => void): void {
		this.socket.on("room-joined", callback);
	}

	onPlayerJoined(callback: (data: { playerId: string; playerCount: number }) => void): void {
		this.socket.on("player-joined", callback);
	}

	onGameStateUpdated(callback: (data: GameState) => void): void {
		this.socket.on("game-state-updated", callback);
	}

	disconnect(): void {
		this.socket.disconnect();
	}
}
