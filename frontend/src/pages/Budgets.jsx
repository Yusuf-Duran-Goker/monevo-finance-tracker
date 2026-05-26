import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const C = {
  primary: '#3525cd',
  onPrimary: '#ffffff',
  primaryFixed: '#e2dfff',
  primaryContainer: '#4f46e5',
  onPrimaryContainer: '#dad7ff',
  onPrimaryFixedVariant: '#3323cc',
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
  surfaceHighest: '#dce2f3',
  onSurface: '#151c27',
  onSurfaceVariant: '#464555',
  outline: '#777587',
  outlineVariant: '#c7c4d8',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const DEFAULT_GROUPS = [
  { id: 'needs', label: 'Needs', catNames: ['Food', 'Transport', 'Housing', 'Health'] },
  { id: 'wants', label: 'Wants', catNames: ['Entertainment', 'Shopping'] },
  { id: 'other', label: 'Other', catNames: ['Other'] },
]

function loadGroups() {
  try { return JSON.parse(localStorage.getItem('budget_groups')) || DEFAULT_GROUPS } catch { return DEFAULT_GROUPS }
}
function saveGroups(g) { localStorage.setItem('budget_groups', JSON.stringify(g)) }

function getStatusBadge(b) {
  if (!b) return null
  if (b.percentage >= 100) return { label: 'Over Budget', bg: C.errorContainer, color: C.onErrorContainer }
  if (b.percentage >= 99) return { label: 'Met Target', bg: C.secondaryContainer, color: C.onSecondaryContainer }
  return { label: 'On Track', bg: C.secondaryContainer, color: C.onSecondaryContainer }
}

function BudgetRow({ cat, b, isSelected, pct, badge, isOver, onSelect, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const [deleteHovered, setDeleteHovered] = useState(false)

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '8px', margin: '-8px', borderRadius: '8px',
        borderLeft: isSelected ? `4px solid ${C.primary}` : '4px solid transparent',
        background: hovered ? C.surfaceLow : 'transparent',
        cursor: 'pointer', transition: 'background 0.1s',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
        <div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: isSelected ? C.primary : C.onSurface, margin: 0 }}>{cat.name}</p>
          <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: '2px 0 0 0' }}>
            {b
              ? `Spent: $${b.spent.toLocaleString('en-US', { minimumFractionDigits: 2 })} / $${b.budgeted.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
              : 'No target set'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {b && hovered && (
            <button
              onClick={e => { e.stopPropagation(); onDelete() }}
              onMouseEnter={() => setDeleteHovered(true)}
              onMouseLeave={() => setDeleteHovered(false)}
              style={{
                width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                background: deleteHovered ? C.errorContainer : 'transparent',
                color: deleteHovered ? C.error : C.onSurfaceVariant,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.15s, color 0.15s', flexShrink: 0,
              }}
              title="Delete budget target"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
            </button>
          )}

          {badge && (
            <span style={{
              background: badge.bg, color: badge.color,
              padding: '4px 10px', borderRadius: '9999px',
              fontSize: '12px', fontWeight: 600, letterSpacing: '0.03em', whiteSpace: 'nowrap',
            }}>{badge.label}</span>
          )}
          {isSelected && !badge && (
            <span style={{
              background: C.surfaceContainer, color: C.primary,
              padding: '4px 10px', borderRadius: '9999px',
              fontSize: '12px', fontWeight: 600,
            }}>Editing</span>
          )}
        </div>
      </div>
      <ProgressBar pct={pct} overBudget={isOver} />
    </div>
  )
}

function ProgressBar({ pct, overBudget }) {
  return (
    <div style={{ width: '100%', background: C.surfaceHighest, height: '12px', borderRadius: '9999px', overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${Math.min(pct, 100)}%`,
        background: overBudget ? C.error : C.secondary,
        borderRadius: '9999px', transition: 'width 0.4s',
      }} />
    </div>
  )
}

export default function Budgets() {
  const [summary, setSummary] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [selected, setSelected] = useState(null)
  const [targetAmount, setTargetAmount] = useState('')
  const [targetFreq, setTargetFreq] = useState('Monthly')
  const [groups, setGroups] = useState(loadGroups)
  const [showGroupPopup, setShowGroupPopup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [showAddCat, setShowAddCat] = useState(null)
  const [collapsed, setCollapsed] = useState({})
  const groupInputRef = useRef(null)

  const load = () => {
    Promise.all([
      api.get(`/api/budgets/summary?month=${month}&year=${year}`),
      api.get('/api/categories'),
    ]).then(([s, c]) => {
      setSummary(s.data)
      setCategories(c.data.filter(cat => cat.type !== 'income'))
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [month, year])
  useEffect(() => { if (showGroupPopup) groupInputRef.current?.focus() }, [showGroupPopup])

  const getBudget = (cat) => summary.find(b =>
    String(b.category._id ?? b.category) === String(cat._id) ||
    b.category.name?.toLowerCase() === cat.name?.toLowerCase()
  )

  const handleSelectCategory = (cat) => {
    setSelected(cat)
    const b = getBudget(cat)
    setTargetAmount(b ? String(b.budgeted) : '')
  }

  const handleSaveTarget = async () => {
    if (!selected || !targetAmount) return
    await api.post('/api/budgets', { category: selected._id, amount: Number(targetAmount), month, year })
    load()
  }

  const handleDeleteTarget = async () => {
    if (!selected) return
    const b = getBudget(selected)
    if (b) { try { await api.delete(`/api/budgets/${b._id}`) } catch {} }
    setSelected(null); setTargetAmount(''); load()
  }

  const handleDeleteBudget = async (b) => {
    if (!b) return
    if (!confirm('Bu bütçe hedefini silmek istediğinize emin misiniz?')) return
    try { await api.delete(`/api/budgets/${b._id}`) } catch {}
    if (selected && getBudget(selected)?._id === b._id) { setSelected(null); setTargetAmount('') }
    load()
  }

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return
    const updated = [...groups, { id: Date.now().toString(), label: newGroupName.trim(), catNames: [] }]
    setGroups(updated); saveGroups(updated); setNewGroupName(''); setShowGroupPopup(false)
  }

  const handleAddCatToGroup = (groupId, catName) => {
    const updated = groups.map(g => g.id === groupId ? { ...g, catNames: [...g.catNames, catName] } : g)
    setGroups(updated); saveGroups(updated); setShowAddCat(null)
  }

  const handleDeleteGroup = (groupId) => {
    if (!confirm('Bu grubu silmek istediğinize emin misiniz?')) return
    const updated = groups.filter(g => g.id !== groupId)
    setGroups(updated); saveGroups(updated)
  }

  const getCatsForGroup = (group) =>
    categories.filter(c => group.catNames.map(n => n.toLowerCase()).includes(c.name.toLowerCase()))

  const allGroups = groups

  if (loading) return (
    <div style={{ padding: '40px', color: C.onSurfaceVariant, textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>Loading...</div>
  )

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: C.surface, minHeight: '100vh' }}>

      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: C.surfaceLowest, borderBottom: `1px solid ${C.outlineVariant}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: C.primary, margin: 0 }}>Budget</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select value={month} onChange={e => setMonth(Number(e.target.value))}
              style={{ border: `1px solid ${C.outlineVariant}`, borderRadius: '8px', padding: '6px 10px', fontSize: '13px', background: C.surfaceLowest, cursor: 'pointer', color: C.onSurface, fontFamily: "'Inter', sans-serif", outline: 'none' }}>
              {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <input type="number" value={year} onChange={e => setYear(Number(e.target.value))}
              style={{ width: '76px', border: `1px solid ${C.outlineVariant}`, borderRadius: '8px', padding: '6px 10px', fontSize: '13px', background: C.surfaceLowest, color: C.onSurface, outline: 'none', fontFamily: "'Inter', sans-serif" }} />
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>

        <section style={{ flex: '2', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {allGroups.map((group) => {
            const groupCats = getCatsForGroup(group)
            return (
              <div key={group.id} style={{
                background: C.surfaceLowest, border: `1px solid ${C.outlineVariant}`,
                borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onSurface, margin: 0 }}>{group.label}</h3>
                  {group.id !== 'ungrouped' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '9999px',
                          border: `1px solid ${C.outlineVariant}`, background: 'transparent',
                          color: C.onSurfaceVariant, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.errorContainer; e.currentTarget.style.color = C.error; e.currentTarget.style.borderColor = C.error }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant; e.currentTarget.style.borderColor = C.outlineVariant }}
                        title="Delete group"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                      </button>

                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setShowAddCat(showAddCat === group.id ? null : group.id)}
                        style={{
                          width: '40px', height: '40px', borderRadius: '9999px',
                          border: `1px solid ${C.outlineVariant}`, background: 'transparent',
                          color: C.primary, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = C.surfaceContainer}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
                      </button>
                      {showAddCat === group.id && (
                        <div style={{
                          position: 'absolute', top: '48px', right: 0, background: C.surfaceLowest,
                          borderRadius: '12px', padding: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          zIndex: 50, minWidth: '180px', border: `1px solid ${C.outlineVariant}`,
                        }}>
                          {categories.filter(c => !group.catNames.map(n => n.toLowerCase()).includes(c.name.toLowerCase())).length === 0
                            ? <p style={{ fontSize: '13px', color: C.onSurfaceVariant, padding: '8px' }}>No categories to add</p>
                            : categories.filter(c => !group.catNames.map(n => n.toLowerCase()).includes(c.name.toLowerCase())).map(c => (
                              <button key={c._id} onClick={() => handleAddCatToGroup(group.id, c.name)}
                                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '13px', color: C.onSurface, borderRadius: '6px', fontFamily: "'Inter', sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                {c.name}
                              </button>
                            ))
                          }
                        </div>
                      )}
                    </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {groupCats.length === 0 && (
                    <p style={{ fontSize: '14px', color: C.onSurfaceVariant, textAlign: 'center', padding: '8px 0' }}>
                      No categories in this group. Click + to add.
                    </p>
                  )}
                  {groupCats.map((cat) => {
                    const b = getBudget(cat)
                    const isSelected = selected?._id === cat._id
                    const pct = b ? b.percentage : 0
                    const badge = getStatusBadge(b)
                    const isOver = b && b.percentage >= 100

                    return (
                      <BudgetRow
                        key={cat._id}
                        cat={cat}
                        b={b}
                        isSelected={isSelected}
                        pct={pct}
                        badge={badge}
                        isOver={isOver}
                        onSelect={() => handleSelectCategory(cat)}
                        onDelete={() => handleDeleteBudget(b)}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}

          <button
            onClick={() => setShowGroupPopup(true)}
            style={{
              width: '100%', padding: '16px', border: `2px dashed ${C.outlineVariant}`,
              borderRadius: '12px', background: 'transparent', color: C.onSurfaceVariant,
              fontSize: '16px', fontFamily: "'Inter', sans-serif", cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.color = C.primary }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.outlineVariant; e.currentTarget.style.color = C.onSurfaceVariant }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>create_new_folder</span>
            + Category Group
          </button>

          <footer style={{ borderTop: `1px solid ${C.outlineVariant}`, paddingTop: '32px', paddingBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <p style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '18px', fontWeight: 700, color: C.primary, margin: 0 }}>Monevo</p>
                <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: 0 }}>© 2024 Monevo. All rights reserved.</p>
              </div>
              <div style={{ display: 'flex', gap: '24px' }}>
                {['Privacy Policy', 'Terms of Service', 'Help Center'].map(t => (
                  <a key={t} href="#" style={{ fontSize: '14px', color: C.onSurfaceVariant, textDecoration: 'none' }}>{t}</a>
                ))}
              </div>
            </div>
          </footer>
        </section>

        <aside style={{ width: '360px', flexShrink: 0, position: 'sticky', top: '80px' }}>

          <div style={{ background: C.surfaceLowest, border: `1px solid ${C.outlineVariant}`, borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ background: C.primaryContainer, padding: '24px' }}>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: C.onPrimaryContainer, margin: '0 0 4px 0' }}>Target Setting</h3>
              <p style={{ fontSize: '14px', color: C.onPrimaryContainer, opacity: 0.9, margin: 0 }}>
                {selected ? <>Adjust your goals for <strong>{selected.name}</strong></> : 'Select a category to set a target'}
              </p>
            </div>

            {selected ? (
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', background: C.surfaceLow, borderRadius: '12px', padding: '4px' }}>
                  {['Weekly', 'Monthly', 'Yearly'].map(f => (
                    <button key={f} onClick={() => setTargetFreq(f)}
                      style={{
                        flex: 1, padding: '8px 0', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600, fontFamily: "'Inter', sans-serif",
                        background: targetFreq === f ? C.surfaceLowest : 'transparent',
                        color: targetFreq === f ? C.primary : C.onSurfaceVariant,
                        boxShadow: targetFreq === f ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.15s',
                      }}>
                      {f}
                    </button>
                  ))}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, marginBottom: '8px' }}>Target Amount</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', border: `1px solid ${C.outline}`, borderRadius: '12px', overflow: 'hidden' }}>
                    <span style={{ position: 'absolute', left: '16px', color: C.onSurfaceVariant, fontSize: '16px', pointerEvents: 'none' }}>$</span>
                    <input type="number" min="0" value={targetAmount} onChange={e => setTargetAmount(e.target.value)}
                      placeholder="0.00"
                      style={{ width: '100%', padding: '12px 16px 12px 32px', border: 'none', outline: 'none', fontSize: '16px', color: C.onSurface, background: C.surfaceLowest, fontFamily: "'Inter', sans-serif' " }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, marginBottom: '8px' }}>Due Date / Reset Day</label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', border: `1px solid ${C.outline}`, borderRadius: '12px' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '16px', fontSize: '20px', color: C.onSurfaceVariant, pointerEvents: 'none' }}>calendar_today</span>
                    <select style={{ width: '100%', padding: '12px 16px 12px 48px', border: 'none', outline: 'none', fontSize: '16px', color: C.onSurface, background: C.surfaceLowest, fontFamily: "'Inter', sans-serif", cursor: 'pointer', borderRadius: '12px' }}>
                      <option>Last Day of Month</option>
                      <option>15th of Month</option>
                      <option>1st of Month</option>
                    </select>
                  </div>
                </div>

                {getBudget(selected) && (() => {
                  const b = getBudget(selected)
                  return (
                    <div style={{ background: C.surfaceLow, borderRadius: '12px', padding: '16px' }}>
                      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.onSurfaceVariant, margin: '0 0 6px 0' }}>Insight</p>
                      <p style={{ fontSize: '14px', color: C.onSurface, margin: 0 }}>
                        You spent <strong>${b.spent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong> on average for this category last year.
                      </p>
                    </div>
                  )
                })()}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '8px' }}>
                  <button onClick={handleSaveTarget}
                    style={{ width: '100%', height: '48px', background: C.primary, color: C.onPrimary, border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 600, fontFamily: "'Inter', sans-serif", cursor: 'pointer', boxShadow: '0 4px 12px rgba(53,37,205,0.3)', transition: 'opacity 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    Save Target
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button onClick={() => setSelected(null)}
                      style={{ height: '48px', background: 'transparent', color: C.onSurfaceVariant, border: `1px solid ${C.outline}`, borderRadius: '12px', fontSize: '16px', fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      Cancel
                    </button>
                    <button onClick={handleDeleteTarget}
                      style={{ height: '48px', background: 'transparent', color: C.error, border: `1px solid rgba(186,26,26,0.3)`, borderRadius: '12px', fontSize: '16px', fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = C.errorContainer}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '48px', color: C.outlineVariant }}>savings</span>
                <p style={{ color: C.onSurfaceVariant, fontSize: '14px', marginTop: '12px' }}>Select a category<br />to set a target</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', background: C.surfaceHigh, borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h4 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 600, color: C.onPrimaryFixedVariant, margin: '0 0 8px 0' }}>Budget Tips</h4>
              <p style={{ fontSize: '14px', color: C.onSurfaceVariant, margin: '0 0 16px 0', lineHeight: '20px' }}>
                Try the 50/30/20 rule to balance your essential needs, lifestyle wants, and future savings automatically.
              </p>
              <a href="#" style={{ color: C.primary, fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Learn More
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
              </a>
            </div>
            <div style={{ position: 'absolute', right: '-16px', bottom: '-16px', opacity: 0.1 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '120px', color: C.onSurface }}>lightbulb</span>
            </div>
          </div>
        </aside>
      </div>

      {showGroupPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(21,28,39,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowGroupPopup(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: C.surfaceLowest, borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: C.onSurface, margin: '0 0 16px 0' }}>New Category Group</h3>
            <input ref={groupInputRef} value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddGroup()}
              placeholder="Group name (e.g. Needs, Savings)"
              style={{ width: '100%', height: '48px', border: `1px solid ${C.primary}`, borderRadius: '12px', padding: '0 16px', fontSize: '16px', color: C.onSurface, background: C.surfaceLowest, outline: 'none', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowGroupPopup(false)}
                style={{ flex: 1, height: '44px', border: `1px solid ${C.outlineVariant}`, borderRadius: '12px', background: 'transparent', fontSize: '15px', fontWeight: 600, color: C.onSurfaceVariant, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                Cancel
              </button>
              <button onClick={handleAddGroup}
                style={{ flex: 1, height: '44px', border: 'none', borderRadius: '12px', background: C.primary, color: C.onPrimary, fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
