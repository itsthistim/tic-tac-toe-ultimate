<script lang="ts">
	import StatusBar from "@/components/StatusBar.svelte";
	import UltimateBoard from "@/components/UltimateBoard.svelte";
	import { type Player, type CellState } from "@/lib/utils.ts";

	let player: Player = $state("x");
	let winner: CellState = $state(null);

	function updateState(newPlayer: Player, newWinner: CellState) {
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
