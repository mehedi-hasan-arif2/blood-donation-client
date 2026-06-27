# 🩸 BloodFlow - Community Blood Donation Platform

BloodFlow is a full-stack MERN application that connects blood donors with recipients through a secure and user-friendly platform. The application provides role-based dashboards, blood donation request management, donor search, and Stripe-powered funding to support community blood donation activities.

## 🔗 Live Demo

- **Client:** https://flourishing-stardust-3c763a.netlify.app/

---

## 🚀 Features

- User Registration & Login with JWT Authentication
- Role-Based Dashboard (Admin, Donor, Volunteer)
- Blood Donation Request Management
- Search Donors by Blood Group, District & Upazila
- Profile Update System
- Admin User Management (Role & Status Control)
- Volunteer Donation Request Management
- Secure Stripe Payment Integration
- Responsive Design for Mobile, Tablet & Desktop
- Protected Routes & Secure API Access
- Pagination for Users, Requests and Funding History

---

## 🛠️ Technology Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- DaisyUI
- TanStack React Query
- Axios
- React Hook Form
- Framer Motion
- React Hot Toast
- Lucide React
- Stripe React SDK

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs
- Stripe API

---

## 📦 Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Dependencies

Client

```bash
npm install
```

Server

```bash
npm install
```

---

## ⚙️ Environment Variables

### Client (.env)

```env
VITE_API_URL=
VITE_IMGBB_API_KEY=
VITE_STRIPE_PK=

VITE_apiKey=
VITE_authDomain=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
```

### Server (.env)

```env
PORT=
MONGO_URI=
ACCESS_TOKEN_SECRET=
STRIPE_SECRET_KEY=
```

---

## ▶️ Run Locally

### Client

```bash
npm run dev
```

### Server

```bash
npm start
```

---

## 🔐 User Roles

### 👤 Donor

- Register and Login
- Create Donation Request
- Manage Own Requests
- Update Profile
- Donate through Funding System
- Search Blood Donors

### 🤝 Volunteer

- All Donor Features
- Manage Donation Requests
- Update Donation Status

### 👑 Admin

- All Volunteer Features
- Manage Users
- Change User Roles
- Block / Unblock Users
- View Dashboard Statistics

---

## 💳 Stripe Test Payment

Use the following test card to verify the payment system.

| Field | Value |
|-------|-------|
| Card Number | **4242 4242 4242 4242** |
| Expiry Date | **Any future date** |
| CVC | **Any 3 digits** |
| ZIP Code | **Any 5 digits** |

---

## 📁 Project Structure

```
client/
server/
```

---

## 🔒 Security

- JWT Authentication
- Password Hashing using bcryptjs
- Environment Variables for Sensitive Credentials
- Protected API Routes
- Role-Based Authorization
- Secure Stripe Payment Processing

---

## 👨‍💻 Developed By

**Mehedi Hasan Arif**

Full Stack MERN Developer

---
