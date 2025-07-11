import { Server } from "socket.io";
import type { Player } from "../utils";

interface GameRoom {
	players: { socketId: string; playerType: Player }[];
	currentPlayer: Player;
	winner: Player | "draw" | null;
}

export class Multiplayer {
	private io: Server;
	private rooms = new Map<string, GameRoom>();

	constructor() {
		const port = 3001;

		this.io = new Server(port, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"]
			}
		});

		this.io.on("connection", (socket) => {
			socket.on("join-room", (roomId: string) => {
				socket.join(roomId);

				// Initialize room if it doesn't exist
				if (!this.rooms.has(roomId)) {
					this.rooms.set(roomId, {
						players: [],
						currentPlayer: "x",
						winner: null
					});
				}

				const room = this.rooms.get(roomId)!;
				const playerCount = this.io.sockets.adapter.rooms.get(roomId)?.size || 0;
				const playerType = playerCount === 1 ? "x" : "o";

				// Add player to room
				room.players.push({ socketId: socket.id, playerType });

				// Send room data to joining player
				socket.emit("room-joined", {
					roomId,
					playerCount,
					playerType,
					isGameReady: playerCount === 2
				});

				// Send game state to joining player
				socket.emit("game-state-updated", {
					currentPlayer: room.currentPlayer,
					winner: room.winner
				});

				// Notify other players in room
				socket.to(roomId).emit("player-joined", {
					playerId: socket.id,
					playerCount
				});

				// If game is now ready, notify all players of game state
				if (playerCount === 2) {
					this.io.to(roomId).emit("game-state-updated", {
						currentPlayer: room.currentPlayer,
						winner: room.winner
					});
				}
			});

			socket.on("disconnect", () => {
				// Clean up rooms when player disconnects
				for (const [roomId, room] of this.rooms.entries()) {
					const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
					if (playerIndex > -1) {
						room.players.splice(playerIndex, 1);
						
						const remainingCount = room.players.length;
						
						// Notify remaining players
						socket.to(roomId).emit("player-joined", {
							playerId: socket.id,
							playerCount: remainingCount
						});
						
						if (remainingCount === 0) {
							this.rooms.delete(roomId);
						}
					}
				}
			});
		});
	}
}

let multiplayer = new Multiplayer();
