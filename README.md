# 🌐 SubHub

**SubHub** is a full-stack **Subscription Management Web App** built with  
**React (Vite)** for the frontend, **Node.js + Express.js** for the backend, and **MongoDB** for persistent storage.

It helps users **track, organize, and analyze** all their subscriptions in one place — from Netflix and Spotify to free developer services like GitHub.  
The platform automatically updates subscription statuses, calculates analytics, and even supports **Free-to-Paid plan upgrades**.

---

## 🧱 Project Overview

| Feature | Description |
|----------|-------------|
| 🧾 **Subscription Tracking** | Add, edit, or delete subscriptions with details like cost, category, billing cycle, and next payment date. |
| 💰 **Analytics Dashboard** | Visual breakdown of monthly spending, savings potential, and subscription categories. |
| 🔁 **Auto-Status Update** | Automatically marks subscriptions *Inactive* if due date passes, *Active* if current, and keeps *Free* ones always active. |
| 🔼 **Upgrade System** | Users can upgrade free subscriptions (like GitHub/LeetCode) to paid plans with one click. |
| ⚙️ **Reminder Scheduling** | Automated daily job checks due dates and sends reminders (Mailtrap integration). |
| 🔒 **Authentication** | Secure login & registration using JWT tokens. |
| 🧠 **Modern UI/UX** | Responsive, clean dashboard built with React + CSS modules. |

---

## 🧩 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- Recharts
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JSON Web Tokens (JWT)
- Nodemailer (Mailtrap for test emails)
- Node-Cron (automated reminders)

### Tools
- VS Code
- GitHub Desktop
- MongoDB Compass
- Postman (API testing)

---

## 🗂️ Folder Structure

```

SubHub/
├── subhub-frontend/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Navbar, SubscriptionRow, Charts
│   │   ├── pages/             # Dashboard, Analytics, Profile, etc.
│   │   └── services/          # Axios API configuration
│   └── package.json
│
├── subhub-backend/            # Node.js + Express backend
│   ├── controllers/           # Business logic (auth, subscriptions, analytics)
│   ├── middleware/            # JWT auth middleware
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API routes
│   ├── utils/                 # Email + Cron jobs
│   └── server.js              # App entry point
│
├── LICENSE
├── README.md
└── .gitignore

````

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Aakash-Desai-0103/SubHub.git
cd SubHub
````

---

### 2️⃣ Backend setup

```bash
cd subhub-backend
npm install
```

Create a `.env` file inside **subhub-backend/**:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/SubHubDB
JWT_SECRET=your-secret-key
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-user
EMAIL_PASS=your-mailtrap-pass
```

Then start the backend:

```bash
npm run dev
```

✅ Server runs at → [http://localhost:5000](http://localhost:5000)

---

### 3️⃣ Frontend setup

```bash
cd ../subhub-frontend
npm install
npm run dev
```

✅ Frontend runs at → [http://localhost:5173](http://localhost:5173)

---

## 👥 Team Members

| Name                            | SRN           | Role                 |
| ------------------------------- | ------------- | -------------------- |
| Aakash Desai                    | PES1UG24CS006 | Frontend Lead        |
| Aarush Muralidhara              | PES1UG24CS010 | Backend Developer    |
| Abhay Balakrishna Doddaballapur | PES1UG24CS012 | Database & Analytics |

---

## 📊 Demo Instructions

1. Login or register a new user.
2. Add a few sample subscriptions (Netflix, Spotify, GitHub).
3. Watch the dashboard auto-categorize and compute analytics.
4. Use the **Upgrade** button on a free plan to test *Free → Paid* conversion.
5. Observe updated cost, billing cycle, and analytics recalculation.

---

## 📝 License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE) for details.

---

⭐ **If you like this project, give it a star!**
🧑‍💻 *Made with ❤️ by Team SubHub*
