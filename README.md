# OrdhekDeen - অর্ধেকদ্বীন 🕌
### Full Stack Bangladeshi Islamic Matrimony Platform

---

## 🗂️ Project Structure

```
ordhekdeen-fullstack/
├── frontend/               ← React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/     ← Navbar, Footer, PrivateRoute
│   │   ├── context/        ← AuthContext (global login state)
│   │   ├── pages/          ← Home, About, FAQ, Guide, Contact,
│   │   │                      Login, Dashboard, Search,
│   │   │                      CreateBiodata, BiodataDetail
│   │   └── utils/          ← api.js (axios instance with JWT)
│   └── package.json
│
├── backend/                ← Node.js + Express + MongoDB
│   ├── config/             ← db.js (MongoDB connection)
│   ├── models/             ← User, OTP, Biodata, Connection
│   ├── middleware/         ← auth.js, errorHandler.js, upload.js
│   ├── routes/             ← auth, biodata, connections, contact, admin
│   ├── uploads/            ← uploaded photos stored here
│   ├── server.js           ← Entry point
│   └── package.json
│
└── package.json            ← Root: run both together
```

---

## ⚡ Quick Start

### Step 1 — Install MongoDB
Make sure MongoDB is running locally:
- Download: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (free cloud): https://www.mongodb.com/atlas

### Step 2 — Setup Backend
```bash
cd backend
cp .env.example .env      # Copy environment file
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev               # Runs on http://localhost:5000
```

### Step 3 — Setup Frontend
```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev               # Runs on http://localhost:3000
```

### Step 4 — Run Both Together (optional)
```bash
# From root folder
npm install               # installs concurrently
npm run install:all       # installs backend + frontend deps
npm run dev               # runs both simultaneously
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ordhekdeen
JWT_SECRET=change_this_to_a_strong_random_string
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP & login/register |
| GET | `/api/auth/me` | Get current user (auth required) |

### Biodata
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/biodata` | List biodatas (with filters & pagination) |
| GET | `/api/biodata/stats` | Platform statistics |
| GET | `/api/biodata/my` | My biodata (auth required) |
| GET | `/api/biodata/:id` | Single biodata |
| POST | `/api/biodata` | Create biodata (auth required) |
| PUT | `/api/biodata/my` | Update my biodata (auth required) |
| DELETE | `/api/biodata/my` | Delete my biodata (auth required) |

### Connections
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/connections` | Send connection request |
| GET | `/api/connections/my` | My connections |
| PUT | `/api/connections/:id/accept` | Accept request |
| PUT | `/api/connections/:id/reject` | Reject request |

### Admin (admin role required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform stats |
| GET | `/api/admin/biodatas` | All biodatas |
| PUT | `/api/admin/biodatas/:id/approve` | Approve biodata |
| PUT | `/api/admin/biodatas/:id/reject` | Reject biodata |
| DELETE | `/api/admin/biodatas/:id` | Delete biodata |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id/make-admin` | Make admin |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |

---

## 👤 Creating First Admin

1. Login normally via the app (creates a user account)
2. Open MongoDB shell or Compass
3. Run:
```js
db.users.updateOne({ phone: "01XXXXXXXXX" }, { $set: { role: "admin" } })
```

---

## 📱 SMS Gateway Integration

In `backend/routes/auth.js`, replace the `sendSMS` function with your SMS provider:

### Option 1: Twilio
```bash
npm install twilio
```
```js
import twilio from 'twilio'
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
await client.messages.create({
  body: `আপনার OrdhekDeen OTP: ${otp}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: `+88${phone}`
})
```

### Option 2: SSL Commerz Bulk SMS (Bangladesh)
```js
const response = await fetch(`https://sms.sslwireless.com/pushapi/dynamic/server.php?user=USER&pass=PASS&sms=${otp}&sid=SENDER_ID&msisdn=88${phone}`)
```

---

## 🚀 Production Deployment

### Backend (VPS / DigitalOcean)
```bash
NODE_ENV=production
# Use PM2 to keep it running:
npm install -g pm2
pm2 start server.js --name ordhekdeen-api
pm2 save
```

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to Nginx or Vercel/Netlify
```

### Nginx Config (example)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api {
        proxy_pass http://localhost:5000;
    }

    location / {
        root /var/www/ordhekdeen/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS v4, React Router v7 |
| State | React Context API |
| HTTP Client | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT + OTP |
| File Upload | Multer |
| Security | Helmet, CORS, Rate Limiting |

---

> Built as a full-stack replica of ordhekdeen.com for development/learning purposes.
