# Quarterly Review Builder

An Obsidian plugin that helps you create structured quarterly reviews with a single command and configurable temp folder path.

## Features

- **Single Command**: "Build Quarterly Review" command accessible via Command Palette (Ctrl/Cmd + P)
- **Configurable Temp Folder**: Set a custom folder path where quarterly review files will be created
- **Automatic Quarter Detection**: Automatically determines the current quarter and year
- **Structured Template**: Creates a comprehensive quarterly review template with sections for:
  - Goals & Objectives
  - Key Achievements
  - Challenges & Lessons Learned
  - Metrics & KPIs
  - Next Quarter Planning
  - Action Items

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

1. Open Command Palette (Ctrl/Cmd + P)
2. Type "Build Quarterly Review" and select the command
3. The plugin will:
   - Automatically detect the current quarter (Q1, Q2, Q3, or Q4)
   - Create a new markdown file in your configured temp folder
   - Name the file `Q{quarter}_{year}_Review.md` (e.g., `Q2_2024_Review.md`)
   - Open the file with a pre-filled template

### Configuring Settings

1. Go to **Settings → Plugin Options → Quarterly Review Builder**
2. Set your preferred **Temp Folder Path** (default: "temp")
   - The folder will be created automatically if it doesn't exist
   - Use forward slashes for nested folders (e.g., "reviews/quarterly")

## Template Structure

The generated quarterly review includes the following sections:

- **Quarter Overview**: Basic information about the period
- **Goals & Objectives**: Checklist format for tracking goals
- **Key Achievements**: List of accomplishments
- **Challenges & Lessons Learned**: Reflection on difficulties and learning
- **Metrics & KPIs**: Table format for tracking key performance indicators
- **Next Quarter Planning**: Forward-looking priorities and action items
- **Notes**: Space for additional reflections

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

## Support

If you encounter any issues or have feature requests, please create an issue on the GitHub repository.

---

*Built with ❤️ for the Obsidian community*