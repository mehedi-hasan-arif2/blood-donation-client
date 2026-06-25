# BloodFlow - Community Blood Donation Platform

BloodFlow is a full-stack MERN application designed to connect blood donors with those in need. Built with a focus on real-world utility, role-based access control, and efficient resource management.

## 🔗 Live Site
[https://flourishing-stardust-3c763a.netlify.app/](https://flourishing-stardust-3c763a.netlify.app/)

## 🛠 Project Implementation Workflow
To ensure a clean and scalable codebase, the development was divided into the following milestones:

1. **Environment Setup & Base UI:** Initialized Vite React project, integrated Tailwind CSS & DaisyUI, and structured the overall responsive layout.
2. **Authentication System:** Implemented user registration, login, and secure state management using JWT to handle user sessions.
3. **Database & API Integration:** Setup MongoDB/Mongoose schemas and built RESTful APIs for CRUD operations on donation requests.
4. **Role-Based Access Control:** Developed distinct dashboards for **Donors**, **Volunteers**, and **Admins** with private route protection.
5. **Core Functionality Logic:** Built the advanced Donor Search engine, request filtering (Pending/InProgress/Done), and profile update logic.
6. **Payment & Security:** Integrated Stripe for funding modules and secured frontend/backend configuration with environment variables.
7. **Optimization & UX:** Added Framer Motion for smooth transitions, implemented loading/error states, and fine-tuned UI alignment.

## 🌟 Key Features
- **Smart Donor Search:** Filter donors by Blood Group, District, and Upazila.
- **Dynamic Dashboards:** Personalized views based on user roles.
- **Secure Funding:** Integrated Stripe payment system for community support.
- **Request Lifecycle:** Complete tracking of blood donation requests.
- **Data Management:** Admin capabilities to block/unblock users and manage roles.

## ⚙️ Tech Stack & Dependencies
- **Frontend:** React.js, Tailwind CSS, DaisyUI, TanStack Query, React Hook Form, Framer Motion.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT.
- **Deployment:** Netlify (Client), Vercel/Render (Server).

## 🚀 Getting Started
### Setup Instructions:
1. **Clone the repository.**
2. **Install dependencies:** `npm install`
3. **Configure Environment Variables:**
   - Create a `.env` file in the client folder with: `VITE_API_URL`, `VITE_IMAGEBB_API_KEY`.
   - Create a `.env` file in the server folder with: `DB_USER`, `DB_PASS`, `ACCESS_TOKEN_SECRET`, `STRIPE_SECRET_KEY`.
4. **Run the project:** `npm run dev` (Client) | `npm run start` (Server)

---
*Developed as a full-stack solution to facilitate community-driven blood donation.*