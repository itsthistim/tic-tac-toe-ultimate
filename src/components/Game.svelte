<script lang="ts">
	import StatusBar from "@/components/StatusBar.svelte";
	import UltimateBoard from "@/components/UltimateBoard.svelte";

	let player: "x" | "o" = $state("x");
	let winner: "x" | "o" | "draw" | null = $state(null);

	function updateState(newPlayer: "x" | "o", newWinner: "x" | "o" | "draw" | null) {
		player = newPlayer;
		winner = newWinner;
	}
</script>

<div class="game">
	<StatusBar {player} {winner} />
	<UltimateBoard {player} ultimateWinner={winner} {updateState} />
</div>

<style>
	.game {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
	}
</style>
