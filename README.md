# AutoDrive — Full Stack Car Dealership Platform

AutoDrive is a full-stack pre-owned car dealership web application built for the Indian market. It allows users to browse, buy, sell, and book test drives for used cars, as well as find verified repair centers — all from a clean, responsive frontend backed by a Node.js/MySQL API.

---

## Table of Contents

- [Live Pages](#live-pages)
- [Tech Stack](#tech-stack)
- [Website Structure](#website-structure)
  - [Homepage](#1-homepage-indexhtml)
  - [Buy Page](#2-buy-page-buyhtml)
  - [Sell Page](#3-sell-page-sellhtml)
  - [Repair Page](#4-repair-page-repairhtml)
  - [About Page](#5-about-page-abouthtml)
- [Features In Detail](#features-in-detail)
  - [Authentication System](#authentication-system)
  - [User Dashboard](#user-dashboard-profile-panel)
  - [Bookings System](#bookings-system)
  - [Saved Cars](#saved-cars)
  - [AI Assistant](#ai-assistant)
  - [EMI Calculator](#emi-calculator)
  - [Car Filters and Search](#car-filters-and-search)
  - [Sell a Car](#sell-a-car-multi-step-form)
  - [Repair Centers](#repair-centers)
- [Backend API](#backend-api)
- [Frontend JS Architecture](#frontend-javascript-architecture)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Key Design Decisions](#key-design-decisions)

---

## Live Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Landing page, car preview, testimonials, FAQ |
| Buy | `buy.html` | Full car listings with filters and booking |
| Sell | `sell.html` | Multi-step form to list a car for sale |
| Repair | `repair.html` | Browse and filter verified repair centers |
| About | `about.html` | Company story and team |

---

## Tech Stack

### Frontend
- Vanilla HTML, CSS, JavaScript (no frameworks)
- Google Fonts — Poppins
- Fully responsive for mobile and desktop

### Backend

| Package | Version | Purpose |
|---|---|---|
| express | ^5.2.1 | HTTP server and routing |
| mysql2 | ^3.17.4 | MySQL database driver |
| bcrypt | ^6.0.0 | Password hashing |
| body-parser | ^2.2.2 | Request body parsing |
| cors | ^2.8.6 | Cross-origin resource sharing |

---

## Website Structure

### 1. Homepage (`index.html`)

The main landing page — the first thing any visitor sees and the gateway to all other features.

**Sections:**

**Navbar** — Logo on the left, a global search bar in the center, and navigation links on the right (Home, Buy, Sell, Repair, About Us).

**Left Sidebar Buttons** — A vertical strip of four floating buttons fixed to the left edge of every page:
- WhatsApp — opens a direct WhatsApp chat with the dealership
- Call — initiates a phone call
- User / Profile — opens the login panel or profile dashboard
- AI Assistant — opens the AutoDrive AI chat

**Hero Section** — A full-screen background image with the tagline *"A Collection Built On Trust"* and a Browse Collection button linking to the Buy page.

**Car Preview Grid** — A selection of available cars loaded dynamically from the backend. Each card shows the car's photo, name, year, type, fuel type, price, a heart save button, and a Book Now button.

**Testimonials** — Two customer review cards with photos, star ratings, and the car they purchased.

**FAQ Section** — Accordion-style questions and answers about bookings, repair centers, verified partners, and service warranties.

**Footer** — Company address in Ludhiana, Punjab, and quick navigation links to all pages.

**Back to Top Button** — A floating arrow button that appears after the user scrolls down.

---

### 2. Buy Page (`buy.html`)

The primary car browsing and purchasing page.

**Filter Bar** — Type dropdown and a price range slider above the car grid.

**Car Grid** — All available cars fetched from the backend. Each card has a save heart, a Book Now button, and a Booked sticker badge if the user has already booked that car.

**Booking Modal** — A detailed multi-field form that opens when Book Now is clicked (covered in detail below).

**EMI Calculator** — Below the listings, a calculator to estimate monthly loan payments.

**Detail Drawer** — A slide-over panel from the right edge that shows Bookings or Saved Cars when triggered from the dashboard.

---

### 3. Sell Page (`sell.html`)

A three-step wizard form for users to submit their car to be listed.

**Step 1 — Car Details:**
- Car name, manufacturing year, mileage
- Fuel type (Petrol / Diesel / CNG / Electric)
- Asking price with live ₹ formatting
- Description with a live character counter
- All fields have real-time inline validation

**Step 2 — Review:**
- A clean summary card of all entered information before final submission

**Step 3 — Success:**
- An animated confirmation screen after the form is submitted to the backend

The entire form is gated behind authentication. Unauthenticated users who click or focus on any field are immediately redirected to the login panel. The form resumes after login without losing their position.

---

### 4. Repair Page (`repair.html`)

Lists AutoDrive-verified car service and repair centers.

**Brand Filter** — Dropdown to show only centers that service a specific brand (Maruti, Hyundai, Honda, Kia, Toyota, etc.)

**Search** — Filters centers by name or area in real time.

**Center Cards** — Each card shows the center name, address, supported car brands, and a Call Now button that dials the center directly.

The AI Assistant is available on this page and is specifically designed to recommend which center to visit based on the user's described car issue.

---

### 5. About Page (`about.html`)

A static page describing the AutoDrive company — its founding story, mission statement, core values, and team members.

---

## Features In Detail

### Authentication System

AutoDrive has a full authentication system accessible from two entry points:

**Auth Slide Panel** — slides in from the left side of the screen when the user icon in the sidebar is clicked.

**Auth Popup** — appears as a centered modal overlay, triggered when a user tries to perform a gated action (e.g. saving a car or filling the sell form) while not logged in.

Both share the same login and register tabs and the same underlying logic.

**Login:**
1. User enters email and password
2. `loginUser()` sends `POST /api/auth/login`
3. On success, the user object is stored in `localStorage` under `autodrive_user`
4. The sidebar user button changes to show the profile avatar
5. The auth panel closes and the profile panel opens

**Registration:**
1. User fills in first name, last name, email, and password
2. `registerUser()` sends `POST /api/auth/register`
3. The backend hashes the password with bcrypt before storing it in MySQL
4. On success the user is automatically logged in

**Additional auth details:**
- Password show/hide toggle on all password fields
- Field-level inline error messages (e.g. "Email already in use")
- Green/red toast notifications in the bottom-right corner for all auth feedback
- Loading spinner state on buttons during API calls

---

### User Dashboard (Profile Panel)

After logging in, clicking the user icon opens the Profile Slide Panel — a full side drawer.

**Dashboard Header:**
- Profile photo with an upload button (stored as base64 in localStorage)
- Full name and email
- Member and Verified badges
- Three clickable stat boxes:
  - **Bookings** — shows total booking count; clicking opens the Bookings drawer
  - **Saved Cars** — shows total saved count; clicking opens the Saved Cars drawer
  - **Member Since** — the year the account was created

**Profile Tab** (editable):
- First Name, Last Name, Username
- Email Address (read-only)
- Phone Number, Date of Birth
- City (dropdown) and Country
- Bio (free text area)
- Save Changes and Discard buttons

**Security Tab:**
- Change password form with current password verification, new password, and confirm password fields
- Inline strength and match validation

All profile data is stored in `localStorage` per user, keyed by email, so multiple accounts on the same device maintain separate data.

---

### Bookings System

Any car on the homepage preview or Buy page can be booked for a test drive via the Book Now button.

**Booking Form fields:**
- Selected Vehicle — auto-filled with the car name
- Personal Info — first name, last name, email, phone
- Address — street, city, state, pincode
- Vehicle Preference — body type preference (sedan, SUV, hatchback, etc.)
- Appointment Details — preferred date and time slot (radio buttons for morning, afternoon, evening)
- Math CAPTCHA — a simple arithmetic question generated randomly to prevent bot submissions

**Form validation** — every field is checked before the form can be submitted, with specific inline error messages per field.

**On successful booking:**
1. `POST /api/bookings` is sent to the backend with all form data
2. The booking is saved to MySQL and the backend responds with `{ success: true, booking: { _id } }`
3. The booking is saved to `localStorage` per user with the backend `_id` stored alongside it
4. A success popup appears
5. The Bookings count in the dashboard stat box updates immediately
6. A Booked sticker badge appears on the car's card on the page

**Removing a booking:**
1. User clicks their Bookings stat box or icon to open the Bookings Drawer
2. Clicks Remove Booking on any entry
3. The booking is deleted from `localStorage` instantly — UI updates without waiting
4. `DELETE /api/bookings/:id` is sent to the backend to remove it from MySQL
5. If the server is unreachable, the local deletion still completes and a warning toast is shown

---

### Saved Cars

Any car can be saved by clicking the ❤️ heart button overlaid on its photo.

- If the user is not logged in, clicking the heart opens the login popup
- If logged in, the car is saved to `localStorage` under `ad_saved_<base64email>`
- The heart fills red to confirm it is saved
- Saved data persists across sessions for that user account

**Viewing saved cars:**
- The Saved Cars stat box in the dashboard shows the live count
- Clicking it opens the Saved Cars Drawer — a panel that slides in from the right
- Each entry shows the car thumbnail, name, year, type, fuel type, and price
- A Remove button unsaves the car and immediately updates the heart icon on the page

---

### AI Assistant

A floating AI chat button is available on every page in the left sidebar.

The AutoDrive AI chat panel is powered by the Anthropic Claude API.

- Users describe their car make and the problem in plain text
- The AI responds with a service center recommendation suited to the issue
- Pre-built quick-chip buttons appear for common queries (e.g. Maruti Servicing, AC Repair Help)
- Full conversation history is maintained within the session
- Enter key sends the message

---

### EMI Calculator

Located on the Buy page below the car listings.

**Inputs:**
- Car price in ₹
- Down payment amount
- Loan tenure in months
- Annual interest rate as a percentage

The calculator outputs the estimated **monthly EMI** using the standard reducing-balance formula. Results update instantly as the user types.

---

### Car Filters and Search

**On the Buy page:**
- Type filter — dropdown to show only a specific car body type
- Price range slider — sets a maximum price; the grid filters live

Both filters apply simultaneously (AND logic — a car must match both to show).

**Global search bar (navbar):**
- Present on all pages
- Typing filters the visible car cards by name in real time, with no page reload

---

### Sell a Car (Multi-Step Form)

The Sell page guides users through a 3-step wizard to submit their car.

**Step 1 — Details:**
Live-validated fields for car name, year, mileage, fuel type, asking price (with auto ₹ formatting), and a description with a character counter.

**Step 2 — Review:**
Displays all entered data in a readable summary card before the user confirms.

**Step 3 — Success:**
Animated confirmation after `POST /api/sell` succeeds.

**Auth gate:** Clicking or focusing any form field while logged out silently opens the auth panel. The form waits and resumes after the user logs in.

---

### Repair Centers

The Repair page displays AutoDrive-verified service centers with:
- Brand filter dropdown
- Live name/area search
- Direct Call Now links on each card
- AI integration for personalized center recommendations

---

## Backend API

### Getting Started

**Prerequisites:** Node.js v18+, MySQL 8+

```bash
# Install dependencies
npm install

# Create the MySQL database
mysql -u root -p -e "CREATE DATABASE autodrive;"

# Configure credentials (see Environment Variables)

# Start the server
node server.js
# Runs at http://localhost:5000
```

---

### API Endpoints

#### Authentication
| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/api/auth/register` | `{ first_name, last_name, email, password }` | Register — bcrypt-hashes password before storing |
| POST | `/api/auth/login` | `{ email, password }` | Login — returns user object |

#### Cars
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cars` | All car listings |
| GET | `/api/cars/:id` | Single car by ID |
| POST | `/api/cars` | Add a new listing |
| DELETE | `/api/cars/:id` | Remove a listing |

#### Bookings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/bookings` | All bookings |
| POST | `/api/bookings` | Create booking — returns `{ success, booking: { _id } }` |
| DELETE | `/api/bookings/:id` | Cancel a booking (called from the dashboard drawer) |

#### Sell
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/sell` | Submit a car for listing |

#### Repair
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/repair` | All repair centers |
| POST | `/api/repair` | Submit a repair request |

---

## Frontend JavaScript Architecture

All frontend logic is in a single `script.js` file (~2600 lines), divided into numbered sections:

| Section | Description |
|---|---|
| 1 | DOMContentLoaded — detects the current page and initialises only the relevant modules |
| 3a | Cars page init — loads car listings, sets up filters |
| 3b | Repair page init — loads centers, wires up search and filter |
| 4a–4k | Full auth system — panel/popup, login, register, logout, toast, loading state, field errors |
| 5a–5e | Car listings — API fetch, card rendering, type filter, price range filter, count display |
| 6a–6e | Booking system — CAPTCHA generation, modal open/close, full form validation, API submit |
| 7 | Sell page — multi-step form logic, live validation, step navigation, review population |
| 8 | Booked stickers — badge management on car cards after a booking |
| 9 | Profile panel — open/close, tab switching, load/save data, avatar upload and preview |
| 10 | Auth flow patch — wires login/register responses into the profile panel |
| 11 | Sell auth gate — intercepts form interaction when logged out |
| 16 | Saved Cars — heart toggle, per-user localStorage get/set, panel refresh |
| 17 | Bookings dashboard — local storage, backend DELETE sync, panel refresh |
| 18 | Detail Drawer — slide-over for bookings and saved cars, render, remove handlers |

---

## Project Structure

```
autodrive/
├── front end/
│   ├── index.html
│   ├── buy.html
│   ├── sell.html
│   ├── repair.html
│   ├── about.html
│   ├── css/
│   │   └── style.css          # All styles (~43 organised sections)
│   └── js/
│       └── script.js          # All frontend logic (~2600 lines, 18 sections)
│
├── back end/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   └── db.js              # MySQL connection setup
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cars.js
│   │   ├── bookings.js
│   │   ├── sell.js
│   │   └── repair.js
│   └── package.json
│
└── images/                    # Shared assets (logo, review photos, car images)
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=autodrive
PORT=5000
```

Add dotenv to the project and load it at the top of `server.js`:

```bash
npm install dotenv
```

```js
require('dotenv').config();
```

Add `.env` to `.gitignore` — never commit credentials to version control.

---

## Key Design Decisions

**No frontend framework** — the entire frontend is vanilla JavaScript. This keeps the bundle size zero, page loads instant, and the codebase easy to read without build tools.

**Per-user localStorage** — saved cars and bookings are stored under keys like `ad_saved_<base64email>` and `ad_bookings_<base64email>`, so multiple user accounts on the same device never share data.

**Optimistic UI for removals** — deleting a booking updates the UI instantly without waiting for the backend. If the server is unreachable the deletion still completes locally and a warning toast notifies the user.

**Auth gating without hard redirects** — the sell form and heart button don't redirect to a login page. Instead they silently open the auth panel inline and resume the user's intended action after login.

**Single script.js** — page detection runs at `DOMContentLoaded` and only initialises the modules relevant to the current page, keeping all logic in one maintainable file without a bundler.

**Backend _id sync** — when a booking is created, the backend's database ID (`_id`) is stored alongside the local record so that the correct row can be targeted for deletion later with `DELETE /api/bookings/:id`.

---

## License

This project is for educational and personal use. All rights reserved.
