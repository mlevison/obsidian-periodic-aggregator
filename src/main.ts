import { Plugin } from "obsidian";
import { QuarterlyReviewSettings, DEFAULT_SETTINGS } from "./settings";
import { registerCommands } from "./commands";
import { QuarterlyReviewSettingTab } from "./ui/settings-tab";

export default class QuarterlyReviewPlugin extends Plugin {
	settings: QuarterlyReviewSettings;

	async onload() {
		await this.loadSettings();

		// Register commands
		registerCommands(this);

		// Add settings tab
		this.addSettingTab(new QuarterlyReviewSettingTab(this.app, this));
	}

	onunload() {
		// Plugin cleanup is handled automatically by Obsidian
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
