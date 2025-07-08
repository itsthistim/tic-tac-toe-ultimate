# Tauri + Astro

A simple Tauri application using Astro for the frontend and Rust for the backend, with WebAssembly (WASM) support.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/itsthistim/tic-tac-toe-ultimate.git
    cd tic-tac-toe-ultimate
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Build the WASM module:

    ```bash
    wasm-pack build --target web --out-dir src/wasm
    ```

4. Start the Tauri development server:

    ```bash
    npm run tauri dev
    ```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
