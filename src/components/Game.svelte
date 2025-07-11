<script lang="ts">
	import StatusBar from "@/components/StatusBar.svelte";
	import UltimateBoard from "@/components/UltimateBoard.svelte";
	import { type Player, type CellState } from "@/lib/utils.ts";
	import { MultiplayerClient, type Room, type GameState } from "@/lib/multiplayer/client.ts";

	let player: Player = $state("x");
	let winner: CellState = $state(null);
	let multiplayerClient = new MultiplayerClient();

	let roomInfo: Room | null = $state(null);
	let gameState: GameState | null = $state(null);
	let roomID: string = $state("");
	let isInRoom: boolean = $state(false);
	let myPlayerType: Player = $state("x");

	function updateState(newPlayer: Player, newWinner: CellState) {
		// Only allow moves if in a room and game is ready
		if (!isInRoom || !roomInfo?.isGameReady) {
			return;
		}

		// Only allow the current player to make moves (check against game state)
		if (gameState && gameState.currentPlayer !== myPlayerType) {
			return;
		}

		player = newPlayer;
		winner = newWinner;
	}

	function handleJoinRoom() {
		if (roomID.trim()) {
			multiplayerClient.joinRoom(roomID.trim());
		} else {
			alert("Please enter a room name.");
		}
	}

	multiplayerClient.onRoomJoined((data: Room) => {
		isInRoom = true;
		roomInfo = data;
		myPlayerType = data.playerType; // Store what piece you are (X or O)
	});

	function handleLeaveRoom() {
		isInRoom = false;
		roomInfo = null;
		gameState = null;
		roomID = "";
		player = "x";
		myPlayerType = "x";
	}

	// when another player joins the room, update the ready state for the room
	multiplayerClient.onPlayerJoined((data: { playerId: string; playerCount: number }) => {
		if (roomInfo) {
			roomInfo.playerCount = data.playerCount;
			roomInfo.isGameReady = data.playerCount === 2;
		}
	});

	// Handle game state updates (whose turn, winner, etc.)
	multiplayerClient.onGameStateUpdated((data: GameState) => {
		gameState = data;
		// Update the current turn indicator
		player = data.currentPlayer;
		// Update winner if game is over
		if (data.winner) {
			winner = data.winner === "draw" ? "draw" : data.winner;
		}
	});
</script>

<div class="game">
	<StatusBar {player} {winner} />
	<UltimateBoard {player} ultimateWinner={winner} {updateState} />

	<div class="multiplayer-controls">
		{#if !isInRoom}
			<div>
				<input type="text" placeholder="Enter room name" bind:value={roomID} />
				<button onclick={handleJoinRoom}>Join Room</button>
			</div>
			<p>Status: {multiplayerClient.isConnected() ? "Connected" : "Disconnected"}</p>
		{:else}
			<div>
				<p><strong>Room:</strong> {roomInfo?.roomId}</p>
				<p><strong>You are:</strong> Player {roomInfo?.playerType.toUpperCase()}</p>
				<p><strong>Players:</strong> {roomInfo?.playerCount}/2</p>
				<p><strong>Game:</strong> {roomInfo?.isGameReady ? "Ready" : "Waiting for players..."}</p>
				{#if gameState}
					<p><strong>Current Turn:</strong> Player {gameState.currentPlayer.toUpperCase()}</p>
					{#if gameState.winner}
						<p><strong>Winner:</strong> {gameState.winner === "draw" ? "Draw" : `Player ${gameState.winner.toUpperCase()}`}</p>
					{/if}
				{/if}
				<button onclick={handleLeaveRoom}>Leave Room</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.game {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}

	.multiplayer-controls {
		margin-top: 20px;
		padding: 15px;
		border: 1px solid #ccc;
		border-radius: 8px;
		text-align: center;
	}

	.multiplayer-controls input {
		margin-right: 10px;
		padding: 5px;
	}

	.multiplayer-controls button {
		padding: 5px 10px;
	}
</style>
