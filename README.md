# Quarterly/Weekly Review Builder
An Obsidian plugin that speeds up quarterly (and weekly) reviews, by consolidating Daily and Weekly notes into a single file.

This plugin, was born out of a quarterly review, where I was frustrated with the process of flipping through 13 weekly notes, wondered if I was missing something important.

Now each quarter, I have two files to look at: quarterly_days.md and quarterly_weeks.md. In a world of GenAI, having only two files makes it easier to do a final check at each step the review process. Using your AI tool of choice (Obsidian Copilot in my case), I point the tool at my review file file and the `quarterly_days.md` and `quarterly_weeks.md` files. I ask questions like "looking at my review file so far, is there anything I missed?"

## Commands
- **Build Quarterly Review** - asks which quarter to compile notes for, then finds all the Daily and Weekly notes from the Quarter.
- **Build Weekly Review** - asks which week to compile notes for, then finds all the Daily notes from the Week. It also adds the previous week's review file at the top of the file.

## Settings
- **Temp Folder**: Select which folder to use for temporary files.

## Installation

### Manual Installation (for development/testing)
1. Clone or download this repository
2. Copy the `main.js`, `manifest.json`, and `styles.css` (if present) files to your vault's plugins directory:
   ```
   <VaultFolder>/.obsidian/plugins/quarterly-review-builder/
   ```
3. Reload Obsidian
4. Enable the plugin in **Settings → Community plugins**

### From Community Plugins (when available)

1. Open **Settings → Community plugins**
2. Disable **Safe mode**
3. Click **Browse** and search for "Quarterly Review Builder"
4. Click **Install** and then **Enable**

## Usage

### Creating a Quarterly Review

1. Ensure the **Periodic Notes** plugin is installed and enabled
2. Open Command Palette (Ctrl/Cmd + P)
3. Type "Build Quarterly Review" and select the command
4. Select which quarter you want to review from the list
5. The plugin will:
   - Scan for your Daily and Weekly notes using Periodic Notes settings
   - Create separate temp files for Daily Notes (`quaterly_days.md`) and Weekly Notes (`quaterly_weeks.md`)
   - Include references to the separate Daily and Weekly notes temp files

### Configuring Settings

1. Go to **Settings → Plugin Options → Quarterly Review Builder**
2. Set your preferred **Temp Folder Path** (default: "temp")
   - The folder will be created automatically if it doesn't exist
   - Use forward slashes for nested folders (e.g., "reviews/quarterly")
3. Configure your quarters in the settings (dates for Q1, Q2, Q3, Q4)

## Notes Integration

The plugin automatically:
- Finds all Daily notes in your configured Daily notes folder
- Finds all Weekly notes in your configured Weekly notes folder
- Creates separate temp files for Daily (`quaterly_days.md`) and Weekly (`quaterly_weeks.md`) notes
- Includes the full content of each note type in their respective temp files
- Provides references to these temp files in the main quarterly review
- Shows folder paths and date formats being used
- Handles cases where folders don't exist or contain no notes

### Temp Files Created

When you run the quarterly review builder, the following files may be created in your temp folder:

- `quaterly_days.md` - Contains all Daily notes content with headers and formatting
- `quaterly_weeks.md` - Contains all Weekly notes content with headers and formatting
- `Q{quarter}_{year}_Review.md` - Main quarterly review file with references to the above temp files

The temp files are automatically overwritten each time you run the command to ensure they contain the most current data.

## Development

This plugin is built using:

- **TypeScript** for type safety
- **esbuild** for fast bundling
- **Obsidian API** for plugin functionality

### Building from Source

```bash
# Install dependencies
npm install

# Development build (with watch mode)
npm run dev

# Production build
npm run build
```

### Project Structure

```
src/
├── main.ts              # Plugin entry point and lifecycle
├── settings.ts          # Settings interface and defaults
├── commands/
│   ├── index.ts         # Command registration
│   └── quarterly-review.ts # Quarterly review implementation
├── utils/
│   └── periodic-notes-integration.ts # Periodic Notes plugin integration
└── ui/
    └── settings-tab.ts  # Settings UI component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[MIT License](LICENSE)

## Troubleshooting

### Common Issues
- **"Daily/Weekly notes folder does not exist"**: Check your Periodic Notes settings and create the folders
- **"No daily/weekly notes found"**: Ensure you have notes in the correct format in the configured folders
- **Links not working in quarterly review**: Ensure the temp files (`quaterly_days.md`, `quaterly_weeks.md`) exist in the same folder as your quarterly review file

## Support

If you encounter any issues or have feature requests, please create an issue on the GitHub repository.

---

*Built with ❤️ for the Obsidian community*
