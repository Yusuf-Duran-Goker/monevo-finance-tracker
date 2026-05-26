import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const C = {
  primary: '#3525cd',
  primaryFixed: '#e2dfff',
  onPrimary: '#ffffff',
  secondary: '#006c49',
  secondaryContainer: '#6cf8bb',
  onSecondaryContainer: '#00714d',
  tertiary: '#95002b',
  tertiaryContainer: '#bf0f3c',
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

const EMPTY_FORM = { type: 'expense', amount: '', category: '', description: '', date: new Date().toISOString().split('T')[0] }

function Icon({ name, size = 20, color }) {
  return <span className="material-symbols-outlined" style={{ fontSize: size, color, lineHeight: 1, flexShrink: 0 }}>{name}</span>
}

const inputCls = {
  width: '100%', height: '48px', border: `1px solid ${C.outlineVariant}`,
  borderRadius: '12px', padding: '0 16px', fontSize: '16px',
  background: C.surface, color: C.onSurface, outline: 'none',
  fontFamily: "'Inter', sans-serif", boxSizing: 'border-box',
  transition: 'border-color 0.15s, box-shadow 0.15s',
}

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [catFilter, setCatFilter] = useState('all')
  const [showScan, setShowScan] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState([])
  const [scanError, setScanError] = useState('')
  const [saving, setSaving] = useState(false)
  const fileRef = useRef(null)

  const load = () => {
    Promise.all([api.get('/api/transactions'), api.get('/api/categories')]).then(([t, c]) => {
      setTransactions(t.data); setCategories(c.data); setLoading(false)
    })
  }
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, amount: Number(form.amount) }
    if (editId) await api.put(`/api/transactions/${editId}`, payload)
    else await api.post('/api/transactions', payload)
    setForm(EMPTY_FORM); setShowForm(false); setEditId(null); load()
  }

  const handleEdit = (t) => {
    setForm({ type: t.type, amount: t.amount, category: t.category, description: t.description || '', date: t.date.split('T')[0] })
    setEditId(t._id); setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await api.delete(`/api/transactions/${id}`); load()
  }

  const handleScanFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setScanning(true); setScanError(''); setScanned([])
    const formData = new FormData()
    formData.append('file', file)
    try {
      const { data } = await api.post('/api/scan', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      if (!data.transactions?.length) { setScanError('No transactions found in this file.'); setScanning(false); return }
      setScanned(data.transactions.map((t, i) => ({ ...t, _tempId: i, selected: true })))
    } catch (err) {
      setScanError(err.response?.data?.message || 'Scan failed. Please try again.')
    }
    setScanning(false); e.target.value = ''
  }

  const handleSaveScanned = async () => {
    const toSave = scanned.filter(t => t.selected)
    if (!toSave.length) return
    setSaving(true)
    for (const t of toSave) {
      await api.post('/api/transactions', { type: t.type, amount: Number(t.amount), category: t.category, description: t.description, date: t.date })
    }
    setSaving(false); setShowScan(false); setScanned([]); load()
  }

  const filtered = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => catFilter === 'all' || t.category === catFilter)

  if (loading) return <div style={{ padding: '40px', color: C.onSurfaceVariant, textAlign: 'center', fontFamily: "'Inter', sans-serif" }}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', background: C.surface, fontFamily: "'Inter', sans-serif" }}>

      <header style={{ position: 'sticky', top: 0, zIndex: 30, background: C.surfaceLowest, borderBottom: `1px solid ${C.outlineVariant}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px' }}>
          <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '24px', fontWeight: 700, color: C.onSurface, margin: 0 }}>Transactions</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => { setShowScan(true); setScanned([]); setScanError('') }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px', padding: '0 24px', border: `1px solid ${C.primary}`, borderRadius: '12px', background: C.surfaceLowest, color: C.primary, fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = C.primaryFixed}
              onMouseLeave={e => e.currentTarget.style.background = C.surfaceLowest}>
              <Icon name="document_scanner" size={20} color={C.primary} />
              Scan Receipt
            </button>
            <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM) }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px', padding: '0 24px', border: 'none', borderRadius: '12px', background: C.primary, color: C.onPrimary, fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 2px 8px rgba(53,37,205,0.25)', transition: 'opacity 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <Icon name="add" size={20} color={C.onPrimary} />
              New Transaction
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: '24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: C.surfaceHigh, padding: '4px', borderRadius: '12px', gap: '2px' }}>
            {[['all', 'All'], ['income', 'Income'], ['expense', 'Expense']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                style={{ padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: filter === val ? 600 : 500, fontFamily: "'Inter', sans-serif", background: filter === val ? C.surfaceLowest : 'transparent', color: filter === val ? C.primary : C.onSurfaceVariant, boxShadow: filter === val ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
              style={{ ...inputCls, width: '220px', paddingRight: '40px', appearance: 'none', cursor: 'pointer' }}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
            </select>
            <span className="material-symbols-outlined" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: C.onSurfaceVariant, pointerEvents: 'none' }}>expand_more</span>
          </div>
        </div>

        <div style={{ background: C.surfaceLowest, borderRadius: '12px', border: `1px solid ${C.outlineVariant}`, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: C.surfaceLow, borderBottom: `1px solid ${C.outlineVariant}` }}>
                  {[['Transaction', 'left'], ['Category', 'left'], ['Date', 'left'], ['Amount', 'right'], ['Actions', 'right']].map(([h, align]) => (
                    <th key={h} style={{ padding: '16px 24px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: C.onSurfaceVariant, textAlign: align }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '60px', textAlign: 'center', color: C.onSurfaceVariant, fontSize: '15px' }}>
                      No transactions found
                    </td>
                  </tr>
                ) : filtered.map((t) => (
                  <TransactionRow key={t._id} t={t} onEdit={handleEdit} onDelete={handleDelete} C={C} />
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: '16px 24px', background: C.surfaceLow, borderTop: `1px solid ${C.outlineVariant}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '14px', color: C.onSurfaceVariant }}>
              Showing {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(21,28,39,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => { setShowForm(false); setEditId(null) }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: C.surfaceLowest, width: '100%', maxWidth: '520px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', overflow: 'hidden' }}>

            <div style={{ padding: '24px 32px', borderBottom: `1px solid ${C.outlineVariant}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: C.onSurface, margin: 0 }}>
                {editId ? 'Edit Transaction' : 'New Transaction'}
              </h3>
              <button onClick={() => { setShowForm(false); setEditId(null) }}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onSurfaceVariant, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon name="close" size={20} color={C.onSurfaceVariant} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '4px', background: C.surfaceHigh, borderRadius: '12px', gap: '4px' }}>
                {['expense', 'income'].map(type => (
                  <button key={type} type="button" onClick={() => setForm({ ...form, type })}
                    style={{ padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '15px', fontWeight: form.type === type ? 700 : 500, fontFamily: "'Inter', sans-serif", background: form.type === type ? C.surfaceLowest : 'transparent', color: form.type === type ? C.primary : C.onSurfaceVariant, boxShadow: form.type === type ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: C.onSurfaceVariant, marginBottom: '8px' }}>Description</label>
                <input type="text" placeholder="e.g. Starbucks Coffee" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  style={inputCls}
                  onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                  onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: C.onSurfaceVariant, marginBottom: '8px' }}>Amount</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', fontWeight: 600, color: C.onSurfaceVariant }}>$</span>
                    <input type="number" required min="0.01" step="0.01" placeholder="0.00" value={form.amount}
                      onChange={e => setForm({ ...form, amount: e.target.value })}
                      style={{ ...inputCls, paddingLeft: '32px' }}
                      onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                      onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: C.onSurfaceVariant, marginBottom: '8px' }}>Date</label>
                  <input type="date" required value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                    style={inputCls}
                    onFocus={e => { e.target.style.borderColor = C.primary; e.target.style.boxShadow = `0 0 0 3px ${C.primary}22` }}
                    onBlur={e => { e.target.style.borderColor = C.outlineVariant; e.target.style.boxShadow = 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', color: C.onSurfaceVariant, marginBottom: '8px' }}>Category</label>
                <div style={{ position: 'relative' }}>
                  <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ ...inputCls, appearance: 'none', cursor: 'pointer', paddingRight: '40px' }}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                  <span className="material-symbols-outlined" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', color: C.onSurfaceVariant, pointerEvents: 'none' }}>expand_more</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null) }}
                  style={{ flex: 1, height: '48px', border: `1px solid ${C.outlineVariant}`, borderRadius: '12px', background: C.surfaceLowest, fontSize: '15px', fontWeight: 600, color: C.onSurface, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surfaceContainer}
                  onMouseLeave={e => e.currentTarget.style.background = C.surfaceLowest}>
                  Cancel
                </button>
                <button type="submit"
                  style={{ flex: 1, height: '48px', border: 'none', borderRadius: '12px', background: C.primary, color: C.onPrimary, fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", boxShadow: '0 2px 8px rgba(53,37,205,0.25)', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  {editId ? 'Update Transaction' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(21,28,39,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
          onClick={() => { setShowScan(false); setScanned([]); setScanError('') }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: C.surfaceLowest, borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontSize: '20px', fontWeight: 700, color: C.onSurface, marginBottom: '4px' }}>Scan Receipt / Statement</h2>
                <p style={{ fontSize: '14px', color: C.onSurfaceVariant }}>Upload a photo or PDF — AI will extract transactions automatically</p>
              </div>
              <button onClick={() => { setShowScan(false); setScanned([]); setScanError('') }}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon name="close" size={20} color={C.onSurfaceVariant} />
              </button>
            </div>

            {!scanned.length && (
              <div onClick={() => fileRef.current?.click()}
                style={{ border: `2px dashed ${C.outlineVariant}`, borderRadius: '16px', padding: '48px', textAlign: 'center', cursor: scanning ? 'not-allowed' : 'pointer', background: C.surfaceLow, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.primary}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.outlineVariant}>
                <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleScanFile} style={{ display: 'none' }} />
                {scanning ? (
                  <>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏳</div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: C.primary, marginBottom: '4px' }}>Analyzing with AI...</p>
                    <p style={{ fontSize: '14px', color: C.onSurfaceVariant }}>This usually takes 5–10 seconds</p>
                  </>
                ) : (
                  <>
                    <Icon name="upload_file" size={48} color={C.primary} />
                    <p style={{ fontSize: '16px', fontWeight: 700, color: C.onSurface, margin: '12px 0 6px' }}>Click to upload</p>
                    <p style={{ fontSize: '14px', color: C.onSurfaceVariant }}>JPG, PNG, WEBP or PDF · Max 10MB</p>
                  </>
                )}
              </div>
            )}

            {scanError && (
              <div style={{ background: C.errorContainer, border: `1px solid #ffb3ad`, borderRadius: '12px', padding: '12px 16px', marginTop: '16px', color: C.onErrorContainer, fontSize: '14px' }}>
                {scanError}
              </div>
            )}

            {scanned.length > 0 && (
              <>
                <p style={{ fontSize: '14px', fontWeight: 700, color: C.onSurface, marginBottom: '12px' }}>
                  Found {scanned.length} transaction{scanned.length > 1 ? 's' : ''} — select which to save:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {scanned.map((t, i) => (
                    <div key={t._tempId}
                      style={{ border: `1.5px solid ${t.selected ? C.primary : C.outlineVariant}`, borderRadius: '12px', padding: '14px 16px', background: t.selected ? C.surfaceLow : C.surfaceLowest, cursor: 'pointer', transition: 'all 0.15s' }}
                      onClick={() => setScanned(prev => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${t.selected ? C.primary : C.outlineVariant}`, background: t.selected ? C.primary : C.surfaceLowest, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {t.selected && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: 600, color: C.onSurface }}>{t.description}</span>
                        </div>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: t.type === 'income' ? C.secondary : C.tertiary }}>
                          {t.type === 'income' ? '+' : '-'}${Number(t.amount).toLocaleString()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '30px' }}>
                        <span style={{ fontSize: '12px', background: C.surfaceContainer, color: C.primary, borderRadius: '6px', padding: '2px 8px', fontWeight: 600 }}>{t.category}</span>
                        <span style={{ fontSize: '12px', color: C.onSurfaceVariant }}>{t.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button onClick={() => { setScanned([]); setScanError('') }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: C.onSurfaceVariant, fontWeight: 600 }}>← Scan another</button>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setShowScan(false); setScanned([]) }}
                      style={{ padding: '10px 20px', borderRadius: '10px', border: `1px solid ${C.outlineVariant}`, background: C.surfaceLowest, fontSize: '14px', fontWeight: 600, color: C.onSurfaceVariant, cursor: 'pointer' }}>
                      Cancel
                    </button>
                    <button onClick={handleSaveScanned} disabled={saving || !scanned.some(t => t.selected)}
                      style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: C.primary, color: C.onPrimary, fontSize: '14px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                      {saving ? 'Saving...' : `Save ${scanned.filter(t => t.selected).length} Transaction${scanned.filter(t => t.selected).length !== 1 ? 's' : ''}`}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function TransactionRow({ t, onEdit, onDelete, C }) {
  const [hovered, setHovered] = useState(false)

  const iconBg = t.type === 'income'
    ? `${C.secondaryContainer}55`
    : `${C.tertiaryContainer}22`
  const iconColor = t.type === 'income' ? C.onSecondaryContainer : C.tertiaryContainer

  return (
    <tr
      style={{ borderTop: `1px solid ${C.outlineVariant}`, background: hovered ? C.surfaceContainer : 'transparent', transition: 'background 0.1s' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: iconColor }}>
              {t.type === 'income' ? 'payments' : 'shopping_bag'}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 600, color: C.onSurface, margin: 0 }}>{t.description || t.category}</p>
            <p style={{ fontSize: '13px', color: C.onSurfaceVariant, margin: 0 }}>{t.type === 'income' ? 'Income' : 'Expense'}</p>
          </div>
        </div>
      </td>

      <td style={{ padding: '16px 24px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
          background: t.type === 'income' ? `${C.secondaryContainer}44` : C.surfaceHigh,
          color: t.type === 'income' ? C.onSecondaryContainer : C.onSurfaceVariant,
        }}>
          {t.category}
        </span>
      </td>

      <td style={{ padding: '16px 24px', fontSize: '14px', color: C.onSurfaceVariant }}>
        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>

      <td style={{ padding: '16px 24px', textAlign: 'right', fontSize: '15px', fontWeight: 700, color: t.type === 'income' ? C.secondary : C.tertiary }}>
        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </td>

      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}>
          <button onClick={() => onEdit(t)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onSurfaceVariant, transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceHigh}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit</span>
          </button>
          <button onClick={() => onDelete(t._id)}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.onSurfaceVariant, transition: 'background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.errorContainer; e.currentTarget.style.color = C.error }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.onSurfaceVariant }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
          </button>
        </div>
      </td>
    </tr>
  )
}
