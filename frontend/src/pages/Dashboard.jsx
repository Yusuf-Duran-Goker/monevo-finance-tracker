import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const C = {
  primary: '#3525cd',
  primaryFixed: '#e2dfff',
  onPrimary: '#ffffff',
  secondary: '#006c49',
  secondaryContainer: '#6cf8bb',
  onSecondaryContainer: '#00714d',
  tertiary: '#95002b',
  tertiaryContainer: '#bf0f3c',
  tertiaryFixed: '#ffdadb',
  onTertiaryFixedVariant: '#92002a',
  surface: '#f9f9ff',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f0f3ff',
  surfaceContainer: '#e7eefe',
  surfaceHigh: '#e2e8f8',
  onSurface: '#151c27',
  onSurfaceVariant: '#464555',
  outlineVariant: '#c7c4d8',
  outline: '#777587',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
}

const CHART_COLORS = [C.primary, C.secondary, C.tertiaryContainer, '#006e1c', '#6750a4', '#7c5800']

const fmt = (v) => '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2 })

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: C.surfaceLowest, border: `1px solid ${C.outlineVariant}`, borderRadius: '12px', padding: '10px 14px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontFamily: "'Inter', sans-serif" }}>
      <p style={{ fontSize: '13px', fontWeight: 700, color: C.onSurface, marginBottom: '6px' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ fontSize: '13px', color: p.fill, fontWeight: 600 }}>{p.name}: ${p.value.toLocaleString()}</p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/transactions').then(({ data }) => { setTransactions(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = totalIncome - totalExpense

  const monthlyData = (() => {
    const map = {}
    transactions.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      if (!map[key]) map[key] = { name: label, Income: 0, Expenses: 0 }
      if (t.type === 'income') map[key].Income += t.amount
      else map[key].Expenses += t.amount
    })
    return Object.values(map).slice(-6)
  })()

  const categoryData = (() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount })
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  })()

  const recent = [...transactions].slice(0, 5)
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) return (
    <div style={{ padding: '40px', color: C.onSurfaceVariant, textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>Loading...</div>
  )

  return (
    <div style={{ padding: '28px 24px', fontFamily: "'Inter', sans-serif", minHeight: '100vh', background: C.surface, boxSizing: 'border-box', width: '100%' }}>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '32px', fontWeight: 700, color: C.onSurface, letterSpacing: '-0.01em', marginBottom: '4px' }}>
            Good morning, {user?.name?.split(' ')[0]}
          </h2>
          <p style={{ fontSize: '16px', color: C.onSurfaceVariant }}>{dateStr}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {['search', 'notifications'].map(icon => (
            <button key={icon} style={{
              width: '48px', height: '48px', borderRadius: '50%',
              border: `1px solid ${C.outlineVariant}`, background: C.surfaceLowest,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
              onMouseLeave={e => e.currentTarget.style.background = C.surfaceLowest}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px', color: C.onSurfaceVariant }}>{icon}</span>
            </button>
          ))}
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: C.primaryFixed, border: `2px solid ${C.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: C.primary }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          {
            label: 'Net Balance', value: balance, icon: 'account_balance',
            iconBg: C.primaryFixed, iconColor: C.primary,
            badge: { text: balance >= 0 ? 'Positive' : 'Negative', bg: `${C.secondaryContainer}33`, color: C.secondary },
            hoverBorder: C.primary,
          },
          {
            label: 'Total Income', value: totalIncome, icon: 'payments',
            iconBg: `${C.secondaryContainer}55`, iconColor: C.onSecondaryContainer,
            badge: { text: `${transactions.filter(t => t.type === 'income').length} entries`, bg: `${C.secondaryContainer}33`, color: C.secondary },
            hoverBorder: C.secondary,
          },
          {
            label: 'Total Expenses', value: totalExpense, icon: 'shopping_cart',
            iconBg: C.errorContainer, iconColor: C.onErrorContainer,
            badge: { text: `${transactions.filter(t => t.type === 'expense').length} entries`, bg: `${C.errorContainer}99`, color: C.error },
            hoverBorder: C.tertiary,
          },
        ].map((card) => (
          <div key={card.label}
            style={{ background: C.surfaceLowest, padding: '24px', borderRadius: '12px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.2s', cursor: 'default' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = card.hoverBorder}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.outlineVariant}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: card.iconColor }}>{card.icon}</span>
              </div>
              <span style={{ background: card.badge.bg, color: card.badge.color, fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px' }}>
                {card.badge.text}
              </span>
            </div>
            <div>
              <p style={{ fontSize: '14px', color: C.onSurfaceVariant, marginBottom: '4px' }}>{card.label}</p>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onSurface, margin: 0 }}>{fmt(card.value)}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>

        <div style={{ background: C.surfaceLowest, borderRadius: '12px', padding: '24px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h4 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: C.onSurface, margin: 0 }}>Income vs Expenses</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[[C.primary, 'Income'], [C.tertiaryContainer, 'Expenses']].map(([col, lbl]) => (
                <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col }} />
                  <span style={{ fontSize: '12px', color: C.onSurfaceVariant, fontWeight: 600 }}>{lbl}</span>
                </div>
              ))}
            </div>
          </div>
          {monthlyData.length === 0 ? (
            <div style={{ height: '256px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: C.onSurfaceVariant, fontSize: '14px' }}>No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.outlineVariant} vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: C.onSurfaceVariant, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: C.onSurfaceVariant, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: C.surfaceLow }} />
                <Bar dataKey="Income" fill={C.primary} radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="Expenses" fill={C.tertiaryContainer} radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={{ background: C.surfaceLowest, borderRadius: '12px', padding: '24px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <h4 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: C.onSurface, marginBottom: '24px' }}>Expense Breakdown</h4>
          {categoryData.length === 0 ? (
            <div style={{ height: '192px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: C.onSurfaceVariant, fontSize: '14px' }}>No expenses yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={192}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={44} paddingAngle={3}>
                    {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} contentStyle={{ borderRadius: '12px', border: `1px solid ${C.outlineVariant}`, fontFamily: 'Inter' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                {categoryData.slice(0, 3).map((cat, i) => (
                  <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0, display: 'inline-block' }} />
                      <span style={{ fontSize: '14px', color: C.onSurfaceVariant }}>{cat.name}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: C.onSurface }}>${cat.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <section style={{ background: C.surfaceLowest, borderRadius: '12px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: 600, color: C.onSurface, margin: 0 }}>Recent Transactions</h4>
          <Link to="/transactions" style={{ color: C.primary, fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>

        {recent.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: C.onSurfaceVariant, fontSize: '14px', marginBottom: '12px' }}>No transactions yet</p>
            <Link to="/transactions" style={{ fontSize: '14px', fontWeight: 700, color: C.primary, textDecoration: 'none' }}>Add your first transaction →</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: C.surfaceLow }}>
                  {[['Merchant', 'left'], ['Category', 'left'], ['Date', 'left'], ['Amount', 'right']].map(([h, align]) => (
                    <th key={h} style={{ padding: '12px 24px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, textAlign: align }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recent.map((t) => (
                  <tr key={t._id}
                    style={{ borderTop: `1px solid ${C.outlineVariant}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: C.surfaceHigh, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: t.type === 'income' ? C.secondary : C.primary }}>
                            {t.type === 'income' ? 'payments' : 'shopping_cart'}
                          </span>
                        </div>
                        <div>
                          <p style={{ fontSize: '16px', fontWeight: 600, color: C.onSurface, margin: 0 }}>{t.description || t.category}</p>
                          <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0 }}>{t.category}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                        background: t.type === 'income' ? C.primaryFixed : C.surfaceContainer,
                        color: t.type === 'income' ? C.primary : C.onSurfaceVariant,
                      }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: C.onSurfaceVariant }}>
                      {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '16px', fontWeight: 700, color: t.type === 'income' ? C.secondary : C.error }}>
                      {t.type === 'income' ? '+' : '-'}{fmt(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
