import { Notice, Plugin, SuggestModal, TFile } from "obsidian";
import { QuarterlyReviewSettings } from "../settings";
import { PeriodicNotesUtil, NotesInfo } from "../utils/periodic-notes-util";
import { generateQuarters, QuarterInfo } from "../utils/quarter-utils";

class QuarterSelectionModal extends SuggestModal<QuarterInfo> {
	plugin: Plugin & { settings: QuarterlyReviewSettings };
	onChoose: (quarter: QuarterInfo) => void;

	constructor(
		plugin: Plugin & { settings: QuarterlyReviewSettings },
		onChoose: (quarter: QuarterInfo) => void,
	) {
		super(plugin.app);
		this.plugin = plugin;
		this.onChoose = onChoose;
	}

	getSuggestions(query: string): QuarterInfo[] {
		const quarters = generateQuarters(6);

		return quarters.filter((quarter) =>
			quarter.dateRangeLabel.toLowerCase().includes(query.toLowerCase()),
		);
	}

	renderSuggestion(quarter: QuarterInfo, el: HTMLElement) {
		el.createEl("div", { text: quarter.dateRangeLabel });
	}

	onChooseSuggestion(quarter: QuarterInfo, evt: MouseEvent | KeyboardEvent) {
		this.onChoose(quarter);
	}
}

export async function buildQuarterlyReview(
	plugin: Plugin & { settings: QuarterlyReviewSettings },
) {
	try {
		const periodicNotesUtil = new PeriodicNotesUtil(plugin.app);

		if (!periodicNotesUtil.arePeriodicNotesConfigured()) {
			new Notice(
				"Daily/Weekly notes functionality is not available. Please enable Daily Notes or install Periodic Notes plugin.",
			);
			return;
		}

		// Show quarter selection modal
		const modal = new QuarterSelectionModal(
			plugin,
			async (selectedQuarter: QuarterInfo) => {
				await createQuarterlyReview(
					plugin,
					selectedQuarter,
					periodicNotesUtil,
				);
			},
		);
		modal.open();
	} catch (error) {
		console.error("Error building quarterly review:", error);
		new Notice(
			"Failed to create quarterly review. Check console for details.",
		);
	}
}

async function createQuarterlyReview(
	plugin: Plugin & { settings: QuarterlyReviewSettings },
	selectedQuarter: QuarterInfo,
	periodicNotesIntegration: PeriodicNotesUtil,
) {
	try {
		const { tempFolderPath } = plugin.settings;

		// Get Daily and Weekly notes information
		new Notice("Scanning for Daily and Weekly notes...");
		const notesInfo: NotesInfo =
			await periodicNotesIntegration.getNotesInfo();

		// Write daily and weekly notes to separate temp files
		new Notice(
			"Creating separate temp files for daily and weekly notes...",
		);
		const tempFiles = await periodicNotesIntegration.writeSeparateTempFiles(
			notesInfo.dailyNotes,
			notesInfo.weeklyNotes,
			tempFolderPath,
		);

		// Open the newly created file
		let createdFilesMessage = `Files created:`;
		if (tempFiles.dailyFilePath) {
			createdFilesMessage += `\nDaily notes written to: quaterly_days.md`;
			const dailyFile = plugin.app.vault.getAbstractFileByPath(
				tempFiles.dailyFilePath,
			);
			if (dailyFile instanceof TFile) {
				await plugin.app.workspace.getLeaf().openFile(dailyFile);
			}
		}
		if (tempFiles.weeklyFilePath) {
			createdFilesMessage += `\nWeekly notes written to: quaterly_weeks.md`;
			const weeklyFile = plugin.app.vault.getAbstractFileByPath(
				tempFiles.weeklyFilePath,
			);
			if (weeklyFile instanceof TFile) {
				await plugin.app.workspace.getLeaf().openFile(weeklyFile);
			}
		}

		new Notice(createdFilesMessage);
	} catch (error) {
		console.error("Error creating quarterly review:", error);
		new Notice(
			"Failed to create quarterly review. Check console for details.",
		);
	}
}
