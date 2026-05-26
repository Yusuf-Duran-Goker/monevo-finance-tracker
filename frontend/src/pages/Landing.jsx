import { Link } from 'react-router-dom'

const colors = {
  primary: '#3525cd',
  primaryContainer: '#4f46e5',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#dad7ff',
  secondary: '#006c49',
  secondaryContainer: '#6cf8bb',
  onSecondaryContainer: '#00714d',
  tertiary: '#95002b',
  surface: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#e7eefe',
  surfaceContainerHigh: '#e2e8f8',
  surfaceContainerHighest: '#dce2f3',
  onSurface: '#151c27',
  onSurfaceVariant: '#464555',
  outlineVariant: '#c7c4d8',
  outline: '#777587',
  inverseSurface: '#2a313d',
}

const font = {
  display: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '48px', fontWeight: 700, lineHeight: '56px', letterSpacing: '-0.02em' },
  headlineLg: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '32px', fontWeight: 600, lineHeight: '40px', letterSpacing: '-0.01em' },
  headlineMd: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, lineHeight: '32px' },
  bodyLg: { fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 400, lineHeight: '28px' },
  bodyMd: { fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
  bodySm: { fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
  labelMd: { fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, lineHeight: '16px', letterSpacing: '0.05em' },
}

function Icon({ name, size = 24, color, style = {} }) {
  return (
    <span className="material-symbols-outlined" style={{ fontSize: size, color, lineHeight: 1, ...style }}>
      {name}
    </span>
  )
}

export default function Landing() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: colors.surface, color: colors.onSurface, minHeight: '100vh' }}>

      <nav style={{ backgroundColor: colors.surfaceContainerLowest, borderBottom: `1px solid ${colors.outlineVariant}`, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <span style={{ ...font.headlineMd, color: colors.primary }}>Monevo</span>
            <Link to="/why-monevo" style={{ ...font.bodyMd, color: colors.onSurfaceVariant, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = colors.primary}
              onMouseLeave={e => e.target.style.color = colors.onSurfaceVariant}>
              What is Monevo?
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/login" style={{ ...font.bodyMd, fontWeight: 500, color: colors.onSurfaceVariant, textDecoration: 'none', padding: '8px 16px' }}
              onMouseEnter={e => e.target.style.color = colors.primary}
              onMouseLeave={e => e.target.style.color = colors.onSurfaceVariant}>
              Login
            </Link>
            <Link to="/register" style={{ ...font.bodyMd, fontWeight: 700, backgroundColor: colors.primary, color: colors.onPrimary, textDecoration: 'none', padding: '10px 24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(53,37,205,0.25)' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section style={{ background: 'radial-gradient(circle at 50% 0%, #e7eefe 0%, #f9f9ff 100%)', padding: '80px 24px 96px', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '9999px', backgroundColor: colors.surfaceContainer, color: colors.primary, ...font.labelMd, width: 'fit-content' }}>
              NEW: SMART BUDGETING FOR 2024
            </span>
            <h1 style={{ ...font.display, color: colors.onSurface, margin: 0 }}>
              Take control of<br />your <span style={{ color: colors.primary }}>finances</span>
            </h1>
            <p style={{ ...font.bodyLg, color: colors.onSurfaceVariant, maxWidth: '480px', margin: 0 }}>
              The smart way for students and young professionals to track spending, set budgets, and grow wealth. All your accounts in one beautiful place.
            </p>
            <div style={{ display: 'flex', gap: '16px', paddingTop: '8px' }}>
              <Link to="/register" style={{ ...font.bodyLg, fontWeight: 700, backgroundColor: colors.primary, color: colors.onPrimary, textDecoration: 'none', padding: '16px 32px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(53,37,205,0.3)', display: 'inline-block' }}>
                Get Started Free
              </Link>
              <Link to="/why-monevo" style={{ ...font.bodyLg, fontWeight: 700, backgroundColor: 'transparent', color: colors.primary, textDecoration: 'none', padding: '16px 32px', borderRadius: '12px', border: `2px solid ${colors.primary}`, display: 'inline-block' }}>
                What is Monevo?
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '16px' }}>
              <div style={{ display: 'flex' }}>
                {['#4f46e5', '#006c49', '#95002b'].map((c, i) => (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: c, border: `2px solid ${colors.surface}`, marginLeft: i > 0 ? '-12px' : 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>
                      {['AK', 'MB', 'EL'][i]}
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ ...font.bodySm, color: colors.onSurfaceVariant, margin: 0 }}>
                Joined by <strong style={{ color: colors.onSurface }}>15,000+</strong> ambitious savers
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-48px', right: '-48px', width: '256px', height: '256px', backgroundColor: `${colors.primary}18`, borderRadius: '50%', filter: 'blur(48px)', zIndex: 0 }} />
            <div style={{ position: 'absolute', bottom: '-48px', left: '-48px', width: '256px', height: '256px', backgroundColor: `${colors.secondary}18`, borderRadius: '50%', filter: 'blur(48px)', zIndex: 0 }} />
            <div style={{ position: 'relative', zIndex: 1, width: '280px', aspectRatio: '9/19', backgroundColor: colors.inverseSurface, borderRadius: '48px', border: `8px solid ${colors.inverseSurface}`, boxShadow: '0 32px 80px rgba(0,0,0,0.35)', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, width: '100%', height: '24px', backgroundColor: colors.inverseSurface, zIndex: 10, display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '80px', height: '18px', backgroundColor: colors.inverseSurface, borderRadius: '0 0 16px 16px' }} />
              </div>
              <div style={{ width: '100%', height: '100%', backgroundColor: colors.surface, padding: '28px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                  <span style={{ ...font.headlineMd, fontSize: '18px', color: colors.primary }}>Monevo</span>
                  <Icon name="notifications" size={20} color={colors.onSurfaceVariant} />
                </div>
                <div style={{ backgroundColor: colors.primaryContainer, borderRadius: '16px', padding: '16px', color: colors.onPrimaryContainer }}>
                  <p style={{ ...font.labelMd, opacity: 0.8, textTransform: 'uppercase', marginBottom: '4px' }}>Total Balance</p>
                  <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, margin: '0 0 8px' }}>$12,450.80</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ backgroundColor: colors.secondaryContainer, color: colors.onSecondaryContainer, padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700 }}>+4.2%</span>
                    <span style={{ fontSize: '11px', opacity: 0.8 }}>than last month</span>
                  </div>
                </div>
                <p style={{ ...font.bodySm, fontWeight: 700, padding: '0 4px', margin: 0 }}>Recent Activity</p>
                {[
                  { icon: 'shopping_cart', label: 'Groceries', sub: 'Today, 2:45 PM', amount: '-$42.00', income: false, bg: colors.surfaceContainer },
                  { icon: 'payments', label: 'Salary', sub: 'Yesterday', amount: '+$2,800.00', income: true, bg: `${colors.secondaryContainer}40` },
                  { icon: 'local_cafe', label: 'Coffee', sub: 'Mon, 9:10 AM', amount: '-$5.50', income: false, bg: colors.surfaceContainer },
                ].map((t, i) => (
                  <div key={i} style={{ backgroundColor: colors.surfaceContainerLowest, borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={t.icon} size={18} color={t.income ? colors.secondary : colors.primary} />
                      </div>
                      <div>
                        <p style={{ ...font.bodySm, fontWeight: 700, margin: 0 }}>{t.label}</p>
                        <p style={{ fontSize: '11px', color: colors.onSurfaceVariant, margin: 0 }}>{t.sub}</p>
                      </div>
                    </div>
                    <p style={{ ...font.bodySm, fontWeight: 700, color: t.income ? colors.secondary : colors.tertiary, margin: 0 }}>{t.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ ...font.headlineLg, color: colors.onSurface, margin: '0 0 16px' }}>Designed for your lifestyle</h2>
            <p style={{ ...font.bodyMd, color: colors.onSurfaceVariant, maxWidth: '560px', margin: '0 auto' }}>
              Stop guessing where your money goes. Monevo provides the tools you need to build healthy financial habits from day one.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div style={{ gridColumn: 'span 2', backgroundColor: colors.surfaceContainerLow, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon name="analytics" size={24} color={colors.onPrimary} />
                </div>
                <h3 style={{ ...font.headlineMd, color: colors.onSurface, margin: '0 0 8px' }}>Intelligent Spending Analytics</h3>
                <p style={{ ...font.bodyMd, color: colors.onSurfaceVariant, margin: 0 }}>Automatically categorize your transactions and see exactly how much you spend on coffee, rent, and entertainment each month.</p>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  {[40, 60, 90, 75, 50, 85].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: i === 2 ? colors.primary : colors.surfaceContainerHighest, borderRadius: '6px 6px 0 0', transition: 'background 0.2s' }} />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: colors.surfaceContainerHighest, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: colors.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon name="savings" size={24} color="#fff" />
                </div>
                <h3 style={{ ...font.headlineMd, color: colors.onSurface, margin: '0 0 8px' }}>Smart Budgets</h3>
                <p style={{ ...font.bodyMd, color: colors.onSurfaceVariant, margin: 0 }}>Set goals and track your progress with intuitive visualizations that adapt to your habits.</p>
              </div>
              <div style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ ...font.bodySm, fontWeight: 700 }}>Summer Trip</span>
                  <span style={{ ...font.bodySm, fontWeight: 700, color: colors.secondary }}>75%</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: colors.surfaceContainer, borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', backgroundColor: colors.secondary }} />
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: colors.surfaceContainer, borderRadius: '24px', padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#bf0f3c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon name="lock" size={24} color="#fff" />
              </div>
              <h3 style={{ ...font.headlineMd, color: colors.onSurface, margin: '0 0 8px' }}>Bank-Level Security</h3>
              <p style={{ ...font.bodyMd, color: colors.onSurfaceVariant, margin: 0 }}>Your data is encrypted with 256-bit AES encryption. We never sell your personal information.</p>
            </div>

            <div style={{ gridColumn: 'span 2', backgroundColor: colors.inverseSurface, borderRadius: '24px', padding: '32px', display: 'flex', alignItems: 'center', gap: '48px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ ...font.headlineMd, color: '#fff', margin: '0 0 12px' }}>Scan receipts with AI</h3>
                <p style={{ ...font.bodyMd, color: colors.surfaceContainerHighest, margin: '0 0 20px' }}>
                  Upload a photo or PDF of any receipt. Monevo's AI extracts every transaction automatically and adds it to your tracker.
                </p>
                <Link to="/register" style={{ ...font.bodySm, fontWeight: 700, color: '#c3c0ff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Try it free <Icon name="arrow_forward" size={16} color="#c3c0ff" />
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {['document_scanner', 'receipt_long', 'auto_fix_high'].map((icon, i) => (
                  <div key={i} style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={icon} size={28} color="#fff" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', backgroundColor: colors.primary, borderRadius: '40px', padding: '80px 96px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '40%', paddingBottom: '40%', backgroundColor: '#fff', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.1, pointerEvents: 'none' }} />
          <h2 style={{ ...font.display, color: colors.onPrimary, margin: '0 0 16px' }}>Ready to master your money?</h2>
          <p style={{ ...font.bodyLg, color: colors.onPrimaryContainer, maxWidth: '480px', margin: '0 auto 32px', opacity: 0.9 }}>
            Join thousands of young professionals who have transformed their relationship with money using Monevo.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/register" style={{ ...font.bodyLg, fontWeight: 700, backgroundColor: '#fff', color: colors.primary, textDecoration: 'none', padding: '18px 40px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'inline-block' }}>
              Start Your Free Trial
            </Link>
            <Link to="/why-monevo" style={{ ...font.bodyLg, fontWeight: 700, backgroundColor: 'transparent', color: '#fff', textDecoration: 'none', padding: '18px 40px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.3)', display: 'inline-block' }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <footer style={{ backgroundColor: colors.surfaceContainerLowest, borderTop: `1px solid ${colors.outlineVariant}` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '32px' }}>
          <div>
            <span style={{ ...font.headlineMd, color: colors.primary, display: 'block', marginBottom: '8px' }}>Monevo</span>
            <p style={{ ...font.bodySm, color: colors.onSurfaceVariant, maxWidth: '240px', margin: '0 0 8px' }}>The modern financial companion for the next generation of wealth builders.</p>
            <p style={{ ...font.bodySm, color: colors.onSurfaceVariant, margin: 0 }}>© 2026 Monevo. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '64px' }}>
            {[
              { title: 'Product', links: ['Features', 'Security', 'Pricing'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog'] },
              { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Help Center'] },
            ].map(col => (
              <div key={col.title} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span style={{ ...font.labelMd, color: colors.onSurface, textTransform: 'uppercase' }}>{col.title}</span>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ ...font.bodySm, color: colors.onSurfaceVariant, textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = colors.primary}
                    onMouseLeave={e => e.target.style.color = colors.onSurfaceVariant}>
                    {l}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
