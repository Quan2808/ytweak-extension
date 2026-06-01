# YTweak
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Quan2808/ytweak-extension)

YTweak is a lightweight browser extension designed to enhance your YouTube experience by providing a suite of useful tweaks and features. Customize the YouTube interface and player to your liking.

## Features

YTweak offers several modular features that you can enable or disable individually through a clean, Material UI-based popup.

### General
*   **Replace YouTube Logo**: Swaps the original YouTube logo in the header with the Premium logo.
*   **Clean Sharing Links**: Automatically removes tracking parameters (like `si`, `pp`, `feature`) from YouTube URLs when you copy them or use the share dialog, ensuring cleaner links.

### Player
*   **Show Picture in Picture Button**: Adds a dedicated Picture-in-Picture (PiP) button to the video player controls for easy access.
*   **Show Loop Button**: Adds a button to the player controls to easily toggle looping for the current video.

### Video
*   **Hide Premium Video Quality**: Removes the "Premium" label and associated higher-bitrate quality options from the video quality settings menu.

## Installation

To install this extension locally, follow these steps:

1.  Clone or download this repository as a ZIP file and unzip it.
2.  Navigate to the `Extension/` directory in your terminal.
3.  Install the necessary dependencies by running:
    ```bash
    npm install
    ```
4.  Build the extension files:
    ```bash
    npm run build
    ```
    This will create a `dist` directory inside `Extension/` containing the built extension.
5.  Open your Chromium-based browser (like Chrome, Edge, or Brave) and go to the extensions page (`chrome://extensions`).
6.  Enable "Developer mode" using the toggle in the top-right corner.
7.  Click the "Load unpacked" button.
8.  Select the `dist` directory that was created in step 4.

The YTweak extension should now be installed and active in your browser.

## Development

If you wish to contribute or run the extension in development mode:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Quan2808/ytweak-extension.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd ytweak-extension/Extension
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Follow the [Installation](#installation) steps 5-8, but instead of the `dist` directory, load the `Extension/public` directory. The Vite development server will handle hot-reloading for the popup and other assets.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
