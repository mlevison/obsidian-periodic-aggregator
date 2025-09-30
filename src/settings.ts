export interface QuarterlyReviewSettings {
	tempFolderPath: string;
	quarters: Date[];
}

export const DEFAULT_SETTINGS: QuarterlyReviewSettings = {
	tempFolderPath: "temp",

	quarters: [
		new Date(2025, 0, 1),
		new Date(2025, 3, 1),
		new Date(2025, 6, 1),
		new Date(2025, 9, 1),
	],
};
