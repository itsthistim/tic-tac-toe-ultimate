<script lang="ts">
	import StatusBar from "@/components/StatusBar.svelte";
	import UltimateBoard from "@/components/UltimateBoard.svelte";
	import GameModeSelector from "@/components/GameModeSelector.svelte";
	import type { Player, CellState, Room, RoomMember, UltimateBoard as UltimateBoardType } from "@/lib/utils.ts";
	import { MultiplayerClient } from "@/lib/multiplayer/client";
	import { createEmptyUltimateBoard } from "@/lib/utils";

	let multiplayerClient: MultiplayerClient | null = $state(null);
	let gameMode: "singleplayer" | "multiplayer" = $state("singleplayer");

	// Game state
	let player: Player | null = $state("x");
	let winner: CellState = $state(null);
	let gameBoard: UltimateBoardType = $state(createEmptyUltimateBoard());
	let activeBoard: [number, number] | null = $state(null);

	// Multiplayer
	let room: Room | null = $state(null);
	let roomID: Room["roomId"] = $state("");
	let playerType: Player | null = $state(null);
	let isInRoom: boolean = $state(false);
	let isConnected: boolean = $state(false);

	function initMultiplayer() {
		if (!multiplayerClient) {
			multiplayerClient = new MultiplayerClient();

			multiplayerClient.onConnectionStatusChange((connected) => {
				isConnected = connected;
			});

			multiplayerClient.onRoomJoined((data) => {
				room = data.room;
				playerType = data.playerType;
				isInRoom = true;
			});

			multiplayerClient.onPlayerJoined((updatedRoom: Room) => {
				room = updatedRoom;
			});

			multiplayerClient.onMoveMade((moveData) => {
				if (room) {
					gameBoard = moveData.board;
					activeBoard = moveData.activeBoard;
					player = moveData.currentPlayer;
					winner = moveData.winner;
					room.currentPlayer = moveData.currentPlayer;
					room.winner = moveData.winner;
					room.board = moveData.board;
					room.activeBoard = moveData.activeBoard;
				}
			});
		}
	}

	function handleMultiplayerMove(boardRow: number, boardCol: number, row: number, col: number) {
		// check if the move is valid
		if (!room || !playerType || room.currentPlayer !== playerType || room.winner || !multiplayerClient) {
			return false;
		}

		multiplayerClient.makeMove(room.roomId, boardRow, boardCol, row, col);
		return true;
	}

	function handleJoinRoom(roomId: Room["roomId"]) {
		if (!roomId.trim()) {
			return alert("Please enter a room name.");
		}

		if (!multiplayerClient) {
			initMultiplayer();
		}
		multiplayerClient?.joinRoom(roomId.trim());
	}

	function handleLeaveRoom() {
		multiplayerClient?.disconnect();
		isInRoom = false;
		room = null;
		playerType = null;
		resetGame();
	}

	function resetGame() {
		gameBoard = createEmptyUltimateBoard();
		activeBoard = null;
		player = "x";
		winner = null;
	}

	function switchToSingleplayer() {
		gameMode = "singleplayer";
		isInRoom = false;
		room = null;
		playerType = null;
		resetGame();
	}

	function switchToMultiplayer() {
		gameMode = "multiplayer";
		initMultiplayer();
	}

	function handleRoomIdChange(newRoomId: string) {
		roomID = newRoomId;
	}

	function updateState(newPlayer: Player | null, newWinner: CellState) {
		player = newPlayer;
		winner = newWinner;
	}
</script>

<div class="game">
	<StatusBar {player} {winner} />
	<UltimateBoard
		{player}
		ultimateWinner={winner}
		{updateState}
		{gameBoard}
		{activeBoard}
		onMove={gameMode === "multiplayer" ? handleMultiplayerMove : undefined}
		isMultiplayer={gameMode === "multiplayer"}
		canPlay={gameMode === "singleplayer" || (isInRoom && room?.isGameReady && room?.currentPlayer === playerType && !room?.winner)}
	/>
	<GameModeSelector
		{gameMode}
		{multiplayerClient}
		{room}
		{roomID}
		{playerType}
		{isInRoom}
		{isConnected}
		onSwitchToSingleplayer={switchToSingleplayer}
		onSwitchToMultiplayer={switchToMultiplayer}
		onJoinRoom={handleJoinRoom}
		onLeaveRoom={handleLeaveRoom}
		onRoomIdChange={handleRoomIdChange}
	/>
</div>

<style>
	.game {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 20px;
	}
</style>
