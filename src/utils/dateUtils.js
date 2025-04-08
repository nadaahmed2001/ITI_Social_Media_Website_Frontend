// src/utils/dateUtils.js (Example file) OR place inside ShowPost.jsx

import { formatDistanceToNowStrict, parseISO, differenceInCalendarDays, format } from 'date-fns';

export const formatRelativeTime = (dateString) => {
if (!dateString) return ""; // Handle null or empty date strings

try {
const date = parseISO(dateString); // Use parseISO for robust parsing of ISO 8601 strings
const now = new Date();
const daysDifference = differenceInCalendarDays(now, date); // Checks *calendar* days difference

if (isNaN(date.getTime())) { // Check for invalid date after parsing
    return "Invalid date";
}

// Less than a minute ago -> "Just now"
const secondsDifference = Math.round((now.getTime() - date.getTime()) / 1000);
if (secondsDifference < 60) {
    return "Just now";
}

// Less than an hour ago -> "Xm ago" (using strict to avoid "about")
if (secondsDifference < 3600) {
    return formatDistanceToNowStrict(date, { addSuffix: true, unit: 'minute' }).replace(' minutes', 'm').replace(' minute', 'm');
}

// Less than 24 hours ago -> "Xh ago"
if (secondsDifference < 86400) { // 24 * 60 * 60
    return formatDistanceToNowStrict(date, { addSuffix: true, unit: 'hour' }).replace(' hours', 'h').replace(' hour', 'h');
}

// Yesterday
if (daysDifference === 1) {
    return 'Yesterday';
}

// Within the last week -> "Xd ago"
if (daysDifference < 7) {
    // formatDistanceToNowStrict might return "X days", keep it simple
    return `${daysDifference}d ago`;
    // Or use formatDistanceToNow for "X days ago" string:
    // return formatDistanceToNow(date, { addSuffix: true });
}

// Older than a week, show specific date
// Check if it's the current year
if (date.getFullYear() === now.getFullYear()) {
    return format(date, 'MMM d'); // e.g., "Apr 8"
} else {
    return format(date, 'MMM d, yyyy'); // e.g., "Dec 25, 2024"
}

} catch (error) {
console.error("Error formatting date:", dateString, error);
return "Invalid date"; // Fallback for parsing errors
}
};