/**
 * Time utility functions
 */

/**
 * Formats milliseconds into MM:SS format
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted time string (MM:SS)
 */
export function prettyTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/**
 * Formats milliseconds into a countdown format
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted countdown string
 */
export function formatCountdown(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${hours}h`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Formats milliseconds into a detailed countdown format (HH:MM:SS)
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted countdown string (HH:MM:SS)
 */
export function formatDetailedCountdown(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get time until midnight in milliseconds
 * @returns {number} Milliseconds until midnight
 */
export function getTimeUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

