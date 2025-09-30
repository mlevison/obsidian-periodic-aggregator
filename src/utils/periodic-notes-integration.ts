import { App, TFile, Notice } from "obsidian";

interface PeriodicNotesSettings {
	daily?: {
		enabled: boolean;
		folder: string;
		format: string;
	};
	weekly?: {
		enabled: boolean;
		folder: string;
		format: string;
	};
	monthly?: {
		enabled: boolean;
		folder: string;
		format: string;
	};
	quarterly?: {
		enabled: boolean;
		folder: string;
		format: string;
	};
	yearly?: {
		enabled: boolean;
		folder: string;
		format: string;
	};
}

interface PeriodicNotesPlugin {
	settings: PeriodicNotesSettings;
}

export interface NotesInfo {
	dailyNotes: TFile[];
	weeklyNotes: TFile[];
	dailyFolder: string | null;
	weeklyFolder: string | null;
	dailyFormat: string | null;
	weeklyFormat: string | null;
}

export class PeriodicNotesIntegration {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * Check if Periodic Notes plugin is installed and enabled
	 */
	isPeriodicNotesAvailable(): boolean {
		const plugin = this.getPeriodicNotesPlugin();
		return plugin !== null;
	}

	/**
	 * Get the Periodic Notes plugin instance
	 */
	private getPeriodicNotesPlugin(): PeriodicNotesPlugin | null {
		const plugins = (this.app as any).plugins as {
			plugins: Record<string, any>;
		};
		if (!plugins || !plugins.plugins) {
			return null;
		}

		const periodicNotesPlugin = plugins.plugins["periodic-notes"];
		if (!periodicNotesPlugin || !periodicNotesPlugin.settings) {
			return null;
		}

		return periodicNotesPlugin as PeriodicNotesPlugin;
	}

	/**
	 * Get Daily and Weekly notes information
	 */
	async getNotesInfo(): Promise<NotesInfo> {
		const plugin = this.getPeriodicNotesPlugin();

		if (!plugin) {
			new Notice("Periodic Notes plugin is not installed or enabled");
			return {
				dailyNotes: [],
				weeklyNotes: [],
				dailyFolder: null,
				weeklyFolder: null,
				dailyFormat: null,
				weeklyFormat: null,
			};
		}

		const settings = plugin.settings;

		// Get Daily Notes info
		const dailyFolder = settings.daily?.enabled
			? settings.daily.folder || ""
			: null;
		const dailyFormat = settings.daily?.enabled
			? settings.daily.format || "YYYY-MM-DD"
			: null;

		// Get Weekly Notes info
		const weeklyFolder = settings.weekly?.enabled
			? settings.weekly.folder || ""
			: null;
		const weeklyFormat = settings.weekly?.enabled
			? settings.weekly.format || "YYYY-[W]ww"
			: null;

		// Find all Daily and Weekly notes
		const dailyNotes = await this.findNotesByType(dailyFolder, dailyFormat);
		const weeklyNotes = await this.findNotesByType(
			weeklyFolder,
			weeklyFormat,
		);

		// Post notices if folders don't exist or no notes found
		this.checkAndNotifyEmptyResults("Daily", dailyFolder, dailyNotes);
		this.checkAndNotifyEmptyResults("Weekly", weeklyFolder, weeklyNotes);

		return {
			dailyNotes,
			weeklyNotes,
			dailyFolder,
			weeklyFolder,
			dailyFormat,
			weeklyFormat,
		};
	}

	/**
	 * Find notes by folder and format pattern
	 */
	private async findNotesByType(
		folder: string | null,
		format: string | null,
	): Promise<TFile[]> {
		if (!folder || !format) {
			return [];
		}

		const vault = this.app.vault;
		const folderObj = vault.getAbstractFileByPath(folder);

		if (!folderObj) {
			return [];
		}

		// Get all markdown files in the folder
		const files = vault.getMarkdownFiles().filter((file) => {
			return (
				file.path.startsWith(folder + "/") ||
				(folder === "" && !file.path.includes("/"))
			);
		});

		// Filter files that match the periodic notes pattern
		// This is a basic implementation - for more accurate matching,
		// we could use moment.js or similar date parsing libraries
		const periodicFiles = files.filter((file) => {
			const basename = file.basename;
			// Basic pattern matching for common formats
			if (format.includes("YYYY-MM-DD")) {
				return /^\d{4}-\d{2}-\d{2}/.test(basename);
			} else if (format.includes("YYYY-[W]ww")) {
				return /^\d{4}-W\d{2}/.test(basename);
			} else if (format.includes("ww")) {
				return /W\d{2}/.test(basename);
			}
			return false;
		});

		return periodicFiles;
	}

	/**
	 * Check results and post appropriate notices
	 */
	private checkAndNotifyEmptyResults(
		type: string,
		folder: string | null,
		notes: TFile[],
	): void {
		if (!folder) {
			new Notice(
				`${type} notes are not enabled in Periodic Notes settings`,
			);
			return;
		}

		const folderObj = this.app.vault.getAbstractFileByPath(folder);
		if (!folderObj) {
			new Notice(`${type} notes folder "${folder}" does not exist`);
			return;
		}

		if (notes.length === 0) {
			new Notice(`No ${type.toLowerCase()} notes found in "${folder}"`);
		} else {
			new Notice(`Found ${notes.length} ${type.toLowerCase()} notes`);
		}
	}

	/**
	 * Get summary of notes for display
	 */
	getNotesContent(notes: TFile[]): Promise<string[]> {
		return Promise.all(
			notes.map(async (file) => {
				try {
					const content = await this.app.vault.read(file);
					return `## ${file.basename}\n${content}\n\n`;
				} catch (error) {
					console.error(`Error reading file ${file.path}:`, error);
					return `## ${file.basename}\n*Error reading file content*\n\n`;
				}
			}),
		);
	}

	/**
	 * Create a summary of all notes for the quarterly review
	 */
	async createNotesSummary(
		dailyNotes: TFile[],
		weeklyNotes: TFile[],
	): Promise<string> {
		let summary = "";

		if (dailyNotes.length > 0) {
			summary += "# Daily Notes Summary\n\n";
			const dailyContent = await this.getNotesContent(dailyNotes);
			summary += dailyContent.join("");
		}

		if (weeklyNotes.length > 0) {
			summary += "# Weekly Notes Summary\n\n";
			const weeklyContent = await this.getNotesContent(weeklyNotes);
			summary += weeklyContent.join("");
		}

		if (dailyNotes.length === 0 && weeklyNotes.length === 0) {
			summary =
				"# Notes Summary\n\nNo daily or weekly notes found to include in this review.\n\n";
		}

		return summary;
	}
}
