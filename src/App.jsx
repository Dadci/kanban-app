import DashboardLayout from './components/DashboardLayout'
import { ThemeProvider } from './context/ThemeContext'
import { Suspense } from 'react'



const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
  </div>
)

function App() {

  return (

    <ThemeProvider>
      <Suspense fallback={<LoadingFallback />}>
        <div>
          <DashboardLayout />
        </div>

      </Suspense>
    </ThemeProvider>

  )
}

export default App
