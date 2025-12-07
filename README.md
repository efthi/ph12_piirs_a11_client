## 0. কী বানাচ্ছো, ছোট করে মাথায় রাখো

Port City PIIRS = Public Infrastructure Issue Reporting System
Role: **citizen / staff / admin**
Core জিনিসগুলো: issue report, manage, track, payment, role-based dashboard, search/filter/pagination, upvote, premium, block, timeline ইত্যাদি। 

তুমি একা + learner স্টেজ =
👉 একবারে সব না, **“layer by layer”** করে বানাবে
👉 আগে মিনিমাম ভার্সন, তারপর ধীরে ধীরে ফিচার যোগ করবে

---

## 1. প্রথম ১–২ দিন: প্রজেক্ট ব্রেকডাউন + ডিজাইন

### 1.1 Requirement থেকে নিজের language-এ নোট বানাও

* সব রুট লিখে ফেলো:

  * `/` Home
  * `/all-issues`
  * `/issue/:id` (private)
  * `/login`, `/register`
  * `/dashboard/citizen/...`
  * `/dashboard/staff/...`
  * `/dashboard/admin/...`
* প্রতিটা রুটে কী UI আর কী ডাটা লাগবে, পয়েন্ট আকারে লিখো।

### 1.2 ডাটাবেস ডিজাইন (কাগজে/Notion-এ)

MongoDB collections (suggestion):

* `users`

  * _id, name, email, photo, role: "admin" | "citizen" | "staff"
  * isPremium: bool
  * isBlocked: bool
* `issues`

  * _id, title, description, category, image, location
  * status: "pending" | "in-progress" | "working" | "resolved" | "closed" | "rejected"
  * priority: "normal" | "high"
  * reporterId (citizen)
  * staffId (nullable)
  * upvotes: number
  * upvotedUsers: [userId] (optional, multiple upvote প্রতিরোধে)
  * createdAt
* `payments`

  * _id, userId, type: "boost" | "subscription"
  * issueId (nullable, যদি boost হয়)
  * amount, transactionId, createdAt
* `timelines`

  * _id, issueId
  * status, message, updatedByRole, updatedById
  * createdAt

এভাবে clear থাকলে পরে API বানানো অনেক সহজ লাগবে।

---

## 2. Tech Stack Fix করে ফেলো (আর তারপর আর change করবে না)

**Client:**

* React + Vite
* React Router
* Tailwind + DaisyUI
* TanStack Query (data fetching)
* Axios (later interceptor)
* SweetAlert2 / React Hot Toast

**Server:**

* Node.js + Express
* MongoDB + Mongoose (বা native driver)
* JWT auth + role-based middleware

**Auth:**

* Firebase Authentication (Email/Pass + Google)

**Payment:**

* শেখার জন্য Stripe test mode (100TK মানে শুধু amount 100 set করলেই হবে)

---

## 3. গ্লোবাল কাজের এলগরিদম (প্রতি ফিচারে follow করবে)

প্রতিটা বড় ফিচারের জন্য এই ৮-স্টেপ সাইকেল:

1. **UI plan** (কাগজে বা Figma না পারলে মাথায় + নোটে)
2. **Route + component create**
3. **Backend API route define** (URL, method, body, response)
4. **Server কোড লিখো** (model → controller → route)
5. **Client থেকে TanStack Query দিয়ে call করো**
6. **Mutation + toast + loader যোগ করো**
7. **Test করো** (happy + fail case)
8. **Meaningful Git commit**

   * `feat: add issue model and create issue api`
   * `feat: implement citizen report issue form` ইত্যাদি

---

## 4. Phase-by-Phase Roadmap (learner-বান্ধব)

### Phase 1 – Project Setup (১–২ দিন)

**Client:**

* Vite + React + Tailwind + DaisyUI সেটআপ
* Basic routes:

  * `/` simple text
  * `/login`, `/register`
  * `/dashboard` (layout only, left sidebar dummy)
* Navbar + Footer বানাও (static).
* GitHub client repo + প্রথম ~৩–৪টা commit।

**Server:**

* Express + MongoDB কানেক্ট
* Health check route (`/` → “server ok”)
* GitHub server repo + কিছু commit।

> Learning টার্গেট:
> React basic, routing, Tailwind basic, Express basic, MongoDB connect.

---

### Phase 2 – Auth System (২–৩ দিন)

1. **Firebase config** (env-এ keys)
2. Auth Context বানাও:

   * `user`, `loading`, `login`, `register`, `logout`
3. Login / Register form:

   * name, email, password, photo (upload → direct URL বা text field first version)
   * Firebase create user → server-এ `/users` এ পোস্ট (role ডিফল্ট citizen)
4. **JWT implementation:**

   * Client থেকে user login হলে server-এ `/jwt` এ email পাঠাবে
   * Server JWT sign করে cookie তে সেট করবে (`httpOnly`, `secure` dev অনুযায়ী)
5. **Private Route component** বানাও (JWT + Firebase user check করে)
6. Navbar-এ login state অনুযায়ী:

   * profile picture
   * dropdown: name, dashboard, logout

> এখনো role-based কিছু নয়, শুধু basic login/session working করাও।

---

### Phase 3 – Basic Citizen Flow (Core ফ্লো আগে) (৩–৫ দিন)

#### 3.1 Report Issue (dashboard → `/dashboard/report-issue`)

1. Form fields: title, description, category (select), image, location.
2. Submit করলে:

   * Check: user blocked? → toast + prevent
   * Premium না + total issues >= 3 ? → prevent + “Go to profile to subscribe” button
3. Server `/issues` POST:

   * default status: `"pending"`, priority: `"normal"`, upvotes: 0
4. Issue create হলে timeline এ একটা entry add করো:

   * status: "pending"
   * msg: "Issue reported by citizen"
5. সফল হলে:

   * toast
   * redirect `/dashboard/my-issues`

#### 3.2 My Issues Page

* Table / cards:

  * title, category, status, priority, upvotes, actions
* Actions:

  * Edit (only if status = pending)
  * Delete
  * View Details (`/issue/:id`)

Edit flow (learner-friendly):

* প্রথমে simple page-এ pre-filled form → update করো
* পরে চাইলে modal form-এ convert করতে পারো।

Delete:

* sweet alert confirm → DELETE API → TanStack Query invalidate.

> Learning টার্গেট: form handling, CRUD, TanStack Query mutations।

---

### Phase 4 – Issue Details + Timeline (২–৩ দিন)

**Route:** `/issue/:id` (Private)

1. Issue full info দেখাও।
2. Timeline vertical UI:

   * map করে timeline entries
   * latest on top (sort by createdAt desc)
3. Buttons (Citizen perspective):

   * Edit (if own issue + status pending)
   * Delete (if own issue)
   * Boost priority (if priority != high, user not blocked)
4. Staff info যদি assigned থাকে, দেখাও (name, photo, phone etc.)

> এই Phase শেষ হলে:
> Citizen পুরোপুরি issue lifecycle দেখতে পারবে (still without boost payment).

---

### Phase 5 – All Issues Page (public) (৩–৪ দিন)

Route: `/all-issues`

1. Card design:

   * image, title, category, status badge, priority badge
   * location
   * upvote button + total upvotes
   * View details

2. Sorting:

   * priority high আগে, তারপর others

3. Pagination:

   * Server-side: `/issues?page=&limit=`
   * UI-তে simple buttons: Prev / 1 2 3 / Next

4. Search + Filter (server-side):

   * Query params: `search, category, status, priority`
   * Client থেকে controlled inputs + debounced search (পরে করতে পারো)

5. **Upvote rules implement:**

   * Not logged in → redirect to login
   * Own issue → toast: cannot upvote own issue
   * প্রতিটা issue তে একবারই upvote:

     * `upvotedUsers` array-এ userId আছে কিনা দেখে
   * Upvote হলে db-তে increment এবং instantly UI update

> এখানে TanStack Query খুব কাজে লাগবে – cache + refetch।

---

### Phase 6 – Role-Based System + Staff/Admin Basics (৩–৫ দিন)

#### 6.1 Role ফিল্ড নিশ্চিত করো

* `users` collection এ role: `"admin" | "citizen" | "staff"`
* Login-এর পর client-side-এ `/users/:email` hit করে role নিয়ে auth context-এ রাখো।

#### 6.2 Backend Middleware

* `verifyToken` – JWT validate
* `verifyAdmin`, `verifyStaff`, `verifyCitizen` – role check

Routes protect করো:

* `/admin/...`
* `/staff/...`
* `/citizen/...` etc.

#### 6.3 Dashboard Layout Split

* `/dashboard` → role অনুযায়ী প্রথম landing page:

  * admin → admin stats
  * staff → staff stats
  * citizen → citizen stats

সাইডবার আলাদা:

* Citizen menu:

  * Dashboard, My Issues, Report Issue, Profile, Payments/Activities
* Staff menu:

  * Dashboard, Assigned Issues, Profile
* Admin menu:

  * Dashboard, All Issues, Manage Users, Manage Staff, Payments, Profile

---

### Phase 7 – Staff Features (২–৩ দিন)

#### Assigned Issues Page

* Server route: `/staff/issues` → শুধু logged-in staff-এর assigned issues
* Table:

  * title, citizen, status, priority, location, actions
* Change Status button → dropdown:

  * pending → in-progress
  * in-progress → working
  * working → resolved
  * resolved → closed
* Status change করলে:

  * Issue status update
  * Timeline-এ entry add:

    * "Status changed to ... by Staff X"
* Filters: status, priority

#### Staff Dashboard

* Simple stats:

  * Total assigned
  * Resolved count
  * Today’s tasks (status != closed)
* Basic chart (e.g., resolved vs pending).

---

### Phase 8 – Admin Features (৩–৫ দিন)

#### 8.1 Admin Dashboard

Cards:

* Total issues, resolved, pending, rejected
* Total payment amount
* Last few issues, payments, users (simple tables)

#### 8.2 Admin → All Issues Management

* Table with:

  * title, category, status, priority, staff, actions
* **Assign Staff button** (if no staff assigned):

  * Modal → dropdown of staff list → select → save
  * After assign:

    * issue staffId set
    * timeline: "Issue assigned to Staff: X"
    * staff dashboard-এ সাথে সাথে দেখা যাবে
* **Reject button** (status pending হলে):

  * confirm → status = "rejected"
  * timeline entry add

#### 8.3 Manage Users

* Table: name, email, role, isPremium, isBlocked
* Block / Unblock buttons:

  * update db, toast
  * Blocked users login করতে পারবে কিন্তু:

    * submit, edit, upvote, boost করতে পারবে না (client + server দুইদিকেই check)

#### 8.4 Manage Staff

* Add Staff modal:

  * name, email, phone, photo, password
  * Firebase-এ user create
  * DB-তে staff role সহ save
* Update Staff (modal)
* Delete staff:

  * confirm → db থেকে remove + চাইলে future assignment stop

#### 8.5 Payments Page

* Table of all payments
* Optional: month-wise chart

---

### Phase 9 – Payment System (২–৪ দিন)

দুই ধরনের payment:

1. **Boost Issue (per-issue 100tk)**

   * Issue Details page-এ “Boost Priority” button
   * Payment success:

     * issue.priority = "high"
     * timeline: "Boost payment completed"
     * payments collection এ entry add (type: "boost")

2. **Subscription (1000tk)**

   * Citizen Profile page-এ Subscribe button
   * Payment success:

     * user.isPremium = true
     * timeline দরকার নেই (user-based, চাইলে আলাদা log রাখতে পারো)
     * এখন থেকে issue limit নাই

Stripe test mode flow শিখো (frontend → backend → stripe → webhook optional, simple success route করলেই হবে learner হিসেবে)।

---

### Phase 10 – Polishing & Challenge Tasks (৩–৫ দিন)

* TanStack Query everywhere for fetching
* Loader UI (spinner / skeleton)
* SweetAlert / Toast সব CRUD + login/signup এ
* **Responsive design**:

  * Navbar, home, dashboards, tables
* 404 page (nice design + “Back to Home” button)
* Dark/Light theme (optional task হিসেবে)
* Animations (Framer Motion বা AOS)
* Axios interceptor (JWT error হলে logout ইত্যাদি)
* Prevent multiple upvotes (already planned with `upvotedUsers`)

**PDF Invoice:**

* Admin payments page → ডাউনলোড invoice button
* User profile payments → per-payment invoice
* React-pdf দিয়ে simple template বানাও।

**README.md:**

* Project name: Port City PIIRS
* Live link, admin/staff/citizen credentials
* Features ১০+ bullet
* Tech stack, how to run, env variable example

**Git commits:**

* Client: কমপক্ষে ২০টা meaningful
* Server: কমপক্ষে ১২টা meaningful
  (প্রতিটা phase ধরে আলাদা আলাদা ছোট টাস্কে ভাগ করে commit দিবে।)

---

## 11. Daily Mini-Algorithm (Learner Mode)

প্রতিদিন কাজ শুরু করার আগে ১০ মিনিট প্ল্যান:

1. আজকে **একটা ছোট goal** ঠিক করো

   > যেমন: “My Issues page এর Edit + Delete শেষ করবো”
2. সেই goal এর জন্য কী API লাগবে লিখো।
3. Server কোড → Postman দিয়ে test।
4. Client থেকে connect → UI + loader + toast যোগ।
5. নিজের হাতে ৫–১০ বার flow test করো।
6. ১–২টা clean commit দাও।
7. শেষ ৫ মিনিটে নোট আপডেট করো: আজ কী শিখলে / কাল কী করবা।

---
