# Meridian Estates — Full-Stack Real Estate Website

Ek complete real estate website: **Next.js frontend** (3D scroll hero, property listings,
filters, contact form, admin dashboard) + **Node.js/Express backend** (MongoDB, JWT auth,
CRUD API for properties and inquiries).

```
real-estate-site/
├── backend/     → Express API (Node.js + MongoDB)
└── frontend/    → Next.js website (Tailwind + GSAP 3D scroll)
```

---

## 1. Backend setup (pehle yeh karein)

Aapko ek free MongoDB database chahiye hoga. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
pe free account banayen, ek cluster create karein, aur connection string copy kar lein.

```bash
cd backend
npm install
cp .env.example .env
```

`.env` file kholein aur yeh values daal dein:

```
PORT=5000
MONGO_URI=<apka MongoDB Atlas connection string>
JWT_SECRET=<koi bhi lamba random string, e.g. "asdkj23lkj4lk2j3lk4j">
CLIENT_URL=http://localhost:3000
```

Ab sample data (1 admin user + 3 demo properties) daalne ke liye:

```bash
node seed.js
```

Yeh admin login bana dega:
- **Email:** admin@meridian.com
- **Password:** admin1234

Backend server start karein:

```bash
npm run dev
```

Server `http://localhost:5000` pe chalega. Browser mein `http://localhost:5000` khol ke
check kar lein — "Real estate API running" dikhna chahiye.

---

## 2. Frontend setup

Naye terminal tab mein:

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

`.env.local` mein backend ka URL already set hai (`http://localhost:5000/api`) — agar
backend kisi aur port pe hai to yahan update kar dein.

Website `http://localhost:3000` pe khul jayegi.

---

## 3. Kya kya bana hua hai

**Public website:**
- Homepage — 3D scroll hero (GSAP ScrollTrigger se banaya gaya, jese scroll karte waqt
  building ke floors 3D perspective mein move hote hain), featured properties section
- `/properties` — sab listings, filters ke sath (city, type, price range)
- `/properties/[id]` — property detail page + inquiry form (backend mein save hota hai)
- `/contact` — general contact form

**Admin side:**
- `/login` — agent/admin login (JWT based)
- `/admin` — properties add/edit/delete karne ka dashboard (login required)

**Backend API endpoints:**
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/properties              (filters: city, type, status, minPrice, maxPrice, bedrooms, search, page, limit)
GET    /api/properties/featured
GET    /api/properties/:id
POST   /api/properties              (admin only)
PUT    /api/properties/:id          (admin only)
DELETE /api/properties/:id          (admin only)

POST   /api/inquiries               (public — contact/inquiry forms submit yahan)
GET    /api/inquiries               (admin only)
```

---

## 4. Deployment (jab live karna ho)

- **Frontend:** [Vercel](https://vercel.com) — GitHub repo connect karein, `frontend/`
  folder ko root set karein, environment variable `NEXT_PUBLIC_API_URL` add karein
  (apke deployed backend ka URL).
- **Backend:** [Render](https://render.com) ya [Railway](https://railway.app) — free tier
  available hai. Environment variables (`.env` wali) waha bhi add karni hongi.
- **Database:** MongoDB Atlas free tier hi production ke liye bhi use kar sakte hain
  shuru mein.
- **Images:** Abhi image URLs direct save hote hain (Unsplash demo images). Real property
  photos upload karne ke liye Cloudinary account bana kar backend ke `.env` mein
  `CLOUDINARY_*` keys daal dein — `multer-storage-cloudinary` package already
  `package.json` mein shamil hai, bas ek upload route add karna hoga.

---

## 5. Customize karna ho to

- **Colors/fonts:** `frontend/tailwind.config.js` mein `charcoal`, `stone`, `brass` colors
  hain — inhe apni branding ke hisab se badal dein.
- **3D scroll effect:** `frontend/components/Hero3D.js` mein GSAP timeline hai — layers ki
  speed, rotation, aur pin duration wahan control hoti hai.
- **Logo/naam:** `Navbar.js` aur `Footer.js` mein "Meridian Estates" search kar ke apna
  business ka naam daal dein.

Agar koi step mein masla aaye to bata dein, main us specific hisse ko debug kar dunga.
