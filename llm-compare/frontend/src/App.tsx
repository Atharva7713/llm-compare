import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Compare from './pages/Compare'
import History from './pages/History'
import Share from './pages/Share'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'

const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/history" element={<History />} />
              <Route path="/share" element={<Share />} />
            </Routes>
          </Layout>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default App 