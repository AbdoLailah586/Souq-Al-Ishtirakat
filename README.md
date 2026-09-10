# 🏮 Souq Al-Ishtirakat (Digital Subscription Bazaar)

> **GitHub Repository Description (Copy & Paste):**  
> A premium, dark-themed e-commerce web application & marketplace for digital subscriptions (AI tools, Design, Video, Entertainment & Marketing) with a built-in interactive wallet system (Instapay & Vodafone Cash), automated order fulfillment, client dashboard, and full admin management portal.

---

## 🌟 Overview

**Souq Al-Ishtirakat** is a full-featured digital subscription marketplace designed with a **Dark Digital Night Bazaar** visual aesthetic (`#100f26` deep midnight with radiant gold `#f0a83c`, cyan `#3ddad0`, and AI purple `#9b8bff` accents). 

It empowers customers to purchase verified AI models (ChatGPT Plus, Gemini Pro 5TB, Claude Pro 5X, Grok), creative suites (Adobe CC, Canva Pro, Figma, CapCut Pro), streaming services (Netflix), and digital marketing tools using local payment methods (**Instapay** and **Mobile Cash Wallets**). It features a real-time wallet balance engine, receipt submission, instant credential delivery, and a complete administrative control panel.

---

## 🚀 Key Features

### 1. Comprehensive Service & Bundle Catalog (13 Services + 6 Packages)
All products and package offers are pre-configured with exact durations, variant codes, supplier costs, and retail prices:

- **AI Assistants**:
  - **ChatGPT Plus** (Code `10208`): Full GPT-5 model, Deep Think reasoning mode, Sora video generation, Voice mode, Custom GPTs & Projects.
  - **Gemini Pro (Google AI Pro)** (Code `10415`): 18-Month validity with **5TB Google One Cloud Storage** activated on your personal email, Veo video, NotebookLM.
  - **Claude Pro 5X** (Code `10427`): 5X higher usage limits, Claude Code CLI tool, Artifacts, and Projects.
  - **Super Grok** (Code `10423`): 7-Day access, Grok Imagine, DeepSearch, and Voice mode.
- **Design & Creativity**:
  - **Canva Pro**: 1-Year (Code `10436`) & 3-Year (Code `10419`) plans with 140M+ assets and Magic AI tools.
  - **Adobe Creative Cloud** (Code `10055`): 4-Month ready account with 20+ desktop applications (Photoshop, Illustrator, Premiere Pro, etc.).
  - **Adobe Express / Pro** (Code `10444`): 3-Month personal account activation with PDF editing & AI generation.
  - **Figma Pro Education** (Code `1570`): 2-Year plan with unlimited projects, Dev Mode, and Team Libraries.
- **Video & Motion**:
  - **CapCut Pro**: 4 flexible durations: 7 Days (Code `10421`), 30 Days Economic (Code `10428`), 30 Days Premium (Code `10422`), and 6 Months (Code `1596`).
- **Entertainment**:
  - **Netflix Premium 4K** (Code `1563`): Private account, up to 5 profile invitations, dedicated Outlook access with OTP retrieval, and a 25-day replacement warranty.
- **Productivity**:
  - **Microsoft Office 365** (Code `1597`): 12-Month full desktop apps + 1TB OneDrive cloud storage.
- **Marketing & Business Tools**:
  - **WhatsApp Sender** (Bulk Sender): 1-Year (Code `1386`), 3-Year (Code `1568`), and Lifetime License (Code `1569`). Features auto-chatbot, warming engine, and contact filter.
  - **Egypt Phone Numbers Database** (Code `208`): 30 to 45 Million categorized Egyptian phone records (Doctors, Engineers, Real Estate, E-Commerce, etc.) updated for 2025–2026.
- **Curated Value Bundles (6 Deals)**:
  - `ChatGPT + Gemini Pro` (Code `21885` - 985 EGP)
  - `Claude Pro 5X + Gemini Pro` (Code `23164` - 935 EGP)
  - `Academic Year Bundle` (Office 365 + Gemini + Canva Pro) (Code `23232` - 330 EGP)
  - `Digital Merchant Bundle` (Data + WhatsApp Sender 1y + Canva Pro 1y) (Code `23940` - 450 EGP)
  - `Launch Your Business Bundle` (WhatsApp Sender Lifetime + Data + Canva Pro 3y) (Code `24140` - 550 EGP)
  - `Freelancer Kit` (Office 365 + Adobe Express + Gemini Pro) (Code `25339` - 420 EGP)

---

### 2. Interactive Wallet & Local Payment Engine
- **Local Methods**: Instant zero-fee transfers via **Instapay (IPA)** and **Smart Mobile Wallets (Vodafone Cash, Orange Money, Etisalat Cash, WE Pay)**.
- **One-Click Account Copy**: Click to copy payment addresses and phone numbers with real-time feedback.
- **Proof of Payment**: Customers can upload receipt screenshots and enter sender details.
- **Express Verification**: Direct WhatsApp link generation with pre-filled transaction parameters for instant support confirmation.
- **Automatic Balance Deductions**: 1-click checkout from the user's available wallet balance. If balance is insufficient, the system automatically opens the top-up dialog.

---

### 3. Customer Portal & Credentials Delivery
- **Order Tracking**: Real-time status badges (`Processing ⏳` / `Delivered ✓` / `Cancelled ✕`).
- **One-Click Credentials Box**: Secured delivery card displaying account email, password, license key, and operating instructions with **1-click copy buttons**.
- **Financial Ledger**: Complete history of deposit requests, approved credits, and purchase transactions.

---

### 4. Admin Management Portal
- **Dashboard KPIs**: Live metrics tracking today's sales, pending top-up requests, delivered accounts, and active users.
- **Order Fulfillment**: Dedicated workflow for admins to paste generated accounts (email, password, license keys, setup guide) and deliver them instantly to the client's screen.
- **Top-Up Approvals**: Review deposit requests with full-size receipt preview, approve to credit user balance immediately, or reject with a custom note.
- **Live Price Management**: Inline price editor to adjust selling prices across all service variants in real time.
- **Platform Settings**: Update Instapay address, Vodafone Cash number, WhatsApp support line, working hours, and the announcement banner.
- **Role Switcher**: Built-in toggle in the navigation bar to switch between `Customer` and `Admin` roles for zero-friction testing.

---

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark Theme Tokens + Glassmorphism
- **Icons**: Lucide React
- **State Management**: React Context API with LocalStorage Persistence & In-Memory Fallback
- **Database (Optional/Ready)**: Supabase PostgreSQL with pre-configured schema, triggers, and Row Level Security (RLS) policies.

---

## 📂 Project Structure

```
موقع عرض الخدمات/
├── index.html                   # HTML entry point with Cairo & Tajawal Arabic typography
├── package.json                 # Dependencies & project scripts
├── vite.config.ts               # Vite bundler configuration
├── tailwind.config.js           # Night bazaar color palette and design system tokens
├── tsconfig.json                # TypeScript compiler configuration
├── تشغيل_الموقع.bat             # 1-Click Windows launch script
├── README.md                    # Project documentation
├── public/
│   └── favicon.svg              # Glowing bazaar lantern vector icon
├── src/
│   ├── main.tsx                 # App mount point with providers
│   ├── App.tsx                  # Main router and view orchestrator
│   ├── index.css                # Global CSS, glassmorphism, and scrollbars
│   ├── types/
│   │   └── index.ts             # TypeScript definitions (Services, Bundles, Orders, etc.)
│   ├── data/
│   │   ├── services.ts          # 13 verified services with full numbered feature lists
│   │   ├── bundles.ts           # 6 value bundle offers
│   │   └── initialData.ts       # Demo users, initial orders, transactions, and settings
│   ├── context/
│   │   ├── AuthContext.tsx      # Auth, role switching (Customer/Admin), and balance state
│   │   └── StoreContext.tsx     # Wallet engine, checkout, orders, and admin handlers
│   ├── components/
│   │   ├── Navbar.tsx           # Glassmorphic top navigation with live wallet balance
│   │   ├── Footer.tsx           # Trust badges, payment methods, and policies
│   │   ├── ServiceCard.tsx      # Service card with duration picker & dynamic price update
│   │   ├── BundleCard.tsx       # Package card with savings tag and 1-click purchase
│   │   ├── ServiceModal.tsx     # Full details modal with complete feature breakdown
│   │   ├── TopUpModal.tsx       # Wallet recharge modal with Instapay & Cash tabs
│   │   └── WhatsAppButton.tsx   # Floating glowing WhatsApp button with pulse animation
│   └── pages/
│       ├── Home.tsx             # Landing page with hero banner, categories, and testimonials
│       ├── Services.tsx         # Catalog with live search, category pills, and price sorting
│       ├── Bundles.tsx          # Dedicated package deals showcase
│       ├── PaymentGuide.tsx     # Step-by-step payment visual guide
│       ├── AboutWarranty.tsx    # Detailed warranty terms and account protection rules
│       ├── Support.tsx          # Accordion FAQ and WhatsApp contact form
│       ├── dashboard/
│       │   ├── Overview.tsx     # User dashboard overview and statistics
│       │   ├── Wallet.tsx       # Wallet ledger, transaction filter, and top-up triggers
│       │   └── Orders.tsx       # Delivered credentials viewer with 1-click copy buttons
│       └── admin/
│           ├── Dashboard.tsx    # Admin KPI overview and sub-navigation
│           ├── OrdersManager.tsx# Order fulfillment & credential entry
│           ├── WalletRequests.tsx# Receipt preview & deposit approvals
│           ├── ServicesManager.tsx# Inline price editor
│           └── SettingsManager.tsx# Payment addresses, support line, and announcement banner
└── supabase/
    └── schema.sql               # Complete Supabase PostgreSQL schema with RLS & seed data
```

---

## 💻 Local Setup & Running

### Method 1: One-Click Launch (Windows)
Double-click the batch file:
```cmd
تشغيل_الموقع.bat
```
This automatically installs dependencies (if not already installed), launches the server, and opens `http://localhost:3000` in your default browser.

### Method 2: Command Line (Any OS)
```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
http://localhost:3000
```

### Method 3: Production Build & Preview
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview -- --port 3000
```

---

## ☁️ Deployment to Vercel / Netlify

This project is built with Vite and standard web standards, making it 100% plug-and-play with modern hosting platforms:

1. Push the project to a **GitHub** repository.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your repository.
4. Set the build parameters:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your site will be live on a global CDN in seconds.

---

## 🗄️ Supabase Integration (Optional)

The application operates seamlessly out-of-the-box using the client-side reactive store and local persistence. If you wish to connect it to a production Supabase cloud database:

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
4. All tables, foreign keys, triggers, and Row Level Security (RLS) policies will be configured automatically.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
