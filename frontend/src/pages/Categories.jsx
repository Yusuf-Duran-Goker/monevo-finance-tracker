import { useState, useEffect } from 'react'
import api from '../services/api'

const C = {
  primary: '#3525cd',
  onPrimary: '#ffffff',
  primaryFixed: '#e2dfff',
  primaryContainer: '#4f46e5',
  onPrimaryContainer: '#dad7ff',
  secondary: '#006c49',
  secondaryContainer: '#6cf8bb',
  onSecondaryContainer: '#00714d',
  tertiary: '#95002b',
  tertiaryContainer: '#bf0f3c',
  onTertiaryContainer: '#ffd0d2',
  surface: '#f9f9ff',
  surfaceLowest: '#ffffff',
  surfaceLow: '#f0f3ff',
  surfaceContainer: '#e7eefe',
  surfaceHigh: '#e2e8f8',
  onSurface: '#151c27',
  onSurfaceVariant: '#464555',
  outline: '#777587',
  outlineVariant: '#c7c4d8',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
}

const categoryIconMap = {
  food: 'restaurant',
  transport: 'directions_car',
  housing: 'home',
  health: 'medical_services',
  entertainment: 'theater_comedy',
  shopping: 'shopping_bag',
  salary: 'payments',
  other: 'pending',
  education: 'school',
  travel: 'flight',
  utilities: 'bolt',
  savings: 'savings',
}

function getCategoryIcon(name) {
  const key = name.toLowerCase()
  return categoryIconMap[key] || 'category'
}

function CategoryCard({ cat, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [deleteHovered, setDeleteHovered] = useState(false)

  const badgeStyle = cat.type === 'expense'
    ? { background: C.tertiaryContainer, color: C.onTertiaryContainer }
    : cat.type === 'income'
      ? { background: C.secondaryContainer, color: C.onSecondaryContainer }
      : { background: C.surfaceHigh, color: C.onSurfaceVariant }

  const badgeLabel = cat.type === 'expense' ? 'Expense' : cat.type === 'income' ? 'Income' : 'Income & Expense'

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surfaceLowest,
        border: `1px solid ${hovered ? C.primary : C.outlineVariant}`,
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '140px',
        transition: 'border-color 0.15s',
        cursor: 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: C.surfaceContainer, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.primary,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>{getCategoryIcon(cat.name)}</span>
        </div>
        {!cat.isDefault && (
          <button
            onClick={() => onDelete(cat._id)}
            onMouseEnter={() => setDeleteHovered(true)}
            onMouseLeave={() => setDeleteHovered(false)}
            style={{
              border: 'none', background: deleteHovered ? C.errorContainer : 'transparent',
              color: deleteHovered ? C.error : C.onSurfaceVariant,
              cursor: 'pointer', padding: '8px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', transition: 'background 0.15s, color 0.15s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
          </button>
        )}
        {cat.isDefault && <div style={{ width: '36px' }} />}
      </div>
      <div>
        <h4 style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 600, color: C.onSurface, margin: 0, marginBottom: '8px' }}>{cat.name}</h4>
        <span style={{
          display: 'inline-block', padding: '2px 10px', borderRadius: '9999px',
          fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em',
          ...badgeStyle,
        }}>{badgeLabel}</span>
      </div>
    </div>
  )
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'expense' })
  const [submitting, setSubmitting] = useState(false)

  const load = () => {
    api.get('/api/categories').then(({ data }) => {
      setCategories(data)
      setLoading(false)
    })
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/categories', form)
      setForm({ name: '', type: 'expense' })
      setShowModal(false)
      load()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return
    await api.delete(`/api/categories/${id}`)
    load()
  }

  if (loading) return (
    <div style={{ padding: '40px', color: C.onSurfaceVariant, textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>
      Loading...
    </div>
  )

  const expenseCategories = categories.filter(c => c.type === 'expense')
  const incomeCategories = categories.filter(c => c.type === 'income')
  const bothCategories = categories.filter(c => c.type === 'both')

  const inputBase = {
    width: '100%', height: '48px', border: `1px solid ${C.outlineVariant}`,
    borderRadius: '12px', fontSize: '16px', fontFamily: "'Inter', sans-serif",
    color: C.onSurface, background: C.surfaceLowest, outline: 'none',
    padding: '0 16px', boxSizing: 'border-box', transition: 'border-color 0.15s',
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.surface, minHeight: '100vh' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: C.surfaceLowest, borderBottom: `1px solid ${C.outlineVariant}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: C.onSurface, margin: 0 }}>
            Categories
          </h2>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: C.primary, color: C.onPrimary,
              border: 'none', borderRadius: '12px', padding: '0 24px', height: '48px',
              fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
              cursor: 'pointer', transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
            Add Category
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

          {expenseCategories.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '32px', background: C.tertiary, borderRadius: '9999px' }} />
                <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onSurface, margin: 0 }}>Expenses</h3>
                <span style={{
                  background: C.tertiaryContainer, color: C.onTertiaryContainer,
                  padding: '4px 12px', borderRadius: '9999px',
                  fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em',
                }}>Most Active</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {expenseCategories.map(cat => (
                  <CategoryCard key={cat._id} cat={cat} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

          {incomeCategories.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '32px', background: C.secondary, borderRadius: '9999px' }} />
                <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onSurface, margin: 0 }}>Income</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {incomeCategories.map(cat => (
                  <CategoryCard key={cat._id} cat={cat} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

          {bothCategories.length > 0 && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '32px', background: C.outline, borderRadius: '9999px' }} />
                <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onSurface, margin: 0 }}>Shared Categories</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                {bothCategories.map(cat => (
                  <CategoryCard key={cat._id} cat={cat} onDelete={handleDelete} />
                ))}
              </div>
            </section>
          )}

        </div>

        <div style={{ marginTop: '48px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div style={{
            background: C.primaryContainer, color: C.onPrimaryContainer,
            borderRadius: '12px', padding: '32px', display: 'flex', alignItems: 'center',
            gap: '32px', overflow: 'hidden', position: 'relative',
          }}>
            <div style={{ flex: 1, zIndex: 1 }}>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '28px', fontWeight: 600, color: C.onPrimaryContainer, margin: '0 0 12px 0', lineHeight: '36px' }}>
                Master your spending with smart sub-categories.
              </h3>
              <p style={{ fontSize: '16px', color: C.onPrimaryContainer, opacity: 0.9, margin: '0 0 20px 0', lineHeight: '24px' }}>
                Unlock premium to organize "Food" into "Groceries", "Dining Out", and "Delivery" for hyper-precise tracking.
              </p>
              <button style={{
                background: C.surfaceLowest, color: C.primary,
                border: 'none', borderRadius: '12px', padding: '0 32px', height: '48px',
                fontSize: '16px', fontWeight: 700, fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
              }}>
                Try Monevo Pro
              </button>
            </div>
            <div style={{ width: '200px', height: '160px', borderRadius: '8px', overflow: 'hidden', border: `2px solid rgba(218,215,255,0.2)`, flexShrink: 0 }}>
              <img
                alt="Financial analytics dashboard"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDw7uRMfsCfBoYmcRHzDmbg3WjSA-H206TeVpEcc6TBBUUIHfr0tYq09Ar-uTEmX3OQZGKJCRl8WILN_BvE9PJe9ickOVJ1zTc6ecIwoxwDCW6NX_1esAaonepnVKqnTWyvuSAogU_OY7hFT3voBbymrE59hWa2KSbg_yta5dkyHgkHhNCdY_UitPAbOjNd9eql-NA30ZHTbRdSKuP9u-NPjb9KeHnM5pKQegM5DM5sAeHX8EdX94Gi1rtghiwG1pg9RV5oko9SZOY"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          <div style={{
            background: C.surfaceContainer, borderRadius: '12px', padding: '32px',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px',
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '9999px',
              background: C.primaryFixed, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: C.primary,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>auto_awesome</span>
            </div>
            <h4 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onSurface, margin: 0 }}>Auto-Categorization</h4>
            <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0, lineHeight: '20px' }}>
              Our AI learns from your habits to automatically assign transactions to these categories with 99% accuracy.
            </p>
          </div>
        </div>

        <footer style={{ marginTop: '48px', borderTop: `1px solid ${C.outlineVariant}`, paddingTop: '32px', paddingBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: C.primary, margin: 0 }}>Monevo</p>
              <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: '4px 0 0 0' }}>© 2024 Monevo. All rights reserved.</p>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              {['Privacy Policy', 'Terms of Service', 'Help Center'].map(t => (
                <a key={t} href="#" style={{ fontSize: '14px', color: C.onSurfaceVariant, textDecoration: 'none' }}>{t}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(21,28,39,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div style={{
            background: C.surfaceLowest, borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: C.onSurface, margin: 0 }}>Add Category</h3>
              <button onClick={() => setShowModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px', color: C.onSurfaceVariant }}>
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, marginBottom: '8px' }}>
                  Category Name
                </label>
                <input
                  type="text" required placeholder="e.g. Groceries"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  style={inputBase}
                  onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                  onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, marginBottom: '8px' }}>
                  Type
                </label>
                <select
                  value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  style={{ ...inputBase, cursor: 'pointer' }}
                  onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                  onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="both">Both (Income & Expense)</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, height: '48px', background: 'transparent', color: C.onSurfaceVariant,
                    border: `1px solid ${C.outlineVariant}`, borderRadius: '12px',
                    fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: 'pointer',
                  }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{
                    flex: 1, height: '48px', background: C.primary, color: C.onPrimary,
                    border: 'none', borderRadius: '12px',
                    fontSize: '16px', fontWeight: 700, fontFamily: "'Inter', sans-serif",
                    cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1,
                  }}>
                  {submitting ? 'Adding...' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
