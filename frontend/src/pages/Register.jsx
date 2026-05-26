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
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
  tertiaryFixedDim: '#ffb2b7',
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ flex: 1, display: 'flex' }}>

        <div style={{
          width: '60%', background: C.onBackground, display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between',
          padding: '40px 48px 40px 250px', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
            backgroundImage: 'radial-gradient(circle at 2px 2px, #3525cd 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }} />

          <div style={{ position: 'absolute', inset: 0, opacity: 0.2, pointerEvents: 'none' }}>
            <img
              alt="Financial Dashboard"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDssyTef688dqpkSAfSRGhOw9afBur67sNCjMLVtD-Gn1PewKTbWi9f9UHzsY5yw6QVPS3iew98D_SWsmqM7tujUARhspb4efF3LoGAKN_PwTaN0FwdPUhYicId1lr-4XQd8k8QMIedFSd5EImZjHOtubwux3RlYdj2hw_Qj0n6vX3dJQn_McmtGGkXyqY7gwP_-aPa91ifrLjLzq59dUi2nYMPbER7-Fwhs7zLRLhC6tf1v5Ad2MEpw_pCT3Hp7t-IZ5xBryMKKmo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%)' }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
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
              maxWidth: '420px', marginBottom: '16px',
            }}>
              Empower your financial future.
            </h1>

            <p style={{ fontSize: '18px', lineHeight: '28px', color: C.outlineVariant, maxWidth: '380px' }}>
              Join thousands of users who have found clarity and control over their personal finances with Monevo's smart tracking tools.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.primaryFixed, margin: 0 }}>15k+</p>
              <p style={{ fontSize: '14px', color: C.outlineVariant, margin: 0 }}>Active Users</p>
            </div>
            <div style={{ width: '1px', height: '48px', background: C.outlineVariant }} />
            <div>
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.primaryFixed, margin: 0 }}>$2.4B</p>
              <p style={{ fontSize: '14px', color: C.outlineVariant, margin: 0 }}>Tracked Monthly</p>
            </div>
          </div>
        </div>

        <div style={{
          flex: 1, background: C.surface, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
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
                Join Monevo
              </h2>
              <p style={{ fontSize: '16px', color: C.onSurfaceVariant, marginBottom: '28px', lineHeight: '24px' }}>
                Create your account to start managing your wealth today.
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

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{
                      position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '20px', color: C.outline, pointerEvents: 'none',
                    }}>person</span>
                    <input
                      type="text" required placeholder="John Doe"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      style={inputBase}
                      onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                      onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{
                      position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '20px', color: C.outline, pointerEvents: 'none',
                    }}>mail</span>
                    <input
                      type="email" required placeholder="name@example.com"
                      value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                      style={inputBase}
                      onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                      onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, marginBottom: '8px' }}>
                    Password
                  </label>
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
                  <p style={{ fontSize: '14px', color: C.outline, marginTop: '6px' }}>Must be at least 8 characters long.</p>
                </div>

                <button
                  type="submit" disabled={loading}
                  style={{
                    width: '100%', height: '48px', background: C.primary, color: C.onPrimary,
                    border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 700,
                    fontFamily: "'Inter', sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1, transition: 'background 0.15s, transform 0.1s',
                  }}
                  onMouseEnter={e => { if (!loading) e.target.style.background = C.onPrimaryFixedVariant }}
                  onMouseLeave={e => { e.target.style.background = C.primary }}
                  onMouseDown={e => { e.target.style.transform = 'scale(0.98)' }}
                  onMouseUp={e => { e.target.style.transform = 'scale(1)' }}
                >
                  {loading ? 'Creating account...' : 'Sign Up'}
                </button>
              </form>

              <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '16px', color: C.onSurfaceVariant }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: C.primary, fontWeight: 700, textDecoration: 'none' }}>Login</Link>
              </p>

              <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px', color: C.outline, lineHeight: '20px' }}>
                By signing up, you agree to our{' '}
                <a href="#" style={{ color: C.outline, textDecoration: 'underline' }}>Terms of Service</a>{' '}
                and{' '}
                <a href="#" style={{ color: C.outline, textDecoration: 'underline' }}>Privacy Policy</a>.
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

      <footer style={{
        background: C.surfaceLowest, borderTop: `1px solid ${C.outlineVariant}`,
        padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'Inter', sans-serif",
      }}>
        <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0 }}>© 2024 Monevo. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Privacy Policy', 'Terms of Service', 'Help Center'].map(t => (
            <a key={t} href="#" style={{ fontSize: '14px', color: C.onSurfaceVariant, textDecoration: 'none' }}>{t}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
