import { App, Plugin, PluginSettingTab, Setting } from "obsidian";
import { QuarterlyReviewSettings } from "../settings";

export interface SettingsPlugin extends Plugin {
	settings: QuarterlyReviewSettings;
	saveSettings: () => Promise<void>;
}

export class QuarterlyReviewSettingTab extends PluginSettingTab {
	plugin: SettingsPlugin;

	constructor(app: App, plugin: SettingsPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", {
			text: "Quarterly Review Builder Settings",
		});

		new Setting(containerEl)
			.setName("Temp Folder Path")
			.setDesc(
				"The folder path where quarterly review files will be created",
			)
			.addText((text) =>
				text
					.setPlaceholder("/temp")
					.setValue(this.plugin.settings.tempFolderPath)
					.onChange(async (value) => {
						this.plugin.settings.tempFolderPath = value || "temp";
						await this.plugin.saveSettings();
					}),
			);
	}
}
