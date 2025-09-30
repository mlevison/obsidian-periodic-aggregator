import { App, TFile, Notice } from "obsidian";
import {
	getAllDailyNotes,
	getAllWeeklyNotes,
	getDailyNoteSettings,
	getWeeklyNoteSettings,
} from "obsidian-daily-notes-interface";

export interface NotesInfo {
	dailyNotes: TFile[];
	weeklyNotes: TFile[];
	dailyFolder: string | null;
	weeklyFolder: string | null;
	dailyFormat: string | null;
	weeklyFormat: string | null;
}

export class PeriodicNotesUtil {
	private app: App;

	constructor(app: App) {
		this.app = app;
	}

	/**
	 * Check if daily or weekly notes functionality is available
	 * This now checks if the daily-notes-interface can access the settings
	 */
	arePeriodicNotesConfigured(): boolean {
		try {
			// Try to get settings to see if daily/weekly notes are configured
			const dailySettings = getDailyNoteSettings();
			const weeklySettings = getWeeklyNoteSettings();
			return !!(dailySettings || weeklySettings);
		} catch (error) {
			console.error("Error checking periodic notes availability:", error);
			return false;
		}
	}

	/**
	 * Get Daily and Weekly notes information using obsidian-daily-notes-interface
	 */
	async getNotesInfo(): Promise<NotesInfo> {
		try {
			// Get settings using the interface
			const dailySettings = getDailyNoteSettings();
			const weeklySettings = getWeeklyNoteSettings();

			// Get all notes using the interface
			const allDailyNotes = getAllDailyNotes();
			const allWeeklyNotes = getAllWeeklyNotes();

			// Convert objects to TFile arrays
			const dailyNotes: TFile[] = Object.values(allDailyNotes);
			const weeklyNotes: TFile[] = Object.values(allWeeklyNotes);

			// Extract folder and format information
			const dailyFolder = dailySettings?.folder || null;
			const dailyFormat = dailySettings?.format || null;
			const weeklyFolder = weeklySettings?.folder || null;
			const weeklyFormat = weeklySettings?.format || null;

			// Post notices about results
			this.checkAndNotifyResults("Daily", dailyFolder, dailyNotes);
			this.checkAndNotifyResults("Weekly", weeklyFolder, weeklyNotes);

			return {
				dailyNotes,
				weeklyNotes,
				dailyFolder,
				weeklyFolder,
				dailyFormat,
				weeklyFormat,
			};
		} catch (error) {
			console.error("Error getting notes info:", error);
			new Notice(
				"Error accessing daily/weekly notes. Please check your settings.",
			);
			return {
				dailyNotes: [],
				weeklyNotes: [],
				dailyFolder: null,
				weeklyFolder: null,
				dailyFormat: null,
				weeklyFormat: null,
			};
		}
	}

	/**
	 * Check results and post appropriate notices
	 */
	private checkAndNotifyResults(
		type: string,
		folder: string | null,
		notes: TFile[],
	): void {
		if (!folder && folder !== "") {
			new Notice(`${type} notes are not configured or enabled`);
			return;
		}

		if (folder && folder !== "") {
			const folderObj = this.app.vault.getAbstractFileByPath(folder);
			if (!folderObj) {
				new Notice(`${type} notes folder "${folder}" does not exist`);
				return;
			}
		}

		if (notes.length === 0) {
			new Notice(`No ${type.toLowerCase()} notes found`);
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

	/**
	 * Write daily and weekly notes to separate temp files
	 */
	async writeSeparateTempFiles(
		dailyNotes: TFile[],
		weeklyNotes: TFile[],
		tempFolderPath: string,
	): Promise<{
		dailyFilePath: string | null;
		weeklyFilePath: string | null;
	}> {
		let dailyFilePath: string | null = null;
		let weeklyFilePath: string | null = null;

		// Ensure temp folder exists
		const tempFolder = this.app.vault.getAbstractFileByPath(tempFolderPath);
		if (!tempFolder) {
			await this.app.vault.createFolder(tempFolderPath);
		}

		// Write daily notes to quaterly_days.md
		if (dailyNotes.length > 0) {
			const dailyContent = await this.getNotesContent(dailyNotes);
			const dailyFileContent = `# Daily Notes Summary\n\n${dailyContent.join("")}`;
			dailyFilePath = `${tempFolderPath}/quaterly_days.md`;

			// Check if file exists and delete it first
			const existingDailyFile =
				this.app.vault.getAbstractFileByPath(dailyFilePath);
			if (existingDailyFile) {
				await this.app.vault.delete(existingDailyFile);
			}

			await this.app.vault.create(dailyFilePath, dailyFileContent);
		}

		// Write weekly notes to quaterly_weeks.md
		if (weeklyNotes.length > 0) {
			const weeklyContent = await this.getNotesContent(weeklyNotes);
			const weeklyFileContent = `# Weekly Notes Summary\n\n${weeklyContent.join("")}`;
			weeklyFilePath = `${tempFolderPath}/quaterly_weeks.md`;

			// Check if file exists and delete it first
			const existingWeeklyFile =
				this.app.vault.getAbstractFileByPath(weeklyFilePath);
			if (existingWeeklyFile) {
				await this.app.vault.delete(existingWeeklyFile);
			}

			await this.app.vault.create(weeklyFilePath, weeklyFileContent);
		}

		return { dailyFilePath, weeklyFilePath };
	}
}
