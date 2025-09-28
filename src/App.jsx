import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Analytics from "./components/Analytics";
import { ThemeProvider } from "./context/ThemeContext";
import { Suspense } from "react";
import BoardWarpper from "./components/BoardWarpper";

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<BoardWarpper />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
