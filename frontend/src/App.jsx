import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import WhyMonevo from './pages/WhyMonevo'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Budgets from './pages/Budgets'

const appFont = { fontFamily: "'DM Sans', system-ui, sans-serif" }

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? <Layout>{children}</Layout> : <Navigate to="/login" replace />
}

function AuthRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : <div style={appFont}>{children}</div>
}

function AppRoute({ children }) {
  return <div style={appFont}>{children}</div>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/why-monevo" element={<WhyMonevo />} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/dashboard" element={<AppRoute><PrivateRoute><Dashboard /></PrivateRoute></AppRoute>} />
          <Route path="/transactions" element={<AppRoute><PrivateRoute><Transactions /></PrivateRoute></AppRoute>} />
          <Route path="/categories" element={<AppRoute><PrivateRoute><Categories /></PrivateRoute></AppRoute>} />
          <Route path="/budgets" element={<AppRoute><PrivateRoute><Budgets /></PrivateRoute></AppRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
