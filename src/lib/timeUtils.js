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

