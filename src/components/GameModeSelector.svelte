<script lang="ts">
	import Icon from "@iconify/svelte";
	import type { Player, CellState, Room, RoomMember, UltimateBoard as UltimateBoardType } from "@/lib/utils.ts";
	import type { MultiplayerClient } from "@/lib/multiplayer/client.ts";

	interface Props {
		gameMode: "singleplayer" | "multiplayer";
		multiplayerClient: MultiplayerClient | null;
		room: Room | null;
		roomID: string;
		playerType: Player | null;
		isInRoom: boolean;
		isConnected: boolean;
		onSwitchToSingleplayer: () => void;
		onSwitchToMultiplayer: () => void;
		onJoinRoom: (roomId: string) => void;
		onLeaveRoom: () => void;
		onRoomIdChange: (roomId: string) => void;
	}

	let { gameMode, multiplayerClient, room, roomID, playerType, isInRoom, isConnected, onSwitchToSingleplayer, onSwitchToMultiplayer, onJoinRoom, onLeaveRoom, onRoomIdChange }: Props = $props();

	function handleJoinRoom() {
		onJoinRoom(roomID);
	}

	function handleRoomIdInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onRoomIdChange(target.value);
	}
</script>

<div class="control-panel">
	<div class="mode-selector">
		<h3>Game Mode</h3>
		<div class="mode-buttons">
			<button class={gameMode === "singleplayer" ? "mode-btn active" : "mode-btn"} onclick={onSwitchToSingleplayer}> Solo </button>
			<button class={gameMode === "multiplayer" ? "mode-btn active" : "mode-btn"} onclick={onSwitchToMultiplayer}> Online </button>
		</div>
	</div>

	{#if gameMode === "singleplayer"}
		<div class="solo-info">
			<div class="info-card">
				<h4>Solo Play</h4>
				<p>Play against yourself and practice your skills.</p>
				<small>Take turns as both <span class="player-x"><Icon icon="ph:x" /></span> and <span class="player-o"><Icon icon="ph:circle" /></span>.</small>
			</div>
		</div>
	{:else}
		<div class="online-info">
			{#if !isInRoom}
				<div class="join-section">
					<h4>Join a Room</h4>
					<div class="join-form">
						<input type="text" placeholder="Room name" value={roomID} oninput={handleRoomIdInput} class="room-input" />
						<button onclick={handleJoinRoom} class="join-btn">Join</button>
					</div>
					<div class="connection-status">
						<span class="status-indicator {isConnected ? 'connected' : 'disconnected'}"></span>
						{isConnected ? "Connected" : "Connecting..."}
					</div>
				</div>
			{:else}
				<div class="room-info">
					<div class="room-header">
						<h4>Room: <strong>{room?.roomId}</strong></h4>
						<button onclick={onLeaveRoom} class="leave-btn">Leave</button>
					</div>
					<div class="player-info">
						<div class="info-row">
							<span class="label">You are:</span>
							<span class="player-{playerType}">
								{#if playerType === "x"}
									<Icon icon="ph:x" />
								{:else if playerType === "o"}
									<Icon icon="ph:circle" />
								{/if}
							</span>
						</div>
						<div class="info-row">
							<span class="label">Players:</span>
							<span class="value">{room?.players.length}/2</span>
						</div>
						<div class="info-row">
							<span class="label">Status:</span>
							<span class="status {room?.isGameReady ? 'ready' : 'waiting'}">
								{room?.isGameReady ? "Ready to play!" : "Waiting for player..."}
							</span>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.control-panel {
		min-width: 280px;
		max-width: 320px;
		color: #ffffff;
		margin-top: 1rem;
	}

	.mode-selector {
		margin-bottom: 32px;
	}

	.mode-selector h3 {
		margin: 0 0 16px 0;
		font-size: 1.5rem;
		font-weight: 600;
		color: #ffffff;
		text-align: center;
	}

	.mode-buttons {
		display: flex;
		gap: 8px;
		background: rgba(255, 255, 255, 0.1);
		padding: 4px;
		border-radius: 12px;
		backdrop-filter: blur(10px);
	}

	.mode-btn {
		flex: 1;
		padding: 12px 16px;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.mode-btn:hover {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.1);
	}

	.mode-btn.active {
		background: rgba(255, 255, 255, 0.2);
		color: #ffffff;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.info-card {
		padding: 24px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16px;
		backdrop-filter: blur(10px);
		text-align: center;
	}

	.info-card h4 {
		margin: 0 0 8px 0;
		font-size: 1.2rem;
		font-weight: 600;
		color: #00efff;
	}

	.info-card p {
		margin: 0 0 8px 0;
		color: rgba(255, 255, 255, 0.9);
		line-height: 1.4;
	}

	.info-card small {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.85rem;
	}

	.join-section {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16px;
		padding: 24px;
		backdrop-filter: blur(10px);
	}

	.join-section h4 {
		margin: 0 0 16px 0;
		font-size: 1.2rem;
		font-weight: 600;
		color: #cf58c8;
		text-align: center;
	}

	.join-form {
		display: flex;
		gap: 8px;
		margin-bottom: 16px;
	}

	.room-input {
		flex: 1;
		padding: 12px 16px;
		border: 2px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.1);
		color: #ffffff;
		font-size: 0.9rem;
		outline: none;
		transition: all 0.3s ease;
	}

	.room-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.room-input:focus {
		border-color: #cf58c8;
		background: rgba(255, 255, 255, 0.15);
	}

	.join-btn {
		padding: 12px 20px;
		border: none;
		border-radius: 8px;
		background: linear-gradient(135deg, #cf58c8, #9333ea);
		color: #ffffff;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(207, 88, 200, 0.3);
	}

	.join-btn:hover {
		box-shadow: 0 6px 16px rgba(207, 88, 200, 0.4);
	}

	.join-btn:active {
		transform: translateY(0);
	}

	.connection-status {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.7);
		justify-content: center;
	}

	.status-indicator {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ef4444;
		animation: pulse 2s infinite;
	}

	.status-indicator.connected {
		background: #22c55e;
		animation: none;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.room-info {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 16px;
		padding: 24px;
		backdrop-filter: blur(10px);
	}

	.room-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.room-header h4 {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		color: #cf58c8;
	}

	.leave-btn {
		padding: 6px 12px;
		border: 1px solid rgba(239, 68, 68, 0.5);
		border-radius: 6px;
		background: rgba(239, 68, 68, 0.1);
		color: #ef4444;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.leave-btn:hover {
		background: rgba(239, 68, 68, 0.2);
		border-color: #ef4444;
	}

	.player-info {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
	}

	.value {
		color: #ffffff;
		font-weight: 500;
	}

	.player-x {
		color: #00efff;
	}

	.player-o {
		color: #cf58c8;
	}

	.status.ready {
		color: #22c55e;
		font-weight: 500;
	}

	.status.waiting {
		color: #f59e0b;
		font-weight: 500;
	}
</style>
