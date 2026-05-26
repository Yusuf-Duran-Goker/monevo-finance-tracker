import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const C = {
  primary: '#3525cd',
  onPrimary: '#ffffff',
  primaryFixed: '#e2dfff',
  onPrimaryFixedVariant: '#3323cc',
  surface: '#f9f9ff',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f0f3ff',
  surfaceContainer: '#e7eefe',
  surfaceHigh: '#e2e8f8',
  onSurface: '#151c27',
  onSurfaceVariant: '#464555',
  onBackground: '#151c27',
  outline: '#777587',
  outlineVariant: '#c7c4d8',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  tertiary: '#95002b',
  tertiaryFixedDim: '#ffb2b7',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputBase = {
    width: '100%', height: '48px', border: `1px solid ${C.outlineVariant}`,
    borderRadius: '12px', fontSize: '16px', lineHeight: '24px',
    fontFamily: "'Inter', sans-serif", color: C.onSurface,
    background: C.surfaceLowest, outline: 'none',
    paddingLeft: '48px', paddingRight: '16px',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      <div style={{
        width: '60%', background: C.onBackground, display: 'flex',
        alignItems: 'center', justifyContent: 'flex-start',
        padding: '40px 48px 40px 250px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 2px 2px, #3525cd 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />

        <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#fff', fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: C.primaryFixed }}>
              Monevo
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '48px', fontWeight: 700,
            lineHeight: '56px', letterSpacing: '-0.02em', color: '#ffffff',
            marginBottom: '12px',
          }}>
            Master your money with clinical precision.
          </h1>

          <p style={{ fontSize: '18px', lineHeight: '28px', color: C.outlineVariant, maxWidth: '480px', marginBottom: '24px' }}>
            Join over 50,000 users who have streamlined their financial journey using our intelligent tracking and budgeting ecosystem.
          </p>

          <div style={{
            borderRadius: '12px', overflow: 'hidden',
            border: `1px solid rgba(199,196,216,0.2)`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            aspectRatio: '16/9',
            width: 'calc(100% + 200px)',
          }}>
            <img
              alt="Financial Dashboard"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkLDV42xFpFcMWZz4ClgPrYHHukgfnf3qEMk0vJij8AdZT96hh0fNmjpWpIDJwyNfyY_PyymOm58oNQdI1LMRUj58m-HeoNFp35A-fVyN5EW0D7ombZnxxlHVaVBOguWECWce1WU6Jw0vOuZH2CTopj-RJRNBgs0-owVhUb10ynj6OL9A2V3vySida9u1ggMfvsb6NPFBwA8jruhXUko309i5JeVC41ApQjBEJr95_TnKpcTdp5CiUaOwcn0C-QzbaM_3bdoMlJEM"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>
      </div>

      <div style={{
        flex: 1, background: C.surface, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px',
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div style={{
            background: C.surfaceLowest, borderRadius: '16px',
            border: `1px solid ${C.outlineVariant}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            padding: '32px',
          }}>
            <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onSurface, marginBottom: '8px' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '16px', color: C.onSurfaceVariant, marginBottom: '28px', lineHeight: '24px' }}>
              Please enter your details to access your account.
            </p>

            {error && (
              <div style={{
                background: C.errorContainer, border: `1px solid ${C.tertiaryFixedDim}`,
                color: C.onErrorContainer, fontSize: '14px', borderRadius: '12px',
                padding: '12px 16px', marginBottom: '20px',
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: C.onSurfaceVariant, marginBottom: '8px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '20px', color: C.outline, pointerEvents: 'none',
                  }}>mail</span>
                  <input
                    type="email" required placeholder="name@company.com"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    style={inputBase}
                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                    onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: C.onSurfaceVariant }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: '12px', fontWeight: 600, color: C.primary, textDecoration: 'none' }}>Forgot password?</a>
                </div>
                <div style={{ position: 'relative' }}>
                  <span className="material-symbols-outlined" style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '20px', color: C.outline, pointerEvents: 'none',
                  }}>lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ ...inputBase, paddingRight: '48px' }}
                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                    onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, color: C.outline,
                    display: 'flex', alignItems: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: C.primary }} />
                <label htmlFor="remember" style={{ fontSize: '14px', color: C.onSurfaceVariant, cursor: 'pointer', userSelect: 'none' }}>
                  Remember for 30 days
                </label>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', height: '48px', background: C.primary, color: C.onPrimary,
                border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.05em', fontFamily: "'Inter', sans-serif",
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                transition: 'background 0.15s, transform 0.1s',
                marginBottom: '24px',
              }}
                onMouseEnter={e => { if (!loading) e.target.style.background = C.onPrimaryFixedVariant }}
                onMouseLeave={e => { e.target.style.background = C.primary }}
                onMouseDown={e => { e.target.style.transform = 'scale(0.98)' }}
                onMouseUp={e => { e.target.style.transform = 'scale(1)' }}
              >
                {loading ? 'Signing in...' : 'Log In'}
              </button>

            </form>

            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: C.onSurfaceVariant }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: C.primary, fontWeight: 700, textDecoration: 'none' }}>Get Started</Link>
            </p>
          </div>

          <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Help Center'].map(t => (
              <a key={t} href="#" style={{ fontSize: '12px', fontWeight: 600, color: C.outline, textDecoration: 'none', letterSpacing: '0.05em' }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
