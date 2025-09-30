# Quarterly Review Builder

An Obsidian plugin that helps you create structured quarterly reviews by integrating with your Daily and Weekly notes from the Periodic Notes plugin.

## Features

- **Quarter Selection**: Choose which quarter to review from your configured quarters
- **Periodic Notes Integration**: Automatically finds and includes your Daily and Weekly notes
- **Configurable Temp Folder**: Set a custom folder path where quarterly review files will be created
- **Notes Aggregation**: Automatically includes content from your Daily and Weekly notes in the review
- **Structured Template**: Creates a comprehensive quarterly review template with sections for:
  - Goals & Objectives
  - Key Achievements
  - Challenges & Lessons Learned
  - Metrics & KPIs
  - Next Quarter Planning
  - Action Items
  - Aggregated Notes from Periodic Notes

## Dependencies

This plugin requires the **Periodic Notes** plugin to be installed and enabled:
- Install from Community Plugins: [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes)
- The plugin will automatically detect your Daily and Weekly notes configuration
- Works with custom folder paths and date formats configured in Periodic Notes

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
   - Create a new markdown file in your configured temp folder
   - Name the file `Q{quarter}_{year}_Review.md` (e.g., `Q2_2024_Review.md`)
   - Include all found Daily and Weekly notes content in the review
   - Open the file with a pre-filled template and aggregated notes

### Configuring Settings

1. Go to **Settings → Plugin Options → Quarterly Review Builder**
2. Set your preferred **Temp Folder Path** (default: "temp")
   - The folder will be created automatically if it doesn't exist
   - Use forward slashes for nested folders (e.g., "reviews/quarterly")
3. Configure your quarters in the settings (dates for Q1, Q2, Q3, Q4)

### Periodic Notes Configuration

The plugin automatically uses your Periodic Notes settings:
- **Daily Notes**: Folder path and date format from Periodic Notes
- **Weekly Notes**: Folder path and date format from Periodic Notes
- If folders don't exist or no notes are found, the plugin will notify you
- Supports custom date formats configured in Periodic Notes

## Template Structure

The generated quarterly review includes the following sections:

- **Quarter Overview**: Basic information about the period, including notes count
- **Goals & Objectives**: Checklist format for tracking goals
- **Key Achievements**: List of accomplishments
- **Challenges & Lessons Learned**: Reflection on difficulties and learning
- **Metrics & KPIs**: Table format for tracking key performance indicators
- **Next Quarter Planning**: Forward-looking priorities and action items
- **Notes from Periodic Notes**: Automatically aggregated Daily and Weekly notes
- **Additional Notes**: Space for additional reflections

## Notes Integration

The plugin automatically:
- Finds all Daily notes in your configured Daily notes folder
- Finds all Weekly notes in your configured Weekly notes folder
- Includes the full content of each note in the quarterly review
- Provides summaries of how many notes were found
- Shows folder paths and date formats being used
- Handles cases where folders don't exist or contain no notes

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

- **"Periodic Notes plugin is required but not found"**: Install and enable the Periodic Notes plugin
- **"Daily/Weekly notes folder does not exist"**: Check your Periodic Notes settings and create the folders
- **"No daily/weekly notes found"**: Ensure you have notes in the correct format in the configured folders
- **Notes not appearing in review**: Verify your date format settings in Periodic Notes match your actual note names

## Support

If you encounter any issues or have feature requests, please create an issue on the GitHub repository.

---

*Built with ❤️ for the Obsidian community*