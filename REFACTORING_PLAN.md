# Refactoring Plan: WikipediaJourneyGame.jsx

## Current State
- **File Size**: 4,312 lines
- **Main Component**: WikipediaJourneyGame (4,294 lines)
- **Issues**: Too large, hard to maintain, performance concerns

## Extraction Strategy

### Phase 1: Extract UI Components (Largest Impact)
1. ✅ **WikipediaArticleViewer** - Extracted to `components/game/WikipediaArticleViewer.jsx`
2. **GameResults** - Victory Summary Screen (~500 lines)
3. **ChallengeScreen** - Challenge Modal (~200 lines)
4. **Onboarding** - Onboarding Modal (~400 lines)
5. **GameSetup** - Setup/Configuration UI (~300 lines)
6. **GameBoard** - Main game interface (~800 lines)

### Phase 2: Extract Utilities
1. **Game API Functions** - Move to `lib/wikipediaAPI.js` (already exists but needs consolidation)
2. **Cache Implementation** - Already exists in `useWikipediaAPI.js`, remove duplicate
3. **Game Constants** - Move to `lib/constants.js` (already exists)

### Phase 3: Extract Hooks
1. **useTimer** - Already exists, use from utils
2. **useGameState** - Custom hook for game state management

## Target Structure
```
src/components/
  ├── WikipediaJourneyGame.jsx (~800 lines - orchestrator)
  └── game/
      ├── WikipediaArticleViewer.jsx ✅
      ├── GameResults.jsx
      ├── ChallengeScreen.jsx
      ├── Onboarding.jsx
      ├── GameSetup.jsx
      └── GameBoard.jsx
```

## Benefits
- **Maintainability**: Each component has single responsibility
- **Performance**: Smaller components = better React optimization
- **Testability**: Easier to test individual components
- **Reusability**: Components can be reused elsewhere

