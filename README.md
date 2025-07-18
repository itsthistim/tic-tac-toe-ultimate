# Ultimate Tic Tac Toe

An Ultimate Tic Tac Toe game built with Astro, Svelte, and Tauri with multiplayer support using [Socket.IO](https://socket.io/).<br/>
Playable at https://tic-tac-toe.thistim.me/

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/itsthistim/tic-tac-toe-ultimate.git
    cd tic-tac-toe-ultimate
    ```

2. Install dependencies:

    ```bash
    pnpm install
    ```

3. Start the development server:

    ```bash
    pnpm run dev
    ```

4. (Optional) Build for Tauri desktop app:

    ```bash
    pnpm run tauri dev
    ```

## Project Structure

-   `src/components/` — Svelte 5 components using modern runes syntax
-   `src/lib/utils.ts` — Centralized win/draw logic and TypeScript types
-   `src-tauri/` — Tauri configuration and Rust backend
-   `src/pages/index.astro` — Main game page

## Game Rules

Ultimate Tic Tac Toe consists of 9 regular tic-tac-toe boards arranged in a 3×3 grid. Players take turns, and the position of their move determines which board the opponent must play in next. Win 3 boards in a row to win the ultimate game!

Read more about the rules on the [Wikipedia page](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe).
