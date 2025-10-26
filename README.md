<img src="src/assets/img/icon-128.png" width="64"/>

# Summa - AI-Powered Webpage Summarizer

A Chrome extension that uses OpenAI's GPT-4o-mini to intelligently summarize webpages.

## Overview

Summa is a powerful Chrome extension that allows you to quickly summarize any webpage using AI. Simply click the extension icon to open the summarizer in a new tab, and get concise summaries in your preferred format (characters, words, or paragraphs).

## Features

- 🤖 **AI-Powered Summaries**: Uses OpenAI's GPT-4o-mini for high-quality webpage summarization
- 📏 **Flexible Output**: Choose summary length in characters, words, or paragraphs
- 🎨 **Customizable UI**: Clean, minimal design with customizable accent colors
- 📤 **Multiple Share Options**:
  - Copy to clipboard
  - Save as text file
  - Share via email
  - Copy to Apple Notes
- ⚙️ **Dedicated Options Page**: Easy configuration of API key and color preferences
- 🔒 **Secure**: API key stored locally using Chrome's sync storage API
- ⚡ **Fast**: Built with React 18 and optimized for performance

## Tech Stack

- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-overview/)
- [React 18](https://reactjs.org) with TypeScript
- [Webpack 5](https://webpack.js.org/)
- [OpenAI GPT-4o-mini API](https://platform.openai.com/docs/models/gpt-4o-mini)

## Prerequisites

- [Node.js](https://nodejs.org/) version >= **18**
- An OpenAI API key (get one at [platform.openai.com](https://platform.openai.com/api-keys))
- Google Chrome browser

## Installation

### For Development:

1. Clone this repository:
   ```bash
   git clone https://github.com/eddyborg/chrome-summa.git
   cd chrome-summary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```
   Or for development with auto-reload:
   ```bash
   npm start
   ```

4. Load the extension in Chrome:
   1. Open Chrome and navigate to `chrome://extensions/`
   2. Enable "Developer mode" (toggle in the top right)
   3. Click "Load unpacked"
   4. Select the `build` folder from this project

5. The Summa icon should now appear in your Chrome toolbar!

### First Time Setup:

1. Click the Summa extension icon to open the summarizer
2. Enter your OpenAI API key when prompted in the panel
3. Click "Save API Key"

Alternatively, you can configure settings at any time:
1. Right-click the Summa extension icon
2. Select "Options"
3. Enter your OpenAI API key and customize your accent color
4. Click "Save"

Your API key will be securely stored locally in Chrome's sync storage and synced across your devices.

## Usage

1. Navigate to any webpage you want to summarize
2. Click the Summa extension icon in your toolbar to open the summarizer
3. The summarizer will open in a new tab
4. Configure your summary preferences:
   - Enter the desired length (number)
   - Choose the unit (characters, words, or paragraphs)
   - Default is 1 paragraph
5. Click "Summarize" to generate the summary
6. The extension will extract content from your most recently active tab
7. Wait for the AI to process the content (usually 5-10 seconds)
8. Review your summary in the text area
9. Use the share buttons to:
   - 📋 Copy to clipboard
   - 💾 Save as a text file
   - 📧 Open in your email client
   - 📝 Copy for Apple Notes

**Note**: Make sure the webpage you want to summarize is open in another tab. The summarizer will automatically extract content from the most recently active tab.

## Project Structure

```
src/
├── pages/
│   ├── Panel/           # Main summarization interface (opens in new tab)
│   │   ├── Panel.tsx    # Main UI component with summarization logic
│   │   ├── Panel.css    # Styling for the panel
│   │   └── index.html   # Panel HTML template
│   ├── Popup/           # Extension popup (launcher)
│   │   ├── Popup.jsx    # Popup component
│   │   └── Popup.css    # Popup styling
│   ├── Options/         # Options/Settings page
│   │   ├── Options.tsx  # Settings UI (API key & accent color)
│   │   ├── Options.css  # Options page styling
│   │   └── index.html   # Options HTML template
│   ├── Content/         # Content script for extracting page content
│   │   └── index.js     # Page content extraction logic
│   └── Background/      # Background service worker
│       └── index.js     # Extension background logic
├── assets/
│   └── img/            # Extension icons
└── manifest.json       # Chrome Extension manifest
```

## Development

### Building for Production

```bash
NODE_ENV=production npm run build
```

The `build` folder will contain the extension ready for the Chrome Web Store.

### Auto-reload in Development

```bash
npm start
```

This starts Webpack Dev Server with hot reload. Changes to most files will automatically reload the extension.

### Changing Port (Optional)

```bash
PORT=6002 npm start
```

## Configuration & Customization

### API Key Security
- Your OpenAI API key is stored securely using Chrome's `chrome.storage.sync` API
- The key never leaves your browser
- It's synchronized across your Chrome devices if you're signed in
- You can update or remove it anytime via the Settings button in the panel or the Options page

### Accent Color Customization
- Choose from 8 preset colors (Green, Blue, Purple, Pink, Orange, Red, Teal, Indigo)
- Or use a custom color picker for any hex color
- Color preference is saved and synced across your devices
- Access this feature via the Options page (right-click extension icon → Options)

## Troubleshooting

**"Content script not loaded. Try refreshing the page."**
- The content script hasn't been injected into the page yet
- Refresh the webpage you want to summarize and try again
- Some pages (like `chrome://` or `edge://` pages) cannot be accessed by extensions

**"Cannot access this page. Please navigate to a regular webpage."**
- You're trying to summarize a protected page (like Chrome settings or extension pages)
- Navigate to a regular webpage (http:// or https://) and try again

**"Failed to generate summary"**
- Check that your API key is valid
- Ensure you have credits in your OpenAI account
- Check your internet connection
- Verify the API key is correctly saved in Settings

**"No content found on this page"**
- The page might have very little text content
- The page might use unusual formatting that prevents content extraction
- Try a different webpage

**Extension not loading**
- Make sure you've run `npm run build` or `npm start`
- Check that Developer mode is enabled in `chrome://extensions/`
- Try clicking the refresh icon on the extension card in `chrome://extensions/`
- Check the browser console for any error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

---

Built with ❤️ using React, TypeScript, and OpenAI
