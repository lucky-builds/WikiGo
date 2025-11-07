import WikipediaJourneyGame from './components/WikipediaJourneyGame'
import { ThemeProvider } from './contexts/ThemeContext'
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <ThemeProvider>
      <WikipediaJourneyGame />
      <Analytics />
    </ThemeProvider>
  )
}

export default App

