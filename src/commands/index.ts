import { Plugin } from 'obsidian';
import { buildQuarterlyReview } from './quarterly-review';
import { QuarterlyReviewSettings } from '../settings';

export function registerCommands(plugin: Plugin & { settings: QuarterlyReviewSettings }) {
	plugin.addCommand({
		id: 'build-quarterly-review',
		name: 'Build Quarterly Review',
		callback: () => buildQuarterlyReview(plugin),
	});
}
