import { BrowserRouter, Routes, Route } from 'react-router-dom'
import WikipediaJourneyGame from './components/WikipediaJourneyGame'
import { ThemeProvider } from './contexts/ThemeContext'
import { Analytics } from "@vercel/analytics/react"
import { AdminRoute } from './components/admin/AdminRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin dashboard route with secret path */}
        <Route path="/admin-dashboard/:secret" element={<AdminRoute />} />
        
        {/* Main game route */}
        <Route
          path="/*"
          element={
            <ThemeProvider>
              <WikipediaJourneyGame />
              <Analytics />
            </ThemeProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

