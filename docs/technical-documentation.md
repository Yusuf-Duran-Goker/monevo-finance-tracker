# Teknik Dokümantasyon — FinTrack

## 1. Sistem Mimarisi

FinTrack, klasik istemci-sunucu (client-server) mimarisi üzerine kurulmuştur.

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────┐
│                 │  HTTP   │                 │  SQL    │             │
│  React Frontend │ ──────► │  Express API    │ ──────► │  SQLite DB  │
│  (port 5173)    │         │  (port 5000)    │         │  fintrack.db│
└─────────────────┘         └─────────────────┘         └─────────────┘
```

**Frontend** → Kullanıcı arayüzü, React ile geliştirilmiş SPA (Single Page Application).  
**Backend** → REST API, Express.js ile geliştirilmiş.  
**Veritabanı** → SQLite, dosya tabanlı ilişkisel veritabanı.

---

## 2. Veri Modeli

### users
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | INTEGER PK | Otomatik artan kimlik |
| name | TEXT | Kullanıcı adı |
| email | TEXT UNIQUE | E-posta (benzersiz) |
| password | TEXT | bcrypt ile hashlenmiş şifre |
| created_at | DATETIME | Kayıt tarihi |

### categories
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | INTEGER PK | Otomatik artan kimlik |
| user_id | INTEGER | Kullanıcı ID (null = varsayılan) |
| name | TEXT | Kategori adı |
| type | TEXT | income / expense / both |
| is_default | INTEGER | 1 = varsayılan kategori |

### transactions
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | INTEGER PK | Otomatik artan kimlik |
| user_id | INTEGER FK | Kullanıcı ID |
| type | TEXT | income veya expense |
| amount | REAL | Tutar |
| category | TEXT | Kategori adı |
| description | TEXT | Açıklama (opsiyonel) |
| date | TEXT | İşlem tarihi (YYYY-MM-DD) |
| created_at | DATETIME | Oluşturma tarihi |

### budgets
| Alan | Tip | Açıklama |
|------|-----|----------|
| id | INTEGER PK | Otomatik artan kimlik |
| user_id | INTEGER FK | Kullanıcı ID |
| category_id | INTEGER FK | Kategori ID |
| amount | REAL | Bütçe limiti |
| month | INTEGER | Ay (1-12) |
| year | INTEGER | Yıl |

---

## 3. Kimlik Doğrulama

JWT (JSON Web Token) tabanlı stateless kimlik doğrulama kullanılmaktadır.

**Akış:**
1. Kullanıcı `/api/auth/register` veya `/api/auth/login` endpoint'ine istek atar
2. Sunucu JWT token üretir (7 gün geçerli)
3. Token frontend'de `localStorage`'a kaydedilir
4. Korumalı endpoint'lere isteklerde `Authorization: Bearer <token>` header'ı gönderilir
5. Sunucu token'ı doğrular, kullanıcıyı tanımlar

**Şifre güvenliği:** bcryptjs ile 12 salt round hash.

---

## 4. API Tasarımı

REST mimarisi uygulanmıştır:
- `GET` → Veri okuma
- `POST` → Yeni kayıt
- `PUT` → Güncelleme
- `DELETE` → Silme

Tüm yanıtlar JSON formatındadır. Hata durumlarında uygun HTTP status kodu döner (400, 401, 404, 500).

---

## 5. Frontend Mimarisi

### Sayfa Yapısı
```
App.jsx (Router)
├── /login        → Login.jsx
├── /register     → Register.jsx
├── /             → Dashboard.jsx (PrivateRoute)
├── /transactions → Transactions.jsx (PrivateRoute)
├── /categories   → Categories.jsx (PrivateRoute)
└── /budgets      → Budgets.jsx (PrivateRoute)
```

### State Yönetimi
Global auth state `AuthContext` ile yönetilir. Sayfa bazlı state React `useState` hook'u ile tutulur.

### API İletişimi
`src/services/api.js` — merkezi Axios instance. Token otomatik olarak her isteğe eklenir. 401 yanıtında kullanıcı login sayfasına yönlendirilir.

---

## 6. Kullanılan Teknolojiler

### Backend Bağımlılıkları
| Paket | Versiyon | Kullanım |
|-------|----------|----------|
| express | ^5.2.1 | Web framework |
| better-sqlite3 | ^9.x | SQLite veritabanı |
| jsonwebtoken | ^9.0.3 | JWT auth |
| bcryptjs | ^3.0.3 | Şifre hashleme |
| cors | ^2.8.6 | Cross-origin ayarı |
| helmet | ^8.1.0 | HTTP güvenlik header'ları |
| morgan | ^1.10.1 | HTTP istek loglama |
| express-validator | ^7.3.2 | İstek validasyonu |
| dotenv | ^17.4.2 | Ortam değişkenleri |

### Frontend Bağımlılıkları
| Paket | Versiyon | Kullanım |
|-------|----------|----------|
| react | ^19.x | UI framework |
| react-router-dom | ^7.x | Sayfa yönlendirme |
| axios | ^1.x | HTTP istemcisi |
| recharts | ^2.x | Grafik bileşenleri |
| tailwindcss | ^4.x | CSS framework |
