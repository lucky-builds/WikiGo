# 🎮 WikiGo - Wikipedia Journey Game

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/lucky-builds/WikiGo)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF.svg)](https://vitejs.dev/)

A fun and educational web game where players navigate from one Wikipedia article to another using only internal links. Challenge yourself to find the shortest path between two articles, compete on the leaderboard, and test your knowledge with daily challenges!

![Wikipedia Journey Game](WikiGo.png)

## 🌐 Live Demo

[Play WikiGo](https://www.playwikigo.xyz) - Try the game online!

## ✨ Features

### 🎯 Game Modes

- **Daily Challenge**: Play the same challenge as everyone else each day. The start and goal articles are randomly selected based on the date, ensuring fairness and competition. Compete globally and see how you rank!
- **Random Game**: Create your own journey by selecting start and goal articles, or use category filters to randomize within specific topics. Perfect for practicing or exploring new topics.
- **Zen Mode**: Practice with pre-defined challenges without leaderboard impact. Includes 5 practice games with solutions available after completion or forfeit. Great for learning strategies!

### 🏆 Competitive Features

- **Global Leaderboard**: Compete with players worldwide and see who completes challenges the fastest
- **Timer**: Track your completion time for each journey
- **Move Counter**: Count the number of clicks needed to reach your goal
- **Score Submission**: Submit your scores to compete on the leaderboard (Daily Challenge only)
- **Score Calculation**: Score = 1000 - (10 × moves) - seconds (higher is better)
- **Yesterday's Challenge**: View yesterday's challenge solution and see how top players solved it

### 🎨 User Experience

- **Dark/Light/Classic Themes**: Choose your preferred color scheme with persistent theme preference
- **Responsive Design**: Play seamlessly on desktop, tablet, and mobile devices
- **Article Preview**: View Wikipedia article summaries and content without leaving the game
- **History Navigation**: Navigate back through your journey path with undo functionality
- **Category Filters**: Filter articles by topics like Physics, History, Art, Technology, and more
- **Search Functionality**: Search for specific Wikipedia articles to use as start or goal
- **User Statistics**: Track your personal stats including games played, completion rate, and best scores
- **Onboarding**: Interactive tutorial for new players
- **Scoring Methodology**: Clear explanation of how scores are calculated

### 📚 Educational

- **Learn While Playing**: Discover interesting Wikipedia articles and connections
- **Explore Categories**: Dive deep into specific topics with category-based challenges
- **Article Summaries**: Read summaries and full article content to make informed decisions
- **Solution Viewing**: Learn optimal paths by viewing solutions after completing Zen Mode games

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (for leaderboard functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lucky-builds/WikiGo.git
   cd WikiGo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_SECRET=your_secret_admin_key
   ```

4. **Set up Supabase tables**
   
   Run the following SQL scripts in your Supabase SQL Editor in order:

   **Leaderboard table:**
   ```sql
   CREATE TABLE leaderboard (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT NOT NULL,
     moves INTEGER NOT NULL,
     time_ms INTEGER NOT NULL,
     score INTEGER NOT NULL,
     date DATE NOT NULL,
     start_title TEXT,
     goal_title TEXT,
     history JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_leaderboard_challenge_date ON leaderboard(date);
   CREATE INDEX idx_leaderboard_moves_time ON leaderboard(date, moves, time_ms);
   CREATE INDEX idx_leaderboard_start_title ON leaderboard(start_title);
   CREATE INDEX idx_leaderboard_goal_title ON leaderboard(goal_title);
   ```
   
   **Daily Challenges table:**
   ```sql
   CREATE TABLE daily_challenges (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     date DATE UNIQUE NOT NULL,
     start_title TEXT NOT NULL,
     goal_title TEXT NOT NULL,
     hint TEXT,
     best_solution_history JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_daily_challenges_date ON daily_challenges(date);
   ```
   
   **Game Analytics table:**
   ```sql
   CREATE TABLE game_analytics (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT NOT NULL,
     start_title TEXT NOT NULL,
     goal_title TEXT NOT NULL,
     is_daily_challenge BOOLEAN DEFAULT false,
     is_zen_mode BOOLEAN DEFAULT false,
     start_category TEXT,
     goal_category TEXT,
     completed BOOLEAN DEFAULT false,
     solution_viewed BOOLEAN DEFAULT false,
     score INTEGER,
     moves INTEGER,
     time_ms INTEGER,
     history JSONB,
     started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
     completed_at TIMESTAMPTZ,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   CREATE INDEX idx_game_analytics_username ON game_analytics(username);
   CREATE INDEX idx_game_analytics_completed ON game_analytics(completed);
   CREATE INDEX idx_game_analytics_is_daily_challenge ON game_analytics(is_daily_challenge);
   CREATE INDEX idx_game_analytics_is_zen_mode ON game_analytics(is_zen_mode);
   CREATE INDEX idx_game_analytics_started_at ON game_analytics(started_at DESC);
   CREATE INDEX idx_game_analytics_completed_at ON game_analytics(completed_at DESC);
   CREATE INDEX idx_game_analytics_zen_mode_status ON game_analytics(username, start_title, goal_title, is_zen_mode, completed, solution_viewed);
   
   -- Enable Row Level Security
   ALTER TABLE game_analytics ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Allow public inserts" ON game_analytics
     FOR INSERT TO anon, authenticated WITH CHECK (true);
   
   CREATE POLICY "Allow public reads" ON game_analytics
     FOR SELECT TO anon, authenticated USING (true);
   
   CREATE POLICY "Allow public updates" ON game_analytics
     FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
   ```
   
   **Practice Games table (for Zen Mode):**
   ```sql
   CREATE TABLE practice_games (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     start_title TEXT NOT NULL,
     goal_title TEXT NOT NULL,
     solution_history JSONB NOT NULL,
     date DATE,
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   CREATE INDEX idx_practice_games_start_title ON practice_games(start_title);
   CREATE INDEX idx_practice_games_goal_title ON practice_games(goal_title);
   CREATE INDEX idx_practice_games_date ON practice_games(date DESC);
   CREATE INDEX idx_practice_games_created_at ON practice_games(created_at DESC);
   
   -- Enable Row Level Security
   ALTER TABLE practice_games ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Allow public reads" ON practice_games
     FOR SELECT TO anon, authenticated USING (true);
   
   CREATE POLICY "Allow authenticated inserts" ON practice_games
     FOR INSERT TO authenticated WITH CHECK (true);
   
   CREATE POLICY "Allow authenticated updates" ON practice_games
     FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🛠️ Tech Stack

- **React 18** - Modern UI framework with hooks and context API
- **Vite** - Fast build tool and dev server with HMR
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Supabase** - Backend-as-a-Service for database and real-time features
- **Wikipedia API** - MediaWiki API for article data and links
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Canvas Confetti** - Celebration effects on game completion
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Interactive charts for admin dashboard
- **DOMPurify** - HTML sanitization for Wikipedia content

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

Preview the production build:
```bash
npm run preview
```

### Deploying to Vercel

The project includes a `vercel.json` configuration file that handles:
- Client-side routing for React Router (all routes rewrite to `index.html`)
- Static asset caching for optimal performance
- Proper handling of the admin dashboard route

Simply connect your repository to Vercel and deploy. The configuration will automatically handle routing.

## 🎮 How to Play

1. **Choose a Game Mode**
   - Select "Daily Challenge" to play today's challenge and compete on the leaderboard
   - Choose "Random Game" to create your own custom journey
   - Try "Zen Mode" for practice games without leaderboard pressure

2. **Set Up Your Journey**
   - Enter article titles manually, or
   - Use category filters to randomize within topics, or
   - Click "Random" to get completely random articles

3. **Start Playing**
   - Click "Start Journey" to begin
   - Read the current article and find links that might lead you closer to your goal
   - Click on links to navigate through Wikipedia
   - Use the back button to undo moves

4. **Win the Game**
   - Reach the goal article to complete the challenge
   - Your moves and time will be recorded
   - Submit your score to compete on the leaderboard (Daily Challenge only)!

## 🏗️ Project Structure

```
wikigo/
├── public/                    # Static assets
│   ├── DailyMode.png         # Daily Challenge mode image
│   ├── RandomMode.png        # Random Game mode image
│   ├── ZenMode.jpg           # Zen Mode image
│   ├── favicon.svg           # Favicon
│   ├── manifest.json         # PWA manifest
│   ├── robots.txt            # SEO robots file
│   └── sitemap.xml           # SEO sitemap
├── src/
│   ├── components/           # React components
│   │   ├── ui/               # Reusable UI components (Button, Card, Input, etc.)
│   │   ├── admin/            # Admin dashboard components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminCharts.jsx
│   │   │   ├── AdminTables.jsx
│   │   │   ├── DailyChallengeManager.jsx
│   │   │   └── PracticeGamesManager.jsx
│   │   ├── game/             # Game-specific components
│   │   │   ├── ChallengeScreen.jsx
│   │   │   ├── GameResults.jsx
│   │   │   ├── GameSetup.jsx
│   │   │   ├── Onboarding.jsx
│   │   │   ├── ScoringMethodology.jsx
│   │   │   ├── WikipediaArticleViewer.jsx
│   │   │   ├── ZenModeSelection.jsx
│   │   │   └── ZenModeSolution.jsx
│   │   ├── GameModeTiles.jsx # Game mode selection tiles
│   │   ├── HeroSection.jsx   # Hero section component
│   │   ├── Leaderboard.jsx   # Leaderboard display
│   │   ├── SettingsPanel.jsx # Settings panel
│   │   ├── ThemeSwitcher.jsx # Theme switcher
│   │   ├── UserStatsBar.jsx  # User statistics bar
│   │   ├── WikipediaJourneyGame.jsx # Main game component
│   │   ├── YesterdayChallenge.jsx # Yesterday's challenge display
│   │   ├── YesterdaySolution.jsx # Yesterday's solution display
│   │   └── YesterdaysTopPlayers.jsx # Top players from yesterday
│   ├── contexts/            # React contexts
│   │   └── ThemeContext.jsx  # Theme management context
│   ├── lib/                 # Utility functions
│   │   ├── supabase.js      # Supabase client configuration
│   │   ├── adminStats.js     # Admin dashboard statistics
│   │   ├── adminDailyChallenges.js # Daily challenge management
│   │   ├── adminPracticeGames.js # Practice games management
│   │   ├── challengeUtils.js # Challenge-related utilities
│   │   ├── gameAnalytics.js  # Game analytics tracking
│   │   ├── gameConstants.js  # Game constants and configuration
│   │   ├── timeUtils.js      # Time utility functions
│   │   ├── username.js       # Username management
│   │   ├── userStats.js      # User statistics
│   │   ├── utils.js          # General utilities
│   │   ├── wikipediaValidation.js # Wikipedia validation
│   │   └── zenModeUtils.js   # Zen Mode utilities
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── supabase_migrations/     # Database migration files
│   ├── create_game_analytics_table.sql
│   ├── create_practice_games_table.sql
│   ├── add_date_to_practice_games.sql
│   ├── add_solution_history_to_daily_challenges.sql
│   ├── add_tracking_to_leaderboard.sql
│   └── add_zen_mode_to_game_analytics.sql
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deployment configuration
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_SECRET=your_secret_admin_key
```

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_ADMIN_SECRET`: Secret key for accessing the admin dashboard (choose a strong, random string)

### Categories

The game supports filtering by various categories:
- Physics, Mathematics, Biology, Chemistry
- History, Geography, Literature
- Music, Film, Sports, Technology
- Philosophy, Art, Medicine, Astronomy

## 🌐 Browser Support

WikiGo supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔌 API Documentation

### Wikipedia API Usage

The game uses the MediaWiki API to fetch article data:

- **Article Summary**: `https://en.wikipedia.org/api/rest_v1/page/summary/{title}`
- **Article Links**: `https://en.wikipedia.org/w/api.php?action=query&prop=links&pllimit=500&titles={title}`
- **Article HTML**: `https://en.wikipedia.org/api/rest_v1/page/html/{title}`

All API calls are cached client-side to reduce requests and improve performance.

### Rate Limiting

The Wikipedia API has rate limits. The application implements client-side caching to minimize API calls. Each article's data is cached for 1 hour.

## ⚡ Performance

- **Client-side Caching**: Article summaries, links, and HTML are cached to reduce API calls
- **Debounced Updates**: Game history updates are debounced (500ms) to reduce database writes
- **Code Splitting**: Components are organized for potential code splitting
- **Optimized Images**: Images are optimized and lazy-loaded where appropriate
- **Minimal Dependencies**: Only essential dependencies are included

## 🐛 Troubleshooting

### Common Issues

**Issue**: Supabase connection errors
- **Solution**: Verify your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct in your `.env` file

**Issue**: Wikipedia API errors
- **Solution**: Check your internet connection. The Wikipedia API may be temporarily unavailable.

**Issue**: Game not loading
- **Solution**: Clear your browser cache and ensure all dependencies are installed (`npm install`)

**Issue**: Leaderboard not updating
- **Solution**: Verify your Supabase RLS policies are set correctly (see table setup above)

**Issue**: Admin dashboard not accessible
- **Solution**: Ensure `VITE_ADMIN_SECRET` is set and matches the URL path (`/admin-dashboard/{secret}`)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Wikipedia** for providing the API and content
- **Supabase** for backend infrastructure
- **All contributors** and open-source libraries that made this project possible

## 🔐 Admin Dashboard

The admin dashboard provides comprehensive analytics and statistics about game usage, user activity, and performance metrics.

### Accessing the Admin Dashboard

1. Set the `VITE_ADMIN_SECRET` environment variable in your `.env` file with a secret key of your choice
2. Navigate to `/admin-dashboard/{your-secret-key}` in your browser
   - Example: If your secret is `my-secret-123`, visit `http://localhost:5173/admin-dashboard/my-secret-123`
3. The dashboard will redirect to the home page if the secret doesn't match

### Dashboard Features

The admin dashboard includes:

- **Overview Statistics**: Total games started/completed, completion rates, active users, today's stats
- **Daily Challenge Analytics**: Completion trends, average moves/time per challenge, challenge history table
- **User Activity**: Top users, games started vs completed, user completion rates
- **Leaderboard Analytics**: Score distributions, top players, moves vs time correlations
- **Game Performance**: Average moves/time, popular articles, category usage statistics
- **Time-based Trends**: Daily, weekly, and monthly trend analysis with interactive charts
- **Daily Challenge Management**: Create and manage daily challenges
- **Practice Games Management**: Add and manage Zen Mode practice games

All data is fetched in real-time from your Supabase database and includes interactive charts and sortable tables.

## 🗺️ Roadmap

Future features and improvements planned:

- [ ] Multiplayer mode
- [ ] Achievement system
- [ ] Social sharing of scores
- [ ] Custom challenge creation
- [ ] More game modes
- [ ] Mobile app version
- [ ] Internationalization (i18n)
- [ ] Advanced analytics
- [ ] Tournament mode

## 📧 Support

If you encounter any issues or have questions:
- Open an [issue](https://github.com/lucky-builds/WikiGo/issues) on GitHub
- Check existing issues for solutions
- Review the [documentation](https://github.com/lucky-builds/WikiGo/wiki)

---

**Happy Journeying!** 🚀
