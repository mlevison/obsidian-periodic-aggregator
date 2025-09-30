export interface WeekInfo {
	label: string;
	weekNumber: number;
	year: number;
	startDate: Date;
	endDate: Date;
	dateRangeLabel: string;
}

/**
 * Generates a list of weeks dynamically based on the current date.
 * Weeks start on Monday following ISO 8601 standard.
 *
 * @param fromDate Starting date for calculation (default: current date)
 * @returns Array of WeekInfo objects
 */
export function generateWeeks(fromDate: Date = new Date()): WeekInfo[] {
	const weeks: WeekInfo[] = [];
	const currentDate = new Date(fromDate);

	// Get current week info
	const currentWeek = getWeekInfo(currentDate);

	// Add current week
	weeks.push(currentWeek);

	// Add previous week
	const previousWeekDate = new Date(currentWeek.startDate);
	previousWeekDate.setDate(previousWeekDate.getDate() - 7);
	const previousWeek = getWeekInfo(previousWeekDate);
	weeks.unshift(previousWeek); // Add to beginning

	return weeks;
}

/**
 * Get week information for a given date
 */
export function getWeekInfo(date: Date): WeekInfo {
	const { weekNumber, year } = getISOWeekNumber(date);
	const { startDate, endDate } = getWeekDateRange(date);

	return {
		label: `Week ${weekNumber}, ${year}`,
		weekNumber,
		year,
		startDate,
		endDate,
		dateRangeLabel: `Week ${weekNumber}, ${year} (${formatDate(startDate)} - ${formatDate(endDate)})`,
	};
}

/**
 * Get ISO week number for a date (weeks start on Monday)
 */
export function getISOWeekNumber(date: Date): { weekNumber: number; year: number } {
	const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
	const dayNum = d.getUTCDay() || 7;
	d.setUTCDate(d.getUTCDate() + 4 - dayNum);
	const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
	const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);

	return {
		weekNumber,
		year: d.getUTCFullYear()
	};
}

/**
 * Get the start (Monday) and end (Sunday) dates for the week containing the given date
 */
export function getWeekDateRange(date: Date): { startDate: Date; endDate: Date } {
	const d = new Date(date);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday

	const startDate = new Date(d.setDate(diff));
	startDate.setHours(0, 0, 0, 0);

	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + 6);
	endDate.setHours(23, 59, 59, 999);

	return { startDate, endDate };
}

/**
 * Format a date as MMM DD, YYYY (e.g., "Jan 01, 2024")
 */
function formatDate(date: Date): string {
	const months = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];

	const month = months[date.getMonth()];
	const day = date.getDate().toString().padStart(2, "0");
	const year = date.getFullYear();

	return `${month} ${day}, ${year}`;
}

/**
 * Get current week info
 */
export function getCurrentWeek(): WeekInfo {
	return getWeekInfo(new Date());
}

/**
 * Get previous week info
 */
export function getPreviousWeek(): WeekInfo {
	const lastWeek = new Date();
	lastWeek.setDate(lastWeek.getDate() - 7);
	return getWeekInfo(lastWeek);
}
