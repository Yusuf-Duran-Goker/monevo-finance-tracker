# FinTrack — Gelir & Gider Takip Uygulaması

Kişisel finans yönetimi için geliştirilmiş full-stack web uygulaması. Gelir ve giderlerinizi takip edin, bütçe belirleyin ve harcamalarınızı grafiklerle analiz edin.

---

## Özellikler

- Kullanıcı kaydı ve girişi (JWT kimlik doğrulama)
- Gelir ve gider işlemi ekleme, düzenleme, silme
- Kategori yönetimi (varsayılan + özel kategoriler)
- Aylık bütçe belirleme ve takibi
- Dashboard: bakiye özeti, aylık bar grafik, kategori pasta grafiği
- Tamamen local çalışır, internet gerekmez

---

## Teknoloji Stack

### Backend
| Teknoloji | Kullanım |
|-----------|----------|
| Node.js | Sunucu ortamı |
| Express.js | REST API framework |
| SQLite (better-sqlite3) | Veritabanı |
| JWT (jsonwebtoken) | Kimlik doğrulama |
| bcryptjs | Şifre hashleme |
| express-validator | İstek doğrulama |

### Frontend
| Teknoloji | Kullanım |
|-----------|----------|
| React | UI framework |
| Vite | Build tool |
| Tailwind CSS | Stil |
| React Router | Sayfa yönlendirme |
| Axios | HTTP istemcisi |
| Recharts | Grafik bileşenleri |

---

## Kurulum ve Çalıştırma

### Gereksinimler
- Node.js v18+

### 1. Projeyi klonlayın
```bash
git clone <repo-url>
cd smart-finance-tracker
```

### 2. Backend kurulumu
```bash
cd backend
npm install
npm run dev
```
Backend `http://localhost:5000` adresinde çalışır.  
SQLite veritabanı (`fintrack.db`) otomatik oluşturulur.

### 3. Frontend kurulumu (yeni terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:5173` adresinde çalışır.

### 4. Tarayıcıda açın
```
http://localhost:5173
```

---

## API Endpoint'leri

### Auth
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | /api/auth/register | Kayıt ol |
| POST | /api/auth/login | Giriş yap |
| GET | /api/auth/me | Profil bilgisi |

### İşlemler (token gerekli)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/transactions | İşlemleri listele |
| POST | /api/transactions | İşlem ekle |
| PUT | /api/transactions/:id | İşlem güncelle |
| DELETE | /api/transactions/:id | İşlem sil |

### Kategoriler (token gerekli)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/categories | Kategorileri listele |
| POST | /api/categories | Kategori ekle |
| DELETE | /api/categories/:id | Kategori sil |

### Bütçe (token gerekli)
| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/budgets | Bütçeleri listele |
| POST | /api/budgets | Bütçe ekle/güncelle |
| GET | /api/budgets/summary | Bütçe özeti |
| DELETE | /api/budgets/:id | Bütçe sil |

---

## Proje Yapısı

```
smart-finance-tracker/
├── backend/
│   ├── src/
│   │   ├── config/       # Veritabanı bağlantısı
│   │   ├── controllers/  # İş mantığı
│   │   ├── middleware/   # Auth, validation, error handler
│   │   ├── models/       # Veri modelleri
│   │   ├── routes/       # API route'ları
│   │   └── server.js     # Giriş noktası
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Layout bileşeni
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Dashboard, Transactions, Categories, Budgets
│   │   ├── services/     # Axios API istemcisi
│   │   └── App.jsx       # Router yapısı
│   └── package.json
└── README.md
```

---

## Ekip & Roller

| Rol | Sorumluluk |
|-----|------------|
| Project Manager | Sprint yönetimi, backlog, koordinasyon |
| Backend Developer | Node.js API, veritabanı, JWT auth |
| Frontend Developer | React arayüzü, Recharts grafikleri |
| QA & Dokümantasyon | Test, README, teknik dokümantasyon |

---

## Geliştirme Metodolojisi

Proje Agile/Scrum metodolojisi ile geliştirilmiştir:
- 12 haftalık sprint planı
- GitHub Projects ile backlog yönetimi
- Feature branch stratejisi
- Haftalık commit takibi
