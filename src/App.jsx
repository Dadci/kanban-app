import DashboardLayout from './components/DashboardLayout'
import { ThemeProvider } from './context/ThemeContext'


function App() {

  return (

    <ThemeProvider>

      <div>
        <DashboardLayout />
      </div>

    </ThemeProvider>

  )
}

export default App
