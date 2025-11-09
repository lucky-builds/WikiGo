# Supabase Database Data Flow Documentation

This document details the data being passed to Supabase DB, segmented into 3 steps for each table: `daily_challenges`, `game_analytics`, and `leaderboard`.

---

## Table 1: `daily_challenges`

### Purpose
Stores daily challenge definitions (start/goal articles) and best solution history.

### Step 1: READ Operations (Fetching Daily Challenge)

**Location**: `src/components/WikipediaJourneyGame.jsx` (line ~272)  
**Function**: `fetchDailyChallengeArticles()`

**Data Retrieved**:
```javascript
{
  start_title: string,      // Starting article title
  goal_title: string,       // Goal article title  
  hint: string | null,      // Optional hint for the challenge
  date: string              // Date in YYYY-MM-DD format
}
```

**Query**:
```javascript
supabase
  .from(DAILY_CHALLENGES_TABLE)
  .select('start_title, goal_title, hint')
  .eq('date', dateStr)
  .single()
```

**Usage**: Fetched when user selects Daily Challenge mode to get today's challenge.

---

### Step 2: READ Operations (Fetching Yesterday's Challenge)

**Location**: `src/lib/challengeUtils.js` (line ~36)  
**Function**: `fetchYesterdayChallenge()`

**Data Retrieved**:
```javascript
{
  start_title: string,      // Starting article title
  goal_title: string,       // Goal article title
  date: string              // Date in YYYY-MM-DD format
}
```

**Query**:
```javascript
supabase
  .from(DAILY_CHALLENGES_TABLE)
  .select('start_title, goal_title, date')
  .eq('date', yesterdayDate)
  .single()
```

**Usage**: Display yesterday's challenge and solution in the UI.

---

### Step 3: READ Operations (Fetching Best Solution History)

**Location**: `src/lib/challengeUtils.js` (line ~126)  
**Function**: `fetchYesterdayBestSolution()`

**Data Retrieved**:
```javascript
{
  best_solution_history: JSONB  // Array of article titles: string[]
}
```

**Query**:
```javascript
supabase
  .from(DAILY_CHALLENGES_TABLE)
  .select('best_solution_history')
  .eq('date', yesterdayDate)
  .single()
```

**Usage**: Fallback when history is not available in leaderboard table. Returns the best solution path as an array of article titles.

**Note**: This table is primarily **READ-ONLY** from the application. Daily challenges are likely created by an admin/backend process, not directly from the frontend application.

---

## Table 2: `game_analytics`

### Purpose
Tracks all game sessions: starts, progress, and completions for analytics purposes.

### Step 1: INSERT Operation (Game Start Tracking)

**Location**: `src/lib/gameAnalytics.js` (line ~16)  
**Function**: `trackGameStart()`

**Called From**: `src/components/WikipediaJourneyGame.jsx` (line ~630)

**Data Inserted**:
```javascript
{
  username: string,                    // User's username (or 'anonymous')
  start_title: string,                 // Starting article title
  goal_title: string,                  // Goal article title
  is_daily_challenge: boolean,         // Whether it's a daily challenge
  start_category: string | null,      // Starting category (if any)
  goal_category: string | null,       // Goal category (if any)
  completed: false,                    // Always false on start
  started_at: string                   // ISO timestamp (e.g., "2024-01-15T10:30:00.000Z")
}
```

**Query**:
```javascript
supabase
  .from(GAME_ANALYTICS_TABLE)
  .insert([{ /* data above */ }])
  .select('id')
  .single()
```

**Returns**: `gameSessionId` (UUID) - Used to track this specific game session

**When**: Called immediately when a game starts (after start/goal titles are set).

---

### Step 2: UPDATE Operation (Game History Progress)

**Location**: `src/lib/gameAnalytics.js` (line ~55)  
**Function**: `updateGameHistory()`

**Called From**: `src/components/WikipediaJourneyGame.jsx` (line ~927) - debounced every 500ms

**Data Updated**:
```javascript
{
  history: string[]  // Array of article titles in current path
}
```

**Query**:
```javascript
supabase
  .from(GAME_ANALYTICS_TABLE)
  .update({ history: history })
  .eq('id', gameSessionId)
```

**When**: Called periodically (debounced 500ms) as the player navigates through articles. Updates the current path taken.

**Example History**:
```javascript
["Albert Einstein", "Physics", "Quantum mechanics", "Schrödinger's cat"]
```

---

### Step 3: UPDATE Operation (Game Completion Tracking)

**Location**: `src/lib/gameAnalytics.js` (line ~90)  
**Function**: `trackGameCompletion()`

**Called From**: `src/components/WikipediaJourneyGame.jsx` (line ~960) - when `won` becomes true

**Data Updated**:
```javascript
{
  completed: true,                     // Mark game as completed
  score: number,                       // Final score (1000 - (10 × moves) - seconds)
  moves: number,                       // Number of moves taken
  time_ms: number,                     // Time taken in SECONDS (not milliseconds!)
  history: string[],                   // Final path array
  completed_at: string                 // ISO timestamp
}
```

**Query**:
```javascript
supabase
  .from(GAME_ANALYTICS_TABLE)
  .update({ /* data above */ })
  .eq('id', gameSessionId)
```

**Fallback**: If no `gameSessionId` exists, creates a new entry with `trackGameCompletionWithoutSession()`.

**When**: Called immediately when the player reaches the goal article (`won === true`).

**Note**: `time_ms` field name is misleading - it stores **seconds**, not milliseconds. The conversion happens in the frontend: `Math.floor(timeMs / 1000)`.

---

## Table 3: `leaderboard`

### Purpose
Stores daily challenge completion scores for ranking and display.

### Step 1: INSERT Operation (Submit Score to Leaderboard)

**Location**: `src/components/WikipediaJourneyGame.jsx` (line ~1014)  
**Function**: `submitToLeaderboard()`

**Data Inserted**:
```javascript
{
  username: string,                    // User's username
  score: number,                       // Final score (1000 - (10 × moves) - seconds)
  moves: number,                       // Number of moves taken
  time_ms: number,                     // Time taken in SECONDS (converted from milliseconds)
  date: string,                        // Date in YYYY-MM-DD format
  start_title: string,                 // Starting article title
  goal_title: string,                  // Goal article title
  history: string[]                    // Array of article titles in path (JSONB)
}
```

**Query**:
```javascript
supabase
  .from(LEADERBOARD_TABLE)
  .insert([{ /* data above */ }])
```

**When**: 
- Only for Daily Challenge completions (`dailyChallenge === true`)
- Only when game is won (`won === true`)
- Only once per day (checked via `hasSubmittedToday()`)
- Automatically triggered when conditions are met (line ~1068)

**Note**: `time_ms` stores **seconds**, not milliseconds. Conversion: `Math.floor(finalTime.current / 1000)`.

---

### Step 2: READ Operation (Fetch Top Scores)

**Location**: `src/components/Leaderboard.jsx` (line ~36)  
**Function**: `fetchLeaderboard()`

**Data Retrieved**:
```javascript
{
  id: UUID,                            // Entry ID
  username: string,                    // User's username
  score: number,                      // Final score
  moves: number,                       // Number of moves
  time_ms: number,                    // Time in seconds
  date: string,                       // Date string
  start_title: string,                // Starting article
  goal_title: string,                 // Goal article
  history: string[]                   // Path array (JSONB)
}
```

**Query**:
```javascript
supabase
  .from(LEADERBOARD_TABLE)
  .select('*')
  .eq('date', today)
  .order('score', { ascending: false })
  .limit(20)
```

**Usage**: Displays top 20 players for today's daily challenge.

---

### Step 3: READ Operations (User Rank & Stats)

**Location**: `src/components/Leaderboard.jsx` (line ~54) & `src/lib/challengeUtils.js` (line ~75)

**Functions**: 
- `fetchLeaderboard()` - User rank calculation
- `fetchYesterdayCompletionStats()` - Yesterday's statistics

**Data Retrieved**:

**For User Rank**:
```javascript
// First query: Get user's best score
{
  score: number
}

// Second query: Count users with higher scores
count: number  // Number of users with score > user's score
```

**For Yesterday Stats**:
```javascript
{
  moves: number,        // Moves taken
  time_ms: number       // Time in seconds
}
// Aggregated to calculate:
{
  completionCount: number,    // Total completions
  averageMoves: number,       // Average moves
  averageTime: number         // Average time (in milliseconds)
}
```

**Queries**:

**User Rank**:
```javascript
// Get user's score
supabase
  .from(LEADERBOARD_TABLE)
  .select('score')
  .eq('date', today)
  .eq('username', currentUsername)
  .order('score', { ascending: false })
  .limit(1)
  .single()

// Count users with higher score
supabase
  .from(LEADERBOARD_TABLE)
  .select('*', { count: 'exact', head: true })
  .eq('date', today)
  .gt('score', userScore.score)
```

**Yesterday Stats**:
```javascript
supabase
  .from(LEADERBOARD_TABLE)
  .select('moves, time_ms', { count: 'exact' })
  .eq('date', yesterdayDate)
```

**Usage**: 
- Shows user's rank if they're not in top 20
- Displays yesterday's challenge completion statistics

---

## Data Flow Summary

### Complete Game Flow (Daily Challenge)

1. **Game Start**:
   - Read `daily_challenges` → Get today's challenge
   - Insert into `game_analytics` → Track game start

2. **During Game**:
   - Update `game_analytics` → Update history as player progresses (debounced)

3. **Game Completion**:
   - Update `game_analytics` → Mark as completed with final stats
   - Insert into `leaderboard` → Submit score for ranking

### Data Type Notes

- **Timestamps**: Stored as ISO strings (`TIMESTAMPTZ`)
- **Time Storage**: `time_ms` fields store **seconds**, not milliseconds (despite the name)
- **History**: Stored as JSONB arrays of strings (`string[]`)
- **Dates**: Stored as strings in `YYYY-MM-DD` format
- **Scores**: Calculated as `1000 - (10 × moves) - seconds`

### Table Relationships

- `daily_challenges.date` ↔ `leaderboard.date` (same date for daily challenges)
- `game_analytics` tracks ALL games (daily + random)
- `leaderboard` only tracks Daily Challenge completions
- `daily_challenges.best_solution_history` is a fallback when `leaderboard.history` is unavailable

---

## UPDATE Operations (Username Changes)

**Location**: `src/lib/gameAnalytics.js` (line ~162)  
**Function**: `updateUsernameAcrossTables()`

**Updates Both Tables**:
- `leaderboard`: Updates all entries with old username → new username
- `game_analytics`: Updates all entries with old username → new username

**Query**:
```javascript
// Leaderboard
supabase
  .from(LEADERBOARD_TABLE)
  .update({ username: newUsername })
  .eq('username', oldUsername)

// Game Analytics
supabase
  .from(GAME_ANALYTICS_TABLE)
  .update({ username: newUsername })
  .eq('username', oldUsername)
```

**When**: Called when user changes their username to maintain consistency across tables.

