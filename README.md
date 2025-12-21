# PortCity PIIRS

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=black)
![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss\&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase\&logoColor=black)
![License: MIT](https://img.shields.io/badge/license-MIT-brightgreen)

> **Port City Public Infrastructure Issue Reporting System (PIIRS)**
> Client-side application for reporting, tracking, and managing public infrastructure issues in a smart city environment.

---

## 🌍 Project Overview

**PortCity PIIRS** is a modern, citizen-centric digital platform that enables residents to report real-world public infrastructure issues such as:

* Broken streetlights
* Potholes & damaged roads
* Water leakage
* Garbage overflow
* Damaged footpaths and public facilities

Municipal authorities and government staff can efficiently **verify, assign, track, and resolve** reported issues through a structured workflow.

### 🎯 Problem Statement

Municipal services often suffer from:

* Delayed responses
* Lack of transparency
* No centralized reporting or tracking system

### ✅ Solution & Impact

This system:

* Improves transparency between citizens and authorities
* Reduces response time
* Enables real-time issue tracking
* Helps collect and analyze city infrastructure data
* Enhances overall service delivery efficiency

---

## ⚙️ How the System Works

1. **Citizens** submit an issue report with details, photos, and location
2. **Admin** reviews and assigns the issue to responsible staff
3. **Staff** verifies the issue and updates progress
4. **System** tracks status: `Pending → In Progress → Resolved → Closed`
5. **Citizens** receive updates and can track issues anytime
6. **Premium Citizens** receive priority support

---

## ✨ Key Features (Client Side)

* 📝 **Issue Reporting:** Submit detailed reports with images
* 🔍 **Browse & Track Issues:** Track issue status in real time
* 🧭 **Status Workflow:** Clear lifecycle from pending to closed
* 🔐 **Authentication:** Firebase-based auth (role-based ready)
* ⭐ **Premium Support:** Priority handling for premium users
* ⚡ **Fast UI:** Vite + React 19 with optimized performance
* 🎨 **Modern UI:** Tailwind CSS v4 + daisyUI
* 🔔 **Notifications:** Toast & modal feedback (SweetAlert2)

---

## 🛠 Tech Stack

* **Frontend Framework:** React 19
* **Routing:** React Router 7
* **Build Tool:** Vite 7
* **Styling:** Tailwind CSS 4 + daisyUI
* **State & Data Fetching:** TanStack React Query
* **Forms:** React Hook Form
* **HTTP Client:** Axios
* **Authentication & Hosting:** Firebase
* **UI Utilities:** React Icons, Lucide React

---

## 📦 Packages

### Dependencies

* `react`, `react-dom`
* `react-router`
* `@tanstack/react-query`
* `axios`
* `firebase`
* `tailwindcss`, `daisyui`
* `react-hook-form`
* `react-toastify`, `sweetalert2`

### Dev Dependencies

* `vite`, `@vitejs/plugin-react`
* `eslint` & related plugins
* `@types/react`, `@types/react-dom`

---

## 📁 Project Structure

```text
ph12_piirs_a11_client/
├─ public/
│  └─ assets/              # Static assets
├─ src/
│  ├─ components/          # Reusable UI components
│  ├─ pages/               # Route-based pages
│  ├─ routes/              # Router configuration
│  ├─ layouts/             # Layout wrappers
│  ├─ services/            # API & axios instances
│  ├─ hooks/               # Custom hooks
│  ├─ context/             # Auth & global state
│  ├─ assets/              # Images & icons
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css            # Tailwind v4 entry
├─ index.html
├─ package.json
├─ eslint.config.js
└─ vite.config.js
```

---

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

---

## 🧪 Available Scripts

* `dev` – Start development server
* `build` – Build for production
* `preview` – Preview production build
* `lint` – Run ESLint

---

## 🔗 Important Links

* **Client Repository:** [https://github.com/efthi/ph12_piirs_a11_client](https://github.com/efthi/ph12_piirs_a11_client)
* **Live Application:** [https://piirs-ea.web.app/](https://piirs-ea.web.app/)
* **Server API:** [https://piirs-ea-server.vercel.app/](https://piirs-ea-server.vercel.app/)

---

## 📜 License

This project is licensed under the **MIT License**.
