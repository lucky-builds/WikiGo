/**
 * Game constants and configuration
 */

// Predefined categories for dropdown
export const CATEGORIES = [
  { value: "", label: "Any Category" },
  { value: "Physics", label: "Physics" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Biology", label: "Biology" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "History", label: "History" },
  { value: "Geography", label: "Geography" },
  { value: "Literature", label: "Literature" },
  { value: "Music", label: "Music" },
  { value: "Film", label: "Film" },
  { value: "Sports", label: "Sports" },
  { value: "Technology", label: "Technology" },
  { value: "Philosophy", label: "Philosophy" },
  { value: "Art", label: "Art" },
  { value: "Medicine", label: "Medicine" },
  { value: "Astronomy", label: "Astronomy" },
];

/**
 * Generate dynamic gradient colors based on date
 */
export function getDailyChallengeGradient(theme) {
  const dateStr = getDateString();
  const hash = hashString(dateStr);
  const gradients = [
    { card: 'from-blue-500/10 via-purple-500/10 to-pink-500/10', header: 'from-blue-500/40 via-purple-500/40 to-pink-500/40', border: 'border-blue-500' },
    { card: 'from-indigo-500/10 via-blue-500/10 to-cyan-500/10', header: 'from-indigo-500/40 via-blue-500/40 to-cyan-500/40', border: 'border-indigo-500' },
    { card: 'from-purple-500/10 via-pink-500/10 to-red-500/10', header: 'from-purple-500/40 via-pink-500/40 to-red-500/40', border: 'border-purple-500' },
    { card: 'from-green-500/10 via-teal-500/10 to-blue-500/10', header: 'from-green-500/40 via-teal-500/40 to-blue-500/40', border: 'border-green-500' },
    { card: 'from-orange-500/10 via-red-500/10 to-pink-500/10', header: 'from-orange-500/40 via-red-500/40 to-pink-500/40', border: 'border-orange-500' },
    { card: 'from-cyan-500/10 via-blue-500/10 to-indigo-500/10', header: 'from-cyan-500/40 via-blue-500/40 to-indigo-500/40', border: 'border-cyan-500' },
  ];
  const selected = gradients[hash % gradients.length];
  
  if (theme === 'dark') {
    return {
      card: `bg-gradient-to-br ${selected.card} ${selected.border}`,
      header: `bg-gradient-to-r ${selected.header}`,
    };
  } else if (theme === 'classic') {
    return {
      card: `bg-blue-50 border-blue-600`,
      header: `bg-blue-100`,
    };
  } else {
    return {
      card: `bg-gradient-to-br ${selected.card} ${selected.border}`,
      header: `bg-gradient-to-r ${selected.header}`,
    };
  }
}

/**
 * Get date string in YYYY-MM-DD format
 */
export function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Hash a string to a number
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

