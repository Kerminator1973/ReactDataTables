import './App.css'
import Page from './components/Page'
import { ThemeContextProvider } from './contexts/ThemeContext'

function App() {
  return (
    <>
      <ThemeContextProvider defaultTheme="light">
        <Page />
      </ThemeContextProvider>
    </>
  )
}

export default App
