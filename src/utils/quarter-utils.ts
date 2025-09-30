export interface QuarterInfo {
	label: string;
	date: Date;
	quarter: number;
	year: number;
	startDate: Date;
	endDate: Date;
	dateRangeLabel: string;
}

/**
 * Generates a list of quarters dynamically based on the current date.
 * Quarters start in January, April, July, and October.
 *
 * @param fromDate Starting date for calculation (default: current date)
 * @returns Array of QuarterInfo objects
 */
export function generateQuarters(fromDate: Date = new Date()): QuarterInfo[] {
	const numberQuarters = 6;
	const quarters: QuarterInfo[] = [];
	const currentYear = fromDate.getFullYear();
	const currentMonth = fromDate.getMonth();

	// Determine the current quarter (0-3, where 0 = Q1, 1 = Q2, etc.)
	const currentQuarterIndex = Math.floor(currentMonth / 3);

	// Start from the current quarter and go backwards/forwards to get 6 quarters
	// We'll include the current quarter and 2 previous + 3 future quarters
	const startOffset = -5; // Start 2 quarters before current

	for (let i = 0; i < numberQuarters; i++) {
		const quarterOffset = startOffset + i;
		const targetYear =
			currentYear + Math.floor((currentQuarterIndex + quarterOffset) / 4);
		const targetQuarterIndex =
			(((currentQuarterIndex + quarterOffset) % 4) + 4) % 4;

		const quarterNumber = targetQuarterIndex + 1;
		const quarterStartMonth = targetQuarterIndex * 3;

		const startDate = new Date(targetYear, quarterStartMonth, 1);
		const endDate = new Date(targetYear, quarterStartMonth + 3, 0); // Last day of the quarter

		const quarterInfo: QuarterInfo = {
			label: `Q${quarterNumber} ${targetYear}`,
			date: startDate,
			quarter: quarterNumber,
			year: targetYear,
			startDate,
			endDate,
			dateRangeLabel: `Q${quarterNumber} ${targetYear} (${formatDate(startDate)} - ${formatDate(endDate)})`,
		};

		quarters.push(quarterInfo);
	}

	// Sort quarters by date (oldest first)
	return quarters.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Format a date as MMM DD, YYYY (e.g., "Jan 01, 2024")
 */
function formatDate(date: Date): string {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const month = months[date.getMonth()];
	const day = date.getDate().toString().padStart(2, "0");
	const year = date.getFullYear();

	return `${month} ${day}, ${year}`;
}

/**
 * Get the current quarter information
 */
export function getCurrentQuarter(): QuarterInfo {
	const quarters = generateQuarters();
	const now = new Date();

	// Find the quarter that contains the current date
	return (
		quarters.find((q) => now >= q.startDate && now <= q.endDate) ||
		quarters[2]
	); // Fallback to middle quarter
}
