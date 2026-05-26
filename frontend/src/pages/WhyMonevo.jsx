import { Link } from 'react-router-dom'

const colors = {
  primary: '#3525cd',
  onPrimary: '#ffffff',
  surface: '#f9f9ff',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f0f3ff',
  surfaceContainer: '#e7eefe',
  surfaceContainerHigh: '#e2e8f8',
  surfaceContainerHighest: '#dce2f3',
  onSurface: '#151c27',
  onSurfaceVariant: '#464555',
  outlineVariant: '#c7c4d8',
  secondary: '#006c49',
  secondaryContainer: '#6cf8bb',
  onSecondaryContainer: '#00714d',
}

const font = {
  headlineLg: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '32px', fontWeight: 600, lineHeight: '40px', letterSpacing: '-0.01em' },
  headlineMd: { fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, lineHeight: '32px' },
  bodyLg: { fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 400, lineHeight: '28px' },
  bodyMd: { fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 400, lineHeight: '24px' },
  bodySm: { fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, lineHeight: '20px' },
  labelMd: { fontFamily: "'Inter', sans-serif", fontSize: '12px', fontWeight: 600, lineHeight: '16px', letterSpacing: '0.05em' },
}

const features = [
  {
    icon: 'document_scanner',
    title: 'AI Receipt Scanning',
    desc: 'Upload any receipt or bank statement — photo or PDF — and our AI extracts every transaction automatically. No manual entry, no mistakes.',
    color: '#3525cd',
    bg: '#e7eefe',
  },
  {
    icon: 'pie_chart',
    title: 'Smart Budget Tracking',
    desc: 'Set monthly targets per category. Watch your progress bars shift from green to red in real time as you spend, so you always know where you stand.',
    color: '#006c49',
    bg: '#6cf8bb40',
  },
  {
    icon: 'receipt_long',
    title: 'Transaction Management',
    desc: 'Add, edit, filter, and delete transactions with ease. Everything is organized by category, date, and type — income or expense — at a glance.',
    color: '#95002b',
    bg: '#ffdadb',
  },
  {
    icon: 'insights',
    title: 'Category Insights',
    desc: 'See your spending broken down by category with beautiful charts. Understand your habits and make smarter decisions every month.',
    color: '#3525cd',
    bg: '#e7eefe',
  },
]

export default function WhyMonevo() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: colors.surface, color: colors.onSurface, minHeight: '100vh' }}>

      <nav style={{ backgroundColor: colors.surfaceContainerLowest, borderBottom: `1px solid ${colors.outlineVariant}`, position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/" style={{ ...font.headlineMd, color: colors.primary, textDecoration: 'none' }}>Monevo</Link>
            <Link to="/why-monevo" style={{ ...font.bodyMd, color: colors.primary, textDecoration: 'none', fontWeight: 600 }}>
              What is Monevo?
            </Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/login" style={{ ...font.bodyMd, fontWeight: 500, color: colors.onSurfaceVariant, textDecoration: 'none', padding: '8px 16px' }}>
              Login
            </Link>
            <Link to="/register" style={{ ...font.bodyMd, fontWeight: 700, backgroundColor: colors.primary, color: colors.onPrimary, textDecoration: 'none', padding: '10px 24px', borderRadius: '12px' }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section style={{ background: 'radial-gradient(circle at 50% 0%, #e7eefe 0%, #f9f9ff 100%)', padding: '80px 24px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '9999px', backgroundColor: colors.surfaceContainer, color: colors.primary, ...font.labelMd, marginBottom: '24px' }}>
            ABOUT MONEVO
          </span>
          <h1 style={{ ...font.headlineLg, fontSize: '40px', lineHeight: '48px', color: colors.onSurface, margin: '0 0 20px' }}>
            Your finances, finally <span style={{ color: colors.primary }}>under control</span>
          </h1>
          <p style={{ ...font.bodyLg, color: colors.onSurfaceVariant, margin: '0 0 36px' }}>
            Monevo was built for students and young professionals who want clarity — not complexity — when managing their money.
          </p>
          <Link to="/register" style={{ ...font.bodyLg, fontWeight: 700, backgroundColor: colors.primary, color: colors.onPrimary, textDecoration: 'none', padding: '16px 40px', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 16px rgba(53,37,205,0.3)' }}>
            Get Started Free
          </Link>
        </div>
      </section>

      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {features.map((f) => (
            <div key={f.title} style={{ backgroundColor: colors.surfaceContainerLow, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', backgroundColor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '26px', color: f.color }}>{f.icon}</span>
              </div>
              <h3 style={{ ...font.headlineMd, color: colors.onSurface, margin: 0 }}>{f.title}</h3>
              <p style={{ ...font.bodyMd, color: colors.onSurfaceVariant, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', backgroundColor: colors.primary, borderRadius: '32px', padding: '64px', textAlign: 'center' }}>
          <h2 style={{ ...font.headlineLg, color: '#fff', margin: '0 0 16px' }}>Ready to get started?</h2>
          <p style={{ ...font.bodyLg, color: '#dad7ff', margin: '0 0 32px', opacity: 0.9 }}>Create your free account and take control today.</p>
          <Link to="/register" style={{ ...font.bodyLg, fontWeight: 700, backgroundColor: '#fff', color: colors.primary, textDecoration: 'none', padding: '16px 40px', borderRadius: '12px', display: 'inline-block' }}>
            Start For Free →
          </Link>
        </div>
      </section>

      <footer style={{ backgroundColor: colors.surfaceContainerLowest, borderTop: `1px solid ${colors.outlineVariant}`, padding: '32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ ...font.headlineMd, color: colors.primary }}>Monevo</span>
        <span style={{ ...font.bodySm, color: colors.onSurfaceVariant }}>© 2026 Monevo. All rights reserved.</span>
      </footer>
    </div>
  )
}
