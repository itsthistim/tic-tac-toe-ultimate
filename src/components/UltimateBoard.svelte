<script>
	import Board from "@/components/Board.svelte";

	let boards = Array(3)
		.fill(null)
		.map(() =>
			Array(3)
				.fill(null)
				.map(() =>
					Array(3)
						.fill(null)
						.map(() => Array(3).fill(null))
				)
		);

	// boards[0][0] = [
	// 	["x", "o", "x"],
	// 	["o", "x", null],
	// 	["x", null, "o"]
	// ];
</script>

<table class="board">
	<tbody>
		{#each boards as row, rowIndex}
			<tr>
				{#each row as cell, colIndex}
					<td class="square {rowIndex === 0 ? 'top' : rowIndex === 2 ? 'bottom' : ''} {colIndex === 0 ? 'left' : colIndex === 2 ? 'right' : ''}">
						<div class="board-container">
							<Board board={cell} winner={"x"} />
						</div>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	.board {
		border-collapse: collapse;
	}

	.square {
		border: 0.3rem solid #fff;
		width: 150px;
		height: 150px;
		padding: 0;
	}

	.board-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.top {
		border-top: none;
	}

	.bottom {
		border-bottom: none;
	}

	.left {
		border-left: none;
	}

	.right {
		border-right: none;
	}

	/* .square.top.left {
		background-color: rgba(0, 238, 255, 0.3);
	} */
</style>
