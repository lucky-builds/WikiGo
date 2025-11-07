import WikipediaJourneyGame from './components/WikipediaJourneyGame'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <WikipediaJourneyGame />
    </ThemeProvider>
  )
}

export default App

