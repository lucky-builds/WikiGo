# 🎮 Wikipedia Journey Game

A fun and educational web game where players navigate from one Wikipedia article to another using only internal links. Challenge yourself to find the shortest path between two articles, compete on the leaderboard, and test your knowledge with daily challenges!

![Wikipedia Journey Game](WikiGo.png)

## ✨ Features

### 🎯 Game Modes

- **Daily Challenge**: Play the same challenge as everyone else each day. The start and goal articles are randomly selected based on the date, ensuring fairness and competition.
- **Custom Game**: Create your own journey by selecting start and goal articles, or use category filters to randomize within specific topics.

### 🏆 Competitive Features

- **Global Leaderboard**: Compete with players worldwide and see who completes challenges the fastest
- **Timer**: Track your completion time for each journey
- **Move Counter**: Count the number of clicks needed to reach your goal
- **Score Submission**: Submit your scores to compete on the leaderboard

### 🎨 User Experience

- **Dark/Light/Classic Themes**: Choose your preferred color scheme
- **Responsive Design**: Play seamlessly on desktop, tablet, and mobile devices
- **Article Preview**: View Wikipedia article summaries and content without leaving the game
- **History Navigation**: Navigate back through your journey path
- **Category Filters**: Filter articles by topics like Physics, History, Art, Technology, and more
- **Search Functionality**: Search for specific Wikipedia articles to use as start or goal

### 📚 Educational

- **Learn While Playing**: Discover interesting Wikipedia articles and connections
- **Explore Categories**: Dive deep into specific topics with category-based challenges
- **Article Summaries**: Read summaries and full article content to make informed decisions

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account (for leaderboard functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wiki
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
   ```

4. **Set up Supabase tables**
   
   Create the following tables in your Supabase project:
   
   **Leaderboard table:**
   ```sql
   CREATE TABLE leaderboard (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username TEXT NOT NULL,
     moves INTEGER NOT NULL,
     time_seconds INTEGER NOT NULL,
     challenge_date DATE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_leaderboard_challenge_date ON leaderboard(challenge_date);
   CREATE INDEX idx_leaderboard_moves_time ON leaderboard(challenge_date, moves, time_seconds);
   ```
   
   **Daily Challenges table:**
   ```sql
   CREATE TABLE daily_challenges (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     challenge_date DATE UNIQUE NOT NULL,
     start_title TEXT NOT NULL,
     goal_title TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_daily_challenges_date ON daily_challenges(challenge_date);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Supabase** - Backend for leaderboard and daily challenges
- **Wikipedia API** - Article data and links
- **Lucide React** - Icons
- **Canvas Confetti** - Celebration effects

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
   - Select "Daily Challenge" to play today's challenge
   - Or choose "Custom Game" to set your own start and goal

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
   - Submit your score to compete on the leaderboard!

## 🏗️ Project Structure

```
wiki/
├── public/              # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # Reusable UI components
│   │   ├── admin/      # Admin dashboard components
│   │   ├── Leaderboard.jsx
│   │   ├── ThemeSwitcher.jsx
│   │   └── WikipediaJourneyGame.jsx
│   ├── contexts/       # React contexts
│   │   └── ThemeContext.jsx
│   ├── lib/            # Utility functions
│   │   ├── supabase.js
│   │   ├── adminStats.js
│   │   ├── username.js
│   │   └── utils.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── vercel.json         # Vercel deployment configuration
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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Wikipedia for providing the API and content
- Supabase for backend infrastructure
- All the open-source libraries that made this project possible

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

All data is fetched in real-time from your Supabase database and includes interactive charts and sortable tables.

## 📧 Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Happy Journeying!** 🚀

