import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const C = {
  primary: '#3525cd',
  surface: '#f9f9ff',
  surfaceLowest: '#ffffff',
  surfaceContainer: '#e7eefe',
  surfaceHigh: '#e2e8f8',
  onSurface: '#151c27',
  onSurfaceVariant: '#464555',
  outlineVariant: '#c7c4d8',
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/transactions', label: 'Transactions', icon: 'receipt_long' },
  { to: '/categories', label: 'Categories', icon: 'sell' },
  { to: '/budgets', label: 'Budget', icon: 'savings' },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      <aside style={{ width: '256px', background: C.surfaceLowest, borderRight: `1px solid ${C.outlineVariant}`, display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>

        <div style={{ padding: '24px 20px', borderBottom: `1px solid ${C.outlineVariant}` }}>
          <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '22px', fontWeight: 700, color: C.primary }}>Monevo</span>
        </div>

        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.outlineVariant}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: C.surfaceContainer, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '15px', fontWeight: 700, color: C.primary }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: C.onSurface, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ fontSize: '12px', color: C.onSurfaceVariant, margin: 0 }}>Welcome back</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 14px', borderRadius: '10px',
                  background: isActive ? C.surfaceContainer : 'transparent',
                  cursor: 'pointer', position: 'relative',
                  borderLeft: isActive ? `4px solid ${C.primary}` : '4px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px', color: isActive ? C.primary : C.onSurfaceVariant, lineHeight: 1, flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: isActive ? 600 : 500, color: isActive ? C.primary : C.onSurfaceVariant }}>
                    {item.label}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: `1px solid ${C.outlineVariant}` }}>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '11px 14px', borderRadius: '10px', border: 'none',
            background: 'transparent', cursor: 'pointer', transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: C.onSurfaceVariant, lineHeight: 1 }}>logout</span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: C.onSurfaceVariant }}>Sign Out</span>
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, background: C.surface, overflow: 'auto', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
