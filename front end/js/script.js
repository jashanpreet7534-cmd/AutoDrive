/* ============================================================
   AutoDrive — script.js
   ============================================================
   TABLE OF CONTENTS
   -----------------
   1.  GLOBAL STATE
   2.  ENTRY POINT  (DOMContentLoaded)
   3.  PAGE INITIALIZERS
       3a. initCarsPage
       3b. initRepairPage
   4.  AUTH UI
       4a. Panel / popup toggle
       4b. Tab switching
       4c. Toast notifications
       4d. Password toggle
       4e. Field error helpers
       4f. Loading state helper
       4g. loginUser
       4h. registerUser
       4i. updateLoggedInUserUI / logoutUser
       4j. showSuccessPopup
       4k. initAuthUI
   5.  CARS
       5a. loadCars
       5b. displayCars
       5c. updateCount
       5d. initTypeFilter
       5e. initPriceFilter
   6.  BOOKING MODAL
       6a. generateMathQuestion
       6b. openBooking / closeBooking
       6c. setBookingError / clearBookingErrors
       6d. validateBookingForm
       6e. initBookingForm
   7.  BACK TO TOP
   8.  FAQ ACCORDION
   9.  AI CHAT MODAL
       9a. openAI / closeAI / initAIModal
       9b. appendMsg / appendTyping
       9c. sendAI / askAI
       9d. getFallbackAnswer
   10. EMI CALCULATOR
   11. YEAR PICKER
   12. PHONE COUNTER
   13. SELL FORM
   14. CONFIRM MODAL
   15. BOOKED STICKERS
   ============================================================ */


/* ============================================================
   1. GLOBAL STATE
   ============================================================ */

let allCars = [];
let authPanelOpen = false;
let correctMathAnswer = 0;


/* ============================================================
   2. ENTRY POINT
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initAuthUI();
  initBackToTop();
  initFaqAccordion();
  initCarsPage();
  initRepairPage();
  initAIModal();
  initBookingForm();
  initYearCalendar();
  initPhoneCounter();
  initSellForm();
  initBookedStickers();
});


/* ============================================================
   3. PAGE INITIALIZERS
   ============================================================ */

/* 3a. Cars page -------------------------------------------- */
function initCarsPage() {
  const carContainer = document.getElementById("carContainer");
  if (!carContainer) return;

  loadCars();
  initTypeFilter();
  initPriceFilter();
}

/* 3b. Repair page ------------------------------------------ */
function initRepairPage() {
  const repairFilter = document.getElementById("repairFilter");
  const repairSearch = document.getElementById("repairSearch");
  const aiModal = document.getElementById("aiModal");

  if (repairFilter) {
    repairFilter.addEventListener("change", function () {
      const selected = this.value;
      document.querySelectorAll(".rcard").forEach((card) => {
        const service = card.dataset.service || "";
        card.style.display =
          selected === "all" || service.includes(selected) ? "" : "none";
      });
    });
  }

  if (repairSearch) {
    repairSearch.addEventListener("input", function () {
      const query = this.value.toLowerCase();
      document.querySelectorAll(".rcard").forEach((card) => {
        card.style.display = card.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
  }

  if (aiModal) {
    aiModal.addEventListener("click", (e) => {
      if (e.target === aiModal) closeAI();
    });
  }
}


/* ============================================================
   4. AUTH UI
   ============================================================ */

/* 4a. Panel / popup toggle --------------------------------- */
function openAuthPopup() {
  const popup = document.getElementById("authPopupOverlay");
  if (popup) {
    popup.classList.remove("hidden");
    switchAuthTab("popup", "login");
  }
}

function closeAuthPopup() {
  const popup = document.getElementById("authPopupOverlay");
  if (popup) popup.classList.add("hidden");
}


function toggleAuthPanel() {
  authPanelOpen = !authPanelOpen;

  const panel = document.getElementById("authSlidePanel");
  const btn = document.getElementById("lsUserBtn");

  if (panel) panel.classList.toggle("open", authPanelOpen);
  if (btn) btn.classList.toggle("panel-open", authPanelOpen);
}

/* 4b. Tab switching ---------------------------------------- */
function switchAuthTab(scope, tab) {
  const pre = scope === "popup" ? "pp" : "sp";

  const loginBox    = document.getElementById(`${pre}-login`);
  const registerBox = document.getElementById(`${pre}-register`);
  const loginTab    = document.getElementById(`${pre}-tab-l`);
  const registerTab = document.getElementById(`${pre}-tab-r`);

  if (loginBox)    loginBox.classList.toggle("hidden", tab !== "login");
  if (registerBox) registerBox.classList.toggle("hidden", tab !== "register");
  if (loginTab)    loginTab.classList.toggle("active", tab === "login");
  if (registerTab) registerTab.classList.toggle("active", tab === "register");
}

/* 4c. Toast notifications ---------------------------------- */
function showToast(msg, isError = false) {
  let toast = document.getElementById("authToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "authToast";
    toast.className = "auth-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.borderLeftColor = isError ? "#e53e1e" : "#22c55e";
  toast.classList.add("show");

  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

/* 4d. Password toggle -------------------------------------- */
function togglePass(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";

  if (btn) btn.classList.toggle("active", isHidden);

  if (btn) {
    btn.innerHTML = isHidden
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
           <line x1="1" y1="1" x2="23" y2="23"/>
         </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
           <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
           <circle cx="12" cy="12" r="3"/>
         </svg>`;
  }
}

/* 4e. Field error helpers ---------------------------------- */
function showErr(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;

  el.textContent = msg;
  el.classList.toggle("show", !!msg);

  const field = el.closest(".auth-field");
  const input = field ? field.querySelector("input") : null;

  if (input) {
    input.classList.toggle("has-error", !!msg);
    input.classList.toggle("has-success", !msg && input.value.trim() !== "");
  }
}

function clearErrors(prefix) {
  document.querySelectorAll(`[id^="${prefix}"]`).forEach((el) => {
    if (el.classList.contains("field-error")) {
      el.textContent = "";
      el.classList.remove("show");
    }
    if (el.tagName === "INPUT") {
      el.classList.remove("has-error", "has-success");
    }
  });
}

/* 4f. Loading state helper --------------------------------- */
function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;

  btn.classList.toggle("loading", loading);

  const text    = btn.querySelector(".btn-text");
  const spinner = btn.querySelector(".btn-spinner");

  if (text)    text.classList.toggle("hidden", loading);
  if (spinner) spinner.classList.toggle("hidden", !loading);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* 4g. loginUser -------------------------------------------- */
async function loginUser() {
  const popup       = document.getElementById("authPopupOverlay");
  const isPopupOpen = popup && !popup.classList.contains("hidden");
  const pre         = isPopupOpen ? "pp-login" : "sp-login";
  const btnId       = `${pre}-btn`;

  clearErrors(pre);

  let email    = document.getElementById(`${pre}-email`)?.value || "";
  let password = document.getElementById(`${pre}-pass`)?.value || "";

  email    = email.trim();
  password = password.trim();

  let valid = true;

  if (!email) {
    showErr(`${pre}-email-err`, "Email is required");
    valid = false;
  } else if (!validateEmail(email)) {
    showErr(`${pre}-email-err`, "Enter a valid email address");
    valid = false;
  }

  if (!password) {
    showErr(`${pre}-pass-err`, "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showErr(`${pre}-pass-err`, "Password must be at least 6 characters");
    valid = false;
  }

  if (!valid) return;

  setLoading(btnId, true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    setLoading(btnId, false);

    if (data.success) {
      localStorage.setItem("autodrive_user", JSON.stringify(data.user));
      showSuccessPopup("Login Successful");
      updateLoggedInUserUI(data.user);

      closeAuthPopup();

      const panel = document.getElementById("authSlidePanel");
      const btn   = document.getElementById("lsUserBtn");

      if (panel) panel.classList.remove("open");
      if (btn)   btn.classList.remove("panel-open");
      authPanelOpen = false;
    } else {
      // ── Fallback: check locally-stored password (handles password changes) ──
      const localUsers = JSON.parse(localStorage.getItem('ad_users') || '{}');
      const localUser  = localUsers[email];
      if (localUser && localUser.password && localUser.password === btoa(password)) {
        // Local password matches — log in with local profile data
        const syntheticUser = {
          email,
          name: [localUser.firstName, localUser.lastName].filter(Boolean).join(' ') || email,
          phone: localUser.phone || ''
        };
        localStorage.setItem("autodrive_user", JSON.stringify(syntheticUser));
        showSuccessPopup("Login Successful");
        updateLoggedInUserUI(syntheticUser);
        closeAuthPopup();
        const panel = document.getElementById("authSlidePanel");
        const btn   = document.getElementById("lsUserBtn");
        if (panel) panel.classList.remove("open");
        if (btn)   btn.classList.remove("panel-open");
        authPanelOpen = false;
      } else {
        showErr(`${pre}-pass-err`, data.message || "Invalid email or password");
        showToast(data.message || "Login failed", true);
      }
    }
  } catch (error) {
    setLoading(btnId, false);
    // ── Network error — try local password as full fallback ──
    const localUsers = JSON.parse(localStorage.getItem('ad_users') || '{}');
    const localUser  = localUsers[email];
    if (localUser && localUser.password && localUser.password === btoa(password)) {
      const syntheticUser = {
        email,
        name: [localUser.firstName, localUser.lastName].filter(Boolean).join(' ') || email,
        phone: localUser.phone || ''
      };
      localStorage.setItem("autodrive_user", JSON.stringify(syntheticUser));
      showSuccessPopup("Login Successful");
      updateLoggedInUserUI(syntheticUser);
      closeAuthPopup();
      const panel = document.getElementById("authSlidePanel");
      const btn   = document.getElementById("lsUserBtn");
      if (panel) panel.classList.remove("open");
      if (btn)   btn.classList.remove("panel-open");
      authPanelOpen = false;
    } else {
      showToast("Server error. Make sure backend is running.", true);
    }
  }
}

/* 4h. registerUser ----------------------------------------- */
async function registerUser() {
  const popup       = document.getElementById("authPopupOverlay");
  const isPopupOpen = popup && !popup.classList.contains("hidden");
  const pre         = isPopupOpen ? "pp-reg" : "sp-reg";
  const btnId       = `${pre}-btn`;

  clearErrors(pre);

  let name     = document.getElementById(`${pre}-name`)?.value  || "";
  let email    = document.getElementById(`${pre}-email`)?.value || "";
  let phone    = document.getElementById(`${pre}-phone`)?.value || "";
  let password = document.getElementById(`${pre}-pass`)?.value  || "";

  name     = name.trim();
  email    = email.trim();
  phone    = phone.trim();
  password = password.trim();

  let valid = true;

  if (!name) {
    showErr(`${pre}-name-err`, "Full name is required");
    valid = false;
  }

  if (!email) {
    showErr(`${pre}-email-err`, "Email is required");
    valid = false;
  } else if (!validateEmail(email)) {
    showErr(`${pre}-email-err`, "Enter a valid email address");
    valid = false;
  }

  if (!phone) {
    showErr(`${pre}-phone-err`, "Phone number is required");
    valid = false;
  } else if (phone.replace(/\D/g, "").length !== 10) {
    showErr(`${pre}-phone-err`, "Enter a valid 10-digit number");
    valid = false;
  }

  if (!password) {
    showErr(`${pre}-pass-err`, "Password is required");
    valid = false;
  } else if (password.length < 6) {
    showErr(`${pre}-pass-err`, "Min. 6 characters required");
    valid = false;
  }

  if (!valid) return;

  setLoading(btnId, true);

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password })
    });

    const data = await res.json();
    setLoading(btnId, false);

    if (data.success) {
      showSuccessPopup("Registration Successful");
      showToast("Account created! Please sign in.", false);
      switchAuthTab(isPopupOpen ? "popup" : "slide", "login");
    } else {
      showErr(`${pre}-email-err`, data.message || "Registration failed");
      showToast(data.message || "Registration failed", true);
    }
  } catch (error) {
    setLoading(btnId, false);
    showToast("Server error. Make sure backend is running.", true);
  }
}

/* 4i. updateLoggedInUserUI / logoutUser -------------------- */
function updateLoggedInUserUI(user) {
  const userInfo  = document.getElementById("userInfo");
  const loginBtn  = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userInfo)  userInfo.textContent = `Welcome, ${user.name || user.email || "User"}`;
  if (loginBtn)  loginBtn.style.display = "none";
  if (logoutBtn) logoutBtn.style.display = "inline-block";
}

function logoutUser() {
  localStorage.removeItem("autodrive_user");

  const userInfo  = document.getElementById("userInfo");
  const loginBtn  = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userInfo)  userInfo.textContent = "Not Logged In";
  if (loginBtn)  loginBtn.style.display = "inline-block";
  if (logoutBtn) logoutBtn.style.display = "none";

  showToast("Logged out successfully");
}

/* 4j. showSuccessPopup ------------------------------------- */
function showSuccessPopup(message, bookingData) {
  const popup = document.getElementById("successPopup");
  if (!popup) return;

  // Fill in booking details if provided
  if (bookingData) {
    const date = bookingData.booking_date
      ? new Date(bookingData.booking_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—';
    const car  = document.getElementById('sd-car');
    const dt   = document.getElementById('sd-date');
    const tm   = document.getElementById('sd-time');
    const city = document.getElementById('sd-city');
    if (car)  car.textContent  = bookingData.car           || '—';
    if (dt)   dt.textContent   = date;
    if (tm)   tm.textContent   = bookingData.booking_time  || '—';
    if (city) city.textContent = bookingData.city          || '—';
  }

  popup.style.display = "flex";
}

/* 4k. initAuthUI ------------------------------------------- */
function initAuthUI() {
  const popupOverlay = document.getElementById("authPopupOverlay");
  const slidePanel   = document.getElementById("authSlidePanel");
  const userBtn      = document.getElementById("lsUserBtn");

  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) closeAuthPopup();
    });
  }

  document.addEventListener("click", (e) => {
    if (!authPanelOpen || !slidePanel || !userBtn) return;
    if (!slidePanel.contains(e.target) && !userBtn.contains(e.target)) {
      authPanelOpen = false;
      slidePanel.classList.remove("open");
      userBtn.classList.remove("panel-open");
    }
  });

  const savedUser = localStorage.getItem("autodrive_user");
  if (savedUser) {
    try {
      updateLoggedInUserUI(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("autodrive_user");
    }
  }
}


/* ============================================================
   5. CARS
   ============================================================ */

/* 5a. loadCars --------------------------------------------- */
async function loadCars() {
  try {
    const response = await fetch("http://localhost:5000/api/cars");
    const cars     = await response.json();

    allCars = cars;

    // On homepage (index.html) — show only 3 newest cars
    const isHomepage = window.location.pathname.includes('index') ||
                       window.location.pathname === '/' ||
                       window.location.pathname.endsWith('/');

    if (isHomepage) {
      const newest4 = [...cars].reverse().slice(0, 4);
      displayCars(newest4);
      updateCount(cars.length);

      // Add "View All Cars" button if not already there
      if (!document.getElementById('viewAllCarsBtn')) {
        const container = document.getElementById('carContainer');
        const btnWrap = document.createElement('div');
        btnWrap.style.cssText = 'width:100%;text-align:center;margin-top:10px;padding-bottom:10px;';
        btnWrap.innerHTML = `
          <a href="buy.html" id="viewAllCarsBtn" style="
            display: inline-block;
            background: linear-gradient(135deg, #e63946, #c1121f);
            color: white;
            padding: 14px 40px;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 600;
            text-decoration: none;
            font-family: 'Poppins', sans-serif;
            transition: opacity 0.2s, transform 0.15s;
            box-shadow: 0 4px 16px rgba(230,57,70,0.3);
          "
          onmouseover="this.style.opacity='0.9';this.style.transform='translateY(-2px)'"
          onmouseout="this.style.opacity='1';this.style.transform='translateY(0)'"
          >View All Cars →</a>
        `;
        if (container && container.parentNode) {
          container.parentNode.insertBefore(btnWrap, container.nextSibling);
        }
      }
    } else {
      displayCars(cars);
      updateCount(cars.length);
    }
  } catch (error) {
    console.error("Error loading cars:", error);
    const container = document.getElementById("carContainer");
    if (container) {
      container.innerHTML = `
        <p style="text-align:center;color:#ff3b3b;">
          Failed to load cars. Make sure your server is running.
        </p>
      `;
    }
  }
}

/* 5b. displayCars ------------------------------------------ */
function displayCars(cars) {
  const container = document.getElementById("carContainer");
  if (!container) return;

  container.innerHTML = "";

  if (!cars.length) {
    container.innerHTML = `
      <p style="text-align:center;color:#64748b;grid-column:1/-1;padding:40px;">
        No cars found for this filter.
      </p>
    `;
    return;
  }

  const savedCars = getSavedCars();

  cars.forEach((car) => {
    const safeName = String(car.name || "").replace(/'/g, "\\'");
    const isSaved = savedCars.some(s => s.name === car.name);

    container.innerHTML += `
      <div class="car-card" data-type="${(car.type || "").toLowerCase()}" data-price="${car.price}">
        <div class="car-card-img-wrap">
          <img src="../${car.image}" alt="${car.name}" onerror="this.src='../images/placeholder.png'">
          <button class="save-car-btn ${isSaved ? 'saved' : ''}" onclick="toggleSaveCar(this, '${safeName}', '${car.year || 'N/A'}', '${car.type || 'Car'}', '${car.fuel || 'Petrol'}', '${car.price}', '../${car.image}')" title="${isSaved ? 'Remove from saved' : 'Save car'}">
            <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="car-card-body">
          <h3>${car.name}</h3>
          <div class="car-meta">
            <span>📅 ${car.year || "N/A"}</span>
            <span>🚗 ${car.type || "Car"}</span>
            <span>⛽ ${car.fuel || "Petrol"}</span>
          </div>
          <div class="car-price">₹${Number(car.price).toLocaleString("en-IN")}</div>
          <button onclick="openBooking('${safeName}')" class="book-btn">Book Now</button>
        </div>
      </div>
    `;
  });
}

/* 5c. updateCount ------------------------------------------ */
function updateCount(count) {
  const countEl = document.getElementById("carsCount");
  if (countEl) countEl.innerText = `${count} cars available`;
}

/* 5d. initTypeFilter --------------------------------------- */
function initTypeFilter() {
  const filterType = document.getElementById("filterType");
  if (!filterType) return;

  filterType.addEventListener("change", function () {
    const selected = this.value.toLowerCase();

    const filtered =
      selected === "all"
        ? allCars
        : allCars.filter((car) => (car.type || "").toLowerCase() === selected);

    displayCars(filtered);
    updateCount(filtered.length);
  });
}

/* 5e. initPriceFilter -------------------------------------- */
function initPriceFilter() {
  const priceRange = document.getElementById("priceRange");
  const priceValue = document.getElementById("priceValue");

  if (!priceRange) return;

  priceRange.addEventListener("input", function () {
    if (priceValue) priceValue.innerText = this.value;

    const filtered = allCars.filter((car) => Number(car.price) <= Number(this.value));
    displayCars(filtered);
    updateCount(filtered.length);
  });
}


/* ============================================================
   6. BOOKING MODAL
   ============================================================ */

/* 6a. generateMathQuestion --------------------------------- */
function generateMathQuestion() {
  const num1      = Math.floor(Math.random() * 9) + 1;
  const num2      = Math.floor(Math.random() * 9) + 1;
  const operators = ["+", "-"];
  const operator  = operators[Math.floor(Math.random() * operators.length)];

  correctMathAnswer = operator === "+" ? num1 + num2 : num1 - num2;

  const mathQuestion = document.getElementById("mathQuestion");
  if (mathQuestion) mathQuestion.textContent = `${num1} ${operator} ${num2}`;

  const mathAnswer = document.getElementById("mathAnswer");
  if (mathAnswer) mathAnswer.value = "";
}

/* 6b. openBooking / closeBooking --------------------------- */
function openBooking(carName) {

  // ── AUTH GUARD: must be logged in to book ──
  const loggedInUser = localStorage.getItem("autodrive_user");
  if (!loggedInUser) {
    // Show the auth popup if it exists, otherwise open the slide panel
    const popup = document.getElementById("authPopupOverlay");
    if (popup) {
      popup.classList.remove("hidden");
      switchAuthTab("popup", "login");
    } else {
      // Open slide panel and switch to login tab
      authPanelOpen = true;
      const panel = document.getElementById("authSlidePanel");
      const btn   = document.getElementById("lsUserBtn");
      if (panel) panel.classList.add("open");
      if (btn)   btn.classList.add("panel-open");
      switchAuthTab("slide", "login");
    }
    showToast("Please login or register to book a car.", true);
    return; // Stop — do NOT open the booking modal
  }

  const bookingModal    = document.getElementById("bookingModal");
  const bookingForm     = document.getElementById("bookingForm");
  const carNameInput    = document.getElementById("carName");
  const selectedCarText = document.getElementById("selectedCarText");
  const bookingDate     = document.getElementById("bookingDate");
  const bookingTimeValue = document.getElementById("bookingTimeValue");
  const selectedTimeText = document.getElementById("selectedTimeText");

  if (bookingForm) bookingForm.reset();

  document.querySelectorAll(".time-slot").forEach((btn) => btn.classList.remove("active"));

  if (bookingTimeValue) bookingTimeValue.value = "";
  if (selectedTimeText) selectedTimeText.textContent = "No time selected";
  if (carNameInput)     carNameInput.value = carName || "";
  if (selectedCarText)  selectedCarText.textContent = carName || "No car selected";

  if (bookingDate) {
    bookingDate.min = new Date().toISOString().split("T")[0];
  }

  clearBookingErrors();
  generateMathQuestion();

  if (bookingModal) bookingModal.style.display = "flex";
}

function closeBooking() {
  const bookingModal = document.getElementById("bookingModal");
  if (bookingModal) bookingModal.style.display = "none";
}

/* 6c. setBookingError / clearBookingErrors ----------------- */
function setBookingError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);

  if (input) input.classList.toggle("booking-input-error", !!message);
  if (error) error.textContent = message || "";
}

function clearBookingErrors() {
  const fields = [
    ["bookingFirstName", "bookingFirstNameError"],
    ["bookingLastName",  "bookingLastNameError"],
    ["bookingPhone",     "bookingPhoneError"],
    ["bookingEmail",     "bookingEmailError"],
    ["bookingAddress1",  "bookingAddress1Error"],
    ["bookingCity",      "bookingCityError"],
    ["bookingState",     "bookingStateError"],
    ["bookingZip",       "bookingZipError"],
    ["bookingDate",      "bookingDateError"]
  ];

  fields.forEach(([inputId, errorId]) => setBookingError(inputId, errorId, ""));

  ["bookingTimeError", "bookingVehicleTypeError", "mathAnswerError"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

/* 6d. validateBookingForm ---------------------------------- */
function validateBookingForm(data) {
  let valid = true;
  clearBookingErrors();

  if (!data.first_name.trim()) {
    setBookingError("bookingFirstName", "bookingFirstNameError", "First name is required");
    valid = false;
  }

  if (!data.last_name.trim()) {
    setBookingError("bookingLastName", "bookingLastNameError", "Last name is required");
    valid = false;
  }

  if (!/^[0-9]{10}$/.test(data.phone)) {
    setBookingError("bookingPhone", "bookingPhoneError", "Enter valid 10-digit phone number");
    valid = false;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    setBookingError("bookingEmail", "bookingEmailError", "Enter valid email");
    valid = false;
  }

  if (!data.address1.trim()) {
    setBookingError("bookingAddress1", "bookingAddress1Error", "Street address is required");
    valid = false;
  }

  if (!data.city.trim()) {
    setBookingError("bookingCity", "bookingCityError", "City is required");
    valid = false;
  }

  if (!data.state.trim()) {
    setBookingError("bookingState", "bookingStateError", "State is required");
    valid = false;
  }

  if (!data.zip.trim()) {
    setBookingError("bookingZip", "bookingZipError", "Zip code is required");
    valid = false;
  }

  if (!data.vehicle_type) {
    const el = document.getElementById("bookingVehicleTypeError");
    if (el) el.textContent = "Please select vehicle type";
    valid = false;
  }

  if (!data.booking_date) {
    setBookingError("bookingDate", "bookingDateError", "Please select a date");
    valid = false;
  }

  if (!data.booking_time) {
    const el = document.getElementById("bookingTimeError");
    if (el) el.textContent = "Please select a time";
    valid = false;
  }

  if (!data.math_answer || parseInt(data.math_answer, 10) !== correctMathAnswer) {
    const el = document.getElementById("mathAnswerError");
    if (el) el.textContent = "Wrong answer";
    valid = false;
  }

  if (!data.car) {
    alert("No car selected");
    valid = false;
  }

  return valid;
}

/* 6e. initBookingForm -------------------------------------- */
function initBookingForm() {
  const bookingModal     = document.getElementById("bookingModal");
  const bookingForm      = document.getElementById("bookingForm");
  const bookingPhone     = document.getElementById("bookingPhone");
  const refreshMath      = document.getElementById("refreshMath");
  const bookingTimeValue = document.getElementById("bookingTimeValue");

  if (bookingModal) {
    bookingModal.addEventListener("click", (e) => {
      if (e.target === bookingModal) closeBooking();
    });
  }

  if (bookingPhone) {
    bookingPhone.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, 10);
    });
  }

  document.querySelectorAll(".time-slot").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".time-slot").forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      const selectedTime = this.dataset.time;
      if (bookingTimeValue) bookingTimeValue.value = selectedTime;

      const selectedTimeText = document.getElementById("selectedTimeText");
      if (selectedTimeText) selectedTimeText.textContent = selectedTime;

      const timeError = document.getElementById("bookingTimeError");
      if (timeError) timeError.textContent = "";
    });
  });

  if (refreshMath) {
    refreshMath.addEventListener("click", generateMathQuestion);
  }

  if (!bookingForm) return;

  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    const data = {
      first_name:   (formData.get("first_name")   || "").trim(),
      last_name:    (formData.get("last_name")     || "").trim(),
      phone:        (formData.get("phone")         || "").trim(),
      email:        (formData.get("email")         || "").trim(),
      address1:     (formData.get("address1")      || "").trim(),
      address2:     (formData.get("address2")      || "").trim(),
      city:         (formData.get("city")          || "").trim(),
      state:        (formData.get("state")         || "").trim(),
      zip:          (formData.get("zip")           || "").trim(),
      vehicle_type: (formData.get("vehicle_type")  || "").trim(),
      booking_date: (formData.get("booking_date")  || "").trim(),
      booking_time: (formData.get("booking_time")  || "").trim(),
      math_answer:  (document.getElementById("mathAnswer")?.value || "").trim(),
      car:          (formData.get("car")           || "").trim()
    };

    if (!validateBookingForm(data)) return;

    try {
      const res    = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (result.success) {
        closeBooking();
        showSuccessPopup("Booking Successful!", data);
        storeBookingLocally(data, result.booking?._id || result._id || result.id || null);
        this.reset();

        document.querySelectorAll(".time-slot").forEach((b) => b.classList.remove("active"));

        const selectedTimeText = document.getElementById("selectedTimeText");
        if (selectedTimeText) selectedTimeText.textContent = "No time selected";
        if (bookingTimeValue)  bookingTimeValue.value = "";

        clearBookingErrors();
        generateMathQuestion();
      } else {
        alert(result.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    }
  });
}


/* ============================================================
   7. BACK TO TOP
   ============================================================ */

function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");
  const leftSideBtns = document.querySelector(".left-side-btns");

  if (!backToTopBtn && !leftSideBtns) return;

  let lastScrollY = 0;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", currentScrollY > 300);
    }

    if (leftSideBtns) {
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        leftSideBtns.classList.add("hidden-on-scroll");
      } else {
        leftSideBtns.classList.remove("hidden-on-scroll");
      }
    }

    lastScrollY = currentScrollY;
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}


/* ============================================================
   8. FAQ ACCORDION
   ============================================================ */

function initFaqAccordion() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      if (item) item.classList.toggle("open");
    });
  });
}


/* ============================================================
   9. AI CHAT MODAL
   ============================================================ */

/* 9a. openAI / closeAI / initAIModal ----------------------- */
function openAI() {
  const modal = document.getElementById("aiModal");
  if (modal) modal.classList.add("open");
}

function closeAI() {
  const modal = document.getElementById("aiModal");
  if (modal) modal.classList.remove("open");
}

function initAIModal() {
  const modal = document.getElementById("aiModal");
  if (!modal) return;

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeAI();
  });
}

/* 9b. appendMsg / appendTyping ----------------------------- */
function appendMsg(text, who) {
  const messages = document.getElementById("aiMessages");
  if (!messages) return;

  const div = document.createElement("div");
  div.className = `ai-msg ${who}`;
  div.innerHTML = `<div class="ai-bubble">${text}</div>`;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function appendTyping() {
  const messages = document.getElementById("aiMessages");
  if (!messages) return null;

  const div = document.createElement("div");
  div.className = "ai-msg bot typing-indicator";
  div.innerHTML = `<div class="ai-bubble"><span></span><span></span><span></span></div>`;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  return div;
}

/* 9c. sendAI / askAI --------------------------------------- */
function sendAI() {
  const input = document.getElementById("aiInput");
  if (!input) return;

  const question = input.value.trim();
  if (!question) return;

  askAI(question);
  input.value = "";
}

function askAI(question) {
  appendMsg(question, "user");

  const input = document.getElementById("aiInput");
  if (input) input.value = "";

  const typing = appendTyping();

  setTimeout(() => {
    if (typing) typing.remove();
    appendMsg(getFallbackAnswer(question), "bot");
  }, 700);
}

/* 9d. getFallbackAnswer ------------------------------------ */
function getFallbackAnswer(question) {
  const q = question.toLowerCase();

  if (q.includes("maruti") || q.includes("swift") || q.includes("baleno") || q.includes("wagonr")) {
    return `For Maruti vehicles, I recommend <strong>Punjab Motors Service</strong> on Ferozepur Road, Model Town — they specialise in Maruti, Hyundai & Honda. Call them at <strong>+91 9780000000</strong>.`;
  }

  if (q.includes("hyundai") || q.includes("i20") || q.includes("creta") || q.includes("verna")) {
    return `For Hyundai cars, <strong>Star Auto Workshop</strong> in Salem Tabri is excellent for Hyundai & suspension work. Reach them at <strong>+91 9888000000</strong>. Punjab Motors also handles Hyundai — <strong>+91 9780000000</strong>.`;
  }

  if (q.includes("kia") || q.includes("seltos") || q.includes("sonet") || q.includes("toyota") || q.includes("hybrid")) {
    return `For Kia/Toyota or premium cars, <strong>DriveRight Service Hub</strong> on Pakhowal Road near BRS Nagar is your best choice. Call: <strong>+91 9876000000</strong>.`;
  }

  if (q.includes("ac") || q.includes("air condition") || q.includes("cooling")) {
    return `For AC issues, head to <strong>Sharma Auto Works</strong> on GT Road near Civil Hospital — they specialise in AC repair and engine work for all brands. Call: <strong>+91 9814000000</strong>.`;
  }

  if (q.includes("engine") || q.includes("overhaul") || q.includes("oil")) {
    return `For engine overhaul or oil service, <strong>Sharma Auto Works</strong> on GT Road is the best in Ludhiana for multi-brand engine work. Call: <strong>+91 9814000000</strong>.`;
  }

  if (q.includes("dent") || q.includes("scratch") || q.includes("paint") || q.includes("body")) {
    return `For denting, scratches or paint work, <strong>QuickFix Auto Care</strong> in Dugri Phase 2 is the go-to. Contact: <strong>+91 9646000000</strong>.`;
  }

  if (q.includes("electric") || q.includes("wiring") || q.includes("battery") || q.includes("light")) {
    return `For electrical issues, <strong>QuickFix Auto Care</strong> in Dugri Phase 2 handles car electrics and detailing. Call: <strong>+91 9646000000</strong>.`;
  }

  if (q.includes("ppf") || q.includes("film") || q.includes("ceramic") || q.includes("coat") || q.includes("3m")) {
    return `For PPF, 3M films or ceramic coating, <strong>Elite Motor Garage</strong> in Sarabha Nagar is the premium choice. Call: <strong>+91 9855000000</strong>.`;
  }

  if (q.includes("tyre") || q.includes("tire") || q.includes("wheel") || q.includes("alignment")) {
    return `For tyre replacement or wheel alignment, <strong>Sharma Auto Works</strong> on GT Road covers tyres for all brands. Call: <strong>+91 9814000000</strong>.`;
  }

  if (q.includes("suspension") || q.includes("shock") || q.includes("brake")) {
    return `For suspension, shocks or brake work, <strong>Star Auto Workshop</strong> in Salem Tabri specialises in this. Call: <strong>+91 9888000000</strong>.`;
  }

  if (q.includes("honda") || q.includes("city") || q.includes("amaze")) {
    return `For Honda vehicles, <strong>Punjab Motors Service</strong> on Ferozepur Road handles Honda servicing. Call: <strong>+91 9780000000</strong>.`;
  }

  return `For general car needs, I'd recommend <strong>Sharma Auto Works</strong> (GT Road — <strong>+91 9814000000</strong>) for multi-brand service, or tell me your car model and issue for a more specific recommendation!`;
}


/* ============================================================
   10. EMI CALCULATOR
   ============================================================ */

function calculateEMI() {
  const price   = parseFloat(document.getElementById("carPrice")?.value);
  const rate    = parseFloat(document.getElementById("interestRate")?.value);
  let   tenure  = parseFloat(document.getElementById("loanTenure")?.value);

  const resultEl  = document.getElementById("emiResult");
  const resultBox = document.getElementById("emiResultBox");

  if (isNaN(price) || isNaN(rate) || isNaN(tenure) || tenure <= 0) {
    if (resultEl)  resultEl.innerText = "Please enter valid numbers!";
    if (resultBox) resultBox.style.display = "inline-block";
    return;
  }

  tenure = tenure * 12;

  if (rate === 0) {
    if (resultEl)  resultEl.innerText = `Monthly EMI: ₹ ${(price / tenure).toFixed(2)}`;
    if (resultBox) resultBox.style.display = "inline-block";
    return;
  }

  const monthlyRate = rate / 100 / 12;
  const emi =
    (price * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);

  if (resultEl) {
    resultEl.innerText = isNaN(emi)
      ? "Calculation error!"
      : `Monthly EMI: ₹ ${Math.round(emi).toLocaleString("en-IN")}`;
  }

  if (resultBox) resultBox.style.display = "inline-block";
}


/* ============================================================
   11. YEAR PICKER
   ============================================================ */

function initYearCalendar() {
  const input    = document.getElementById("year");
  const calendar = document.getElementById("yearCalendar");
  const grid     = document.getElementById("yearGrid");
  const rangeEl  = document.getElementById("calRange");
  const prevBtn  = document.getElementById("calPrev");
  const nextBtn  = document.getElementById("calNext");

  if (!input || !calendar || !grid || !rangeEl || !prevBtn || !nextBtn) return;

  const CURRENT_YEAR = new Date().getFullYear();
  const MIN_YEAR     = 1980;
  const PAGE_SIZE    = 16;

  let pageStart    = Math.floor((CURRENT_YEAR - MIN_YEAR) / PAGE_SIZE) * PAGE_SIZE + MIN_YEAR;
  let selectedYear = null;

  function renderGrid() {
    grid.innerHTML = "";
    rangeEl.textContent = `${pageStart} – ${pageStart + PAGE_SIZE - 1}`;
    prevBtn.disabled = pageStart <= MIN_YEAR;
    nextBtn.disabled = pageStart + PAGE_SIZE > CURRENT_YEAR;

    for (let y = pageStart; y < pageStart + PAGE_SIZE; y++) {
      const cell = document.createElement("div");
      cell.className = "year-cell";
      cell.textContent = y;

      if (y > CURRENT_YEAR || y < MIN_YEAR) {
        cell.classList.add("disabled");
      } else {
        if (y === selectedYear) cell.classList.add("selected");

        cell.addEventListener("click", () => {
          selectedYear = y;
          input.value  = y;
          closeCalendar();
        });
      }

      grid.appendChild(cell);
    }
  }

  function openCalendar()  { calendar.classList.add("open");    renderGrid(); }
  function closeCalendar() { calendar.classList.remove("open"); }

  input.addEventListener("click", (e) => {
    e.stopPropagation();
    calendar.classList.contains("open") ? closeCalendar() : openCalendar();
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    pageStart = Math.max(MIN_YEAR, pageStart - PAGE_SIZE);
    renderGrid();
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (pageStart + PAGE_SIZE <= CURRENT_YEAR) {
      pageStart += PAGE_SIZE;
      renderGrid();
    }
  });

  document.addEventListener("click", (e) => {
    if (!calendar.contains(e.target) && e.target !== input) closeCalendar();
  });
}


/* ============================================================
   12. PHONE COUNTER
   ============================================================ */

function initPhoneCounter() {
  const phoneInput    = document.getElementById("phone");
  const phoneCounter  = document.getElementById("phoneCounter");

  if (!phoneInput || !phoneCounter) return;

  phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);

    const len = this.value.length;
    phoneCounter.className = "phone-counter";
    phoneCounter.style.color = "";

    if (len === 10) {
      phoneCounter.textContent = "✔ 10 / 10";
      phoneCounter.style.color = "#11998e";
    } else {
      phoneCounter.textContent = `${len} / 10`;
    }
  });
}


/* ============================================================
   13. SELL FORM
   ============================================================ */

function initSellForm() {
  const sellForm = document.getElementById("sellForm");
  if (!sellForm) return;

  /* --- Helpers --- */
  const $ = (id) => document.getElementById(id);

  const setErr = (id, msg) => {
    const el = $(id);
    if (!el) return;
    el.textContent = msg;
    const inp = el.closest(".form-group")?.querySelector("input,textarea");
    if (inp) {
      inp.classList.toggle("invalid", !!msg);
      inp.classList.toggle("valid",   !msg && inp.value.trim() !== "");
    }
  };

  const clearErr = (id) => setErr(id, "");

  /* --- Format helpers --- */
  const fmtPrice = (v) => {
    const n = parseInt(v, 10);
    return isNaN(n) ? "" : "₹ " + n.toLocaleString("en-IN");
  };

  const fmtKm = (v) => {
    const n = parseInt(v, 10);
    return isNaN(n) ? "" : n.toLocaleString("en-IN") + " km";
  };

  /* --- Step 1 validation --- */
  function validateStep1() {
    let ok    = true;
    const name  = $("ownerName")?.value.trim() || "";
    const phone = $("phone")?.value.trim()      || "";
    const email = $("email")?.value.trim()      || "";

    if (!name || name.length < 2) {
      setErr("err-ownerName", "Please enter your full name (min 2 chars)");
      ok = false;
    } else clearErr("err-ownerName");

    if (phone.length !== 10) {
      setErr("err-phone", "Enter a valid 10-digit mobile number");
      ok = false;
    } else clearErr("err-phone");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr("err-email", "Enter a valid email address");
      ok = false;
    } else clearErr("err-email");

    return ok;
  }

  /* --- Step 2 validation --- */
  function validateStep2() {
    let ok    = true;
    const car   = $("carName")?.value.trim()       || "";
    const year  = $("year")?.value.trim()          || "";
    const km    = $("kmDriven")?.value.trim()      || "";
    const price = $("expectedPrice")?.value.trim() || "";

    if (!car)                           { setErr("err-carName",       "Enter your car model");        ok = false; } else clearErr("err-carName");
    if (!year)                          { setErr("err-year",          "Select a manufacturing year"); ok = false; } else clearErr("err-year");
    if (!km || parseInt(km) < 0)        { setErr("err-kmDriven",      "Enter valid KM driven");       ok = false; } else clearErr("err-kmDriven");
    if (!price || parseInt(price) <= 0) { setErr("err-expectedPrice", "Enter an expected price");     ok = false; } else clearErr("err-expectedPrice");

    return ok;
  }

  /* --- Live validation --- */
  function liveValidate(inputId, errId, fn) {
    const el = $(inputId);
    if (!el) return;
    ["input", "blur"].forEach((ev) =>
      el.addEventListener(ev, () => {
        const msg = fn(el.value.trim());
        setErr(errId, msg);
        if (!msg && el.value.trim()) el.classList.add("valid");
      })
    );
  }

  liveValidate("ownerName", "err-ownerName", (v) => v.length < 2 ? "Name too short" : "");
  liveValidate("email",     "err-email",     (v) => v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Invalid email" : "");
  liveValidate("kmDriven",  "err-kmDriven",  (v) => v && parseInt(v) < 0 ? "Cannot be negative" : "");

  /* --- Price hint --- */
  const priceEl = $("expectedPrice");
  if (priceEl) {
    priceEl.addEventListener("input", function () {
      const hint = $("priceHint");
      const n    = parseInt(this.value);
      if (!hint || isNaN(n)) return;
      if (n < 50000)        { hint.textContent = "⚠ Price seems very low";  hint.className = "sf-price-hint"; }
      else if (n > 5000000) { hint.textContent = "⚠ Price seems very high"; hint.className = "sf-price-hint"; }
      else                  { hint.textContent = "✔ Looks good";            hint.className = "sf-price-hint good"; }
    });
  }

  /* --- Textarea counter --- */
  const descEl = $("description");
  if (descEl) {
    descEl.addEventListener("input", function () {
      const ctr = $("descCount");
      if (ctr) ctr.textContent = this.value.length;
    });
  }

  /* --- Step navigation --- */
  let currentStep = 1;
  const panels  = [null, $("sfPanel1"), $("sfPanel2"), $("sfPanel3")];
  const stepEls = document.querySelectorAll(".sf-step");
  const lineEls = document.querySelectorAll(".sf-step-line");

  function goTo(step) {
    panels[currentStep]?.classList.remove("active");
    currentStep = step;
    panels[currentStep]?.classList.add("active");

    stepEls.forEach((el, i) => {
      const s = i + 1;
      el.classList.toggle("active", s === currentStep);
      el.classList.toggle("done",   s < currentStep);
    });

    lineEls.forEach((el, i) => el.classList.toggle("done", i + 1 < currentStep));

    document.querySelector(".sell-form-right")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("btn-next-1")?.addEventListener("click", () => { if (validateStep1()) goTo(2); });
  $("btn-next-2")?.addEventListener("click", () => { if (validateStep2()) { populateReview(); goTo(3); } });
  $("btn-back-2")?.addEventListener("click", () => goTo(1));
  $("btn-back-3")?.addEventListener("click", () => goTo(2));

  /* --- Populate review panel --- */
  function populateReview() {
    const set = (id, val) => { const el = $(id); if (el) el.textContent = val || "—"; };
    set("rv-name",  $("ownerName")?.value.trim());
    set("rv-phone", $("phone")?.value.trim());
    set("rv-email", $("email")?.value.trim());
    set("rv-car",   $("carName")?.value.trim());
    set("rv-year",  $("year")?.value.trim());
    set("rv-km",    fmtKm($("kmDriven")?.value));
    set("rv-price", fmtPrice($("expectedPrice")?.value));

    const desc = $("description")?.value.trim();
    const ds   = $("rv-desc-section");
    if (ds) ds.style.display = desc ? "" : "none";
    const rd = $("rv-desc");
    if (rd) rd.textContent = desc;
  }

  /* --- Form submit --- */
  sellForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const agreed = $("agreeTerms")?.checked;
    if (!agreed) { setErr("err-terms", "Please confirm your details before submitting"); return; }
    clearErr("err-terms");

    const submitBtn = $("submitBtn");
    const btnText   = submitBtn?.querySelector(".btn-text");
    const spinner   = submitBtn?.querySelector(".btn-spinner");

    if (submitBtn) submitBtn.disabled = true;
    if (btnText)   btnText.style.display = "none";
    if (spinner)   spinner.style.display = "";

    const payload = {
      owner_name:     $("ownerName")?.value.trim(),
      phone:          $("phone")?.value.trim(),
      email:          $("email")?.value.trim(),
      car_name:       $("carName")?.value.trim(),
      year:           $("year")?.value.trim(),
      km_driven:      $("kmDriven")?.value.trim(),
      expected_price: $("expectedPrice")?.value.trim(),
      description:    $("description")?.value.trim()
    };

    try {
      const res  = await fetch("http://localhost:5000/api/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok || data.success) {
        showSuccess();
      } else {
        resetBtn();
        setErr("err-terms", data.error || data.message || "Submission failed. Please try again.");
      }
    } catch {
      // Backend offline — treat as success (graceful fallback)
      showSuccess();
    }
  });

  /* --- Show success state --- */
  function showSuccess() {
    const ref   = "AD-" + Date.now().toString(36).toUpperCase().slice(-6);
    const refEl = $("sfRefId");
    if (refEl) refEl.textContent = ref;

    // Send email notification to admin
    sendSellNotificationEmail({
      owner_name:     $("ownerName")?.value.trim(),
      phone:          $("phone")?.value.trim(),
      email:          $("email")?.value.trim(),
      car_name:       $("carName")?.value.trim(),
      year:           $("year")?.value.trim(),
      km_driven:      $("kmDriven")?.value.trim(),
      expected_price: $("expectedPrice")?.value.trim(),
      description:    $("description")?.value.trim(),
      ref_id:         ref
    });

    // Hide step panels without hiding the form itself
    ["sfPanel1", "sfPanel2", "sfPanel3"].forEach((id) => {
      const el = $(id);
      if (el) el.style.display = "none";
    });

    const progress = document.querySelector(".sf-progress");
    if (progress) progress.style.display = "none";

    const successEl = $("sfSuccess");
    if (successEl) successEl.style.display = "block";
  }

  /* --- Reset submit button --- */
  function resetBtn() {
    const submitBtn = $("submitBtn");
    const btnText   = submitBtn?.querySelector(".btn-text");
    const spinner   = submitBtn?.querySelector(".btn-spinner");
    if (submitBtn) submitBtn.disabled = false;
    if (btnText)   btnText.style.display = "";
    if (spinner)   spinner.style.display = "none";
  }
}


/* ============================================================
   14. CONFIRM MODAL
   ============================================================ */

function showConfirmModal(carName, onConfirm) {
  const overlay = document.createElement("div");
  overlay.className = "confirm-overlay";
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
             fill="none" stroke="#dc2626" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </div>
      <div class="confirm-title">Remove Booking?</div>
      <div class="confirm-message">
        Are you sure you want to remove the booking for
        <strong>"${carName}"</strong>?
        This action cannot be undone.
      </div>
      <div class="confirm-actions">
        <button class="confirm-btn confirm-btn-cancel">Cancel</button>
        <button class="confirm-btn confirm-btn-confirm">Yes, Remove</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("visible"));

  function close() {
    overlay.classList.remove("visible");
    setTimeout(() => overlay.remove(), 200);
  }

  overlay.querySelector(".confirm-btn-cancel").addEventListener("click", close);
  overlay.querySelector(".confirm-btn-confirm").addEventListener("click", () => {
    close();
    onConfirm();
  });
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  function onKeyDown(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", onKeyDown);
    }
  }
  document.addEventListener("keydown", onKeyDown);
}


/* ============================================================
   15. BOOKED STICKERS
   ============================================================ */

function initBookedStickers() {

  /* --- localStorage helpers --- */
  function getBookedCars() {
    try { return JSON.parse(localStorage.getItem("bookedCars") || "{}"); } catch { return {}; }
  }

  function saveBookedCar(name) {
    const booked = getBookedCars();
    const user   = JSON.parse(localStorage.getItem("autodrive_user") || "null");
    booked[name] = { bookedBy: user?.email || null };
    localStorage.setItem("bookedCars", JSON.stringify(booked));
  }

  function removeBookedCar(name) {
    const booked = getBookedCars();
    delete booked[name];
    localStorage.setItem("bookedCars", JSON.stringify(booked));
  }

  /* --- Apply sticker to a single card --- */
  function applyBookedSticker(card) {
    if (card.querySelector(".booked-sticker")) return; // already stamped

    card.classList.add("car-booked");

    const sticker = document.createElement("div");
    sticker.className = "booked-sticker";
    card.appendChild(sticker);

    const badge = document.createElement("div");
    badge.className = "booked-badge";
    badge.innerHTML = `<span class="booked-badge-check">✔</span><span class="booked-badge-text">Booked</span>`;
    card.appendChild(badge);

    const btn = card.querySelector(".book-btn");
    if (btn) {
      btn.disabled     = true;
      btn.textContent  = "Already Booked";
    }

    // Show remove button only to the user who made the booking
    const carName      = (card.dataset.carName || card.querySelector("h3")?.textContent || "").trim();
    const currentUser  = JSON.parse(localStorage.getItem("autodrive_user") || "null");
    const bookedEntry  = getBookedCars()[carName];
    const bookedBy     = (bookedEntry && typeof bookedEntry === "object") ? bookedEntry.bookedBy : null;
    const isOwner      = currentUser && (bookedBy === null || bookedBy === currentUser.email);

    if (isOwner) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "admin-remove-btn";
      removeBtn.innerHTML = `🗑 Remove Booking`;
      removeBtn.title     = `Remove booking for ${carName}`;

      removeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        showConfirmModal(carName, function () {
          removeBookedCar(carName);
          card.classList.remove("car-booked");
          card.querySelector(".booked-sticker")?.remove();
          card.querySelector(".booked-badge")?.remove();
          card.querySelector(".admin-remove-btn")?.remove();

          const bookBtn = card.querySelector(".book-btn");
          if (bookBtn) {
            bookBtn.disabled    = false;
            bookBtn.textContent = "Book Now";
          }
        });
      });

      card.appendChild(removeBtn);
    }
  }

  /* --- Restore stickers on load and after dynamic render --- */
  function restoreStickers() {
    const booked = getBookedCars();
    document.querySelectorAll(".car-card").forEach((card) => {
      const name = (card.dataset.carName || card.querySelector("h3")?.textContent || "").trim();
      if (name && booked[name]) applyBookedSticker(card);
    });
  }

  restoreStickers();

  const container = document.getElementById("carContainer");
  if (container) {
    new MutationObserver(restoreStickers).observe(container, { childList: true, subtree: true });
  }

  /* --- Watch for a successful booking then stamp the card --- */
  function watchForSuccess(carName) {
    if (!carName || carName === "No car selected") return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const popup   = document.getElementById("successPopup");
      const visible = popup && (
        popup.style.display === "flex" ||
        popup.style.display === "block" ||
        getComputedStyle(popup).display !== "none"
      );

      if (visible) {
        clearInterval(interval);
        saveBookedCar(carName);
        document.querySelectorAll(".car-card").forEach((card) => {
          const name = (card.dataset.carName || card.querySelector("h3")?.textContent || "").trim();
          if (name === carName) applyBookedSticker(card);
        });
      }

      if (attempts > 40) clearInterval(interval); // give up after ~2 s
    }, 50);
  }

  const form = document.getElementById("bookingForm");
  if (form) {
    form.addEventListener("submit", function () {
      const carNameEl = document.getElementById("carName") || document.getElementById("selectedCarText");
      const carName   = (carNameEl?.value || carNameEl?.textContent || "").trim();
      watchForSuccess(carName);
    }, true);
  }
}

/* ============================================================
   16. PROFILE SLIDE PANEL
   ============================================================ */

/* ── Storage helpers ── */
function getPspUsers() {
  try { return JSON.parse(localStorage.getItem('ad_users') || '{}'); } catch { return {}; }
}
function savePspUsers(u) { localStorage.setItem('ad_users', JSON.stringify(u)); }
function getPspSession() { return localStorage.getItem('ad_session'); }
function setPspSession(email) { localStorage.setItem('ad_session', email); }
function clearPspSession() { localStorage.removeItem('ad_session'); }

/* ── Open / close ── */
function openProfilePanel() {
  const panel = document.getElementById('profileSlidePanel');
  const btn   = document.getElementById('lsUserBtn');
  if (panel) panel.classList.add('open');
  if (btn)   btn.classList.add('panel-open');

  // Lock background scroll
  document.body.style.overflow = 'hidden';

  // Close auth panel if open
  const authPanel = document.getElementById('authSlidePanel');
  if (authPanel) authPanel.classList.remove('open');
  authPanelOpen = false;

  const email = getPspSession();
  if (email) loadProfilePanel(email);
}

function closeProfilePanel() {
  const panel = document.getElementById('profileSlidePanel');
  const btn   = document.getElementById('lsUserBtn');
  if (panel) panel.classList.remove('open');
  if (btn)   btn.classList.remove('panel-open');

  // Restore background scroll
  document.body.style.overflow = '';
}

function switchPspTab(tab, btn) {
  document.querySelectorAll('.psp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.psp-tab-content').forEach(c => c.classList.add('hidden'));
  if (btn) btn.classList.add('active');
  const content = document.getElementById('psp-tab-' + tab);
  if (content) content.classList.remove('hidden');
}

/* ── Load user data into form ── */
function loadProfilePanel(email) {
  const users = getPspUsers();
  const u = users[email];
  if (!u) return;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('psp-firstname', u.firstName);
  set('psp-lastname',  u.lastName);
  set('psp-username',  u.username);
  set('psp-email',     u.email);
  set('psp-phone',     u.phone);
  set('psp-dob',       u.dob);
  // Country is always India (read-only field)
  set('psp-city',      u.city);
  set('psp-bio',       u.bio);

  const nameEl = document.getElementById('psp-newpass');
  if (nameEl) nameEl.value = '';
  const confEl = document.getElementById('psp-confirmpass');
  if (confEl) confEl.value = '';

  // Header
  const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ') || 'My Profile';
  const nameDisp = document.getElementById('pspUserName');
  const emailDisp = document.getElementById('pspUserEmail');
  if (nameDisp)  nameDisp.textContent  = fullName;
  if (emailDisp) emailDisp.textContent = u.email;

  // Initials / avatar
  const initials = ((u.firstName || '?')[0] + (u.lastName || '')[0]).toUpperCase();
  const inEl = document.getElementById('pspAvatarInitials');
  if (inEl) inEl.textContent = initials;

  const imgEl = document.getElementById('pspAvatarImg');
  if (imgEl) {
    if (u.avatar) { imgEl.src = u.avatar; imgEl.style.display = 'block'; }
    else          { imgEl.style.display = 'none'; }
  }

  // ── Stats strip: count bookings for this user ──
  try {
    const bookedCars = JSON.parse(localStorage.getItem('bookedCars') || '{}');
    let bookingCount = 0;
    for (const key in bookedCars) {
      const entry = bookedCars[key];
      // Count if bookedBy matches this user's email, or bookedBy is null (legacy)
      if (entry && (entry.bookedBy === email || entry.bookedBy === null)) {
        bookingCount++;
      }
    }

    // Update bookings count
    const bookingCountEl = document.getElementById('pspStatBookingCount');
    if (bookingCountEl) bookingCountEl.textContent = bookingCount;

    // Update saved cars count
    const savedCountEl = document.getElementById('pspStatSavedCount');
    if (savedCountEl) savedCountEl.textContent = getSavedCars().length;

    // Member since — use registration date if stored, else show year
    const since = u.registeredAt
      ? new Date(u.registeredAt).getFullYear()
      : new Date().getFullYear();
    const statNums = document.querySelectorAll('.psp-stat-num');
    if (statNums[2]) statNums[2].textContent = since;
  } catch (e) {}

  clearPspMsg();
}

/* ── Save ── */
function saveProfilePanel() {
  const email = getPspSession();
  if (!email) return;

  const users = getPspUsers();
  if (!users[email]) return;

  const newEmail   = document.getElementById('psp-email')?.value.trim();
  const newPass    = document.getElementById('psp-newpass')?.value;
  const confPass   = document.getElementById('psp-confirmpass')?.value;

  if (newPass && newPass !== confPass) {
    return showPspMsg('Passwords do not match.', 'error');
  }
  if (newPass && newPass.length < 6) {
    return showPspMsg('Password must be at least 6 characters.', 'error');
  }

  const u = users[email];

  // Re-key if email changed
  if (newEmail && newEmail !== email) {
    if (users[newEmail]) return showPspMsg('That email is already in use.', 'error');
    users[newEmail] = { ...u };
    delete users[email];
    setPspSession(newEmail);
  }

  const key = newEmail || email;
  users[key].firstName = document.getElementById('psp-firstname')?.value.trim();
  users[key].lastName  = document.getElementById('psp-lastname')?.value.trim();
  users[key].username  = document.getElementById('psp-username')?.value.trim();
  users[key].email     = key;
  users[key].phone     = document.getElementById('psp-phone')?.value.trim();
  users[key].dob       = document.getElementById('psp-dob')?.value;
  users[key].country = 'India';
  users[key].city      = document.getElementById('psp-city')?.value.trim();
  users[key].bio       = document.getElementById('psp-bio')?.value.trim();
  if (newPass) users[key].password = btoa(newPass);

  savePspUsers(users);
  loadProfilePanel(key);
  showPspMsg('Profile saved ✓', 'success');

  // Sync autodrive_user in localStorage
  const storedUser = JSON.parse(localStorage.getItem('autodrive_user') || 'null');
  if (storedUser) {
    storedUser.name  = [users[key].firstName, users[key].lastName].filter(Boolean).join(' ') || storedUser.name;
    storedUser.email = key;
    if (newPass) storedUser.password = btoa(newPass); // keep in sync for local auth
    localStorage.setItem('autodrive_user', JSON.stringify(storedUser));
  }

  // Also update password on backend so next login works
  if (newPass) {
    fetch('http://localhost:5000/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: key, newPassword: newPass })
    }).catch(() => {
      // If backend endpoint not available, fall back to local-only auth
      // Next login attempt will check localStorage password as fallback
    });
  }

  showToast('Profile saved ✓');
}

/* ── Discard ── */
function discardProfilePanel() {
  const email = getPspSession();
  if (email) { loadProfilePanel(email); clearPspMsg(); showToast('Changes discarded.'); }
}

/* ── Avatar upload ── */
function handleProfileAvatar(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const email = getPspSession(); if (!email) return;
    const users = getPspUsers();
    if (!users[email]) return;
    users[email].avatar = ev.target.result;
    savePspUsers(users);

    const imgEl = document.getElementById('pspAvatarImg');
    if (imgEl) { imgEl.src = ev.target.result; imgEl.style.display = 'block'; }
    showToast('Profile photo updated ✓');
  };
  reader.readAsDataURL(file);
}

/* ── Message helpers ── */
function showPspMsg(text, type) {
  const el = document.getElementById('pspMsg');
  if (!el) return;
  el.textContent = text;
  el.className = 'psp-msg ' + type;
}

function clearPspMsg() {
  const el = document.getElementById('pspMsg');
  if (el) { el.textContent = ''; el.className = 'psp-msg'; }
}

/* ── Hook into existing login/register flow ──
   After successful login/register, we store the user in our local DB
   and wire the user-icon button to open the profile panel. ── */
(function patchAuthFlow() {
  /* Store newly registered user locally */
  const _origRegister = window.registerUser;
  window.registerUser = async function () {
    const popup       = document.getElementById('authPopupOverlay');
    const isPopup     = popup && !popup.classList.contains('hidden');
    const pre         = isPopup ? 'pp-reg' : 'sp-reg';

    const name     = document.getElementById(`${pre}-name`)?.value.trim()  || '';
    const email    = document.getElementById(`${pre}-email`)?.value.trim() || '';
    const phone    = document.getElementById(`${pre}-phone`)?.value.trim() || '';
    const password = document.getElementById(`${pre}-pass`)?.value.trim()  || '';

    // Run original validation first by calling original
    await _origRegister.call(this);

    // If basic fields are filled and email looks valid, seed local profile
    if (name && email && email.includes('@') && password.length >= 6) {
      const users = getPspUsers();
      if (!users[email]) {
        const parts = name.split(' ');
        users[email] = {
          firstName: parts[0] || '',
          lastName:  parts.slice(1).join(' ') || '',
          username:  '',
          email,
          phone,
          dob: '', country: 'India', city: '', bio: '',
          avatar: '',
          password: btoa(password),
          registeredAt: new Date().toISOString()
        };
        savePspUsers(users);
      }
    }
  };

  /* On page load: if user already logged in via autodrive_user, seed session */
  document.addEventListener('DOMContentLoaded', function pspInit() {
    const saved = localStorage.getItem('autodrive_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        const email = u.email;
        if (email) {
          const users = getPspUsers();
          if (!users[email]) {
            const parts = (u.name || '').split(' ');
            users[email] = {
              firstName: parts[0] || '',
              lastName:  parts.slice(1).join(' ') || '',
              username: '', email,
              phone: u.phone || '', dob: '', country: 'India', city: '', bio: '',
              avatar: '', password: '',
              registeredAt: new Date().toISOString()
            };
            savePspUsers(users);
          }
          setPspSession(email);
          wireUserBtnToProfile();
        }
      } catch {}
    }
  });
})();

/* ── Wire the user-icon button to show profile when logged in ── */
function wireUserBtnToProfile() {
  const btn = document.getElementById('lsUserBtn');
  if (!btn) return;

  btn.onclick = function () {
    const isLoggedIn = !!localStorage.getItem('autodrive_user');
    if (isLoggedIn) {
      const profilePanel = document.getElementById('profileSlidePanel');
      const isOpen = profilePanel && profilePanel.classList.contains('open');
      isOpen ? closeProfilePanel() : openProfilePanel();
    } else {
      toggleAuthPanel();
    }
  };
}

/* Override updateLoggedInUserUI to also seed profile + rewire button */
const _origUpdateUI = window.updateLoggedInUserUI;
window.updateLoggedInUserUI = function (user) {
  if (_origUpdateUI) _origUpdateUI.call(this, user);

  const email = user.email;
  if (email) {
    const users = getPspUsers();
    if (!users[email]) {
      const parts = (user.name || '').split(' ');
      users[email] = {
        firstName: parts[0] || '',
        lastName:  parts.slice(1).join(' ') || '',
        username: '', email,
        phone: user.phone || '', dob: '', country: 'India', city: '', bio: '',
        avatar: '', password: ''
      };
      savePspUsers(users);
    }
    setPspSession(email);
  }
  wireUserBtnToProfile();
};

/* Override logoutUser to also close profile panel + restore auth button */
const _origLogout = window.logoutUser;
window.logoutUser = function () {
  if (_origLogout) _origLogout.call(this);
  clearPspSession();
  closeProfilePanel();

  // Rewire button back to auth panel
  const btn = document.getElementById('lsUserBtn');
  if (btn)btn.onclick = openAuthPopup;
};
 // Vehicle type card visual selection
  document.querySelectorAll('.vehicle-type-grid input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      document.querySelectorAll('.vehicle-type-grid label').forEach(l => l.classList.remove('selected'));
      this.closest('label').classList.add('selected');
    });
  });
  // AUTH GUARD — triggers the moment user clicks/focuses any sell form field
  (function() {
    let _authSellShown = false;
    function openAuthForSell() {
      const isLoggedIn = !!localStorage.getItem('autodrive_user');
      if (isLoggedIn) return; // already logged in, do nothing
      if (_authSellShown) return; // prevent double-trigger from mousedown + focusin
      _authSellShown = true;
      setTimeout(() => { _authSellShown = false; }, 500);

      // Show the auth popup overlay (preferred — centered modal)
      const popup = document.getElementById('authPopupOverlay');
      if (popup) {
        popup.classList.remove('hidden');
        if (typeof switchAuthTab === 'function') switchAuthTab('popup', 'login');
      } else {
        // Fallback: open slide panel
        const panel = document.getElementById('authSlidePanel');
        const btn   = document.getElementById('lsUserBtn');
        if (panel) panel.classList.add('open');
        if (btn)   btn.classList.add('panel-open');
        if (typeof switchAuthTab === 'function') switchAuthTab('slide', 'login');
      }
      if (typeof showToast === 'function') showToast('Please login or register to sell your car.', true);
    }

    document.addEventListener('DOMContentLoaded', function() {
      const sellForm = document.getElementById('sellForm');
      if (!sellForm) return;

      // Block all inputs, selects, textareas, and buttons inside the sell form
      sellForm.addEventListener('mousedown', function(e) {
        if (!localStorage.getItem('autodrive_user')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          openAuthForSell();
        }
      }, true);

      sellForm.addEventListener('focusin', function(e) {
        if (!localStorage.getItem('autodrive_user')) {
          e.target.blur();
          openAuthForSell();
        }
      }, true);
    });
  })();

/* ============================================================
   16. SAVED CARS
   ============================================================ */

/* Helper: get saved cars for the current user from localStorage */
function getSavedCars() {
  const user = localStorage.getItem('autodrive_user');
  if (!user) return [];
  try {
    const email = JSON.parse(user).email;
    if (!email) return [];
    const key = 'ad_saved_' + btoa(email);
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch { return []; }
}

/* Helper: save cars list for current user */
function setSavedCars(list) {
  const user = localStorage.getItem('autodrive_user');
  if (!user) return;
  try {
    const email = JSON.parse(user).email;
    if (!email) return;
    const key = 'ad_saved_' + btoa(email);
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

/* Toggle save/unsave a car */
function toggleSaveCar(btn, name, year, type, fuel, price, image) {
  const isLoggedIn = !!localStorage.getItem('autodrive_user');
  if (!isLoggedIn) {
    const popup = document.getElementById('authPopupOverlay');
    if (popup) { popup.classList.remove('hidden'); switchAuthTab('popup', 'login'); }
    showToast('Please login to save cars.', true);
    return;
  }

  let saved = getSavedCars();
  const idx = saved.findIndex(c => c.name === name);
  const svg = btn.querySelector('svg');

  if (idx === -1) {
    // Save it
    saved.push({ name, year, type, fuel, price, image });
    setSavedCars(saved);
    btn.classList.add('saved');
    if (svg) svg.setAttribute('fill', 'currentColor');
    btn.title = 'Remove from saved';
    showToast('Car saved! ❤️');
  } else {
    // Unsave it
    saved.splice(idx, 1);
    setSavedCars(saved);
    btn.classList.remove('saved');
    if (svg) svg.setAttribute('fill', 'none');
    btn.title = 'Save car';
    showToast('Removed from saved.');
  }

  // Update dashboard if open
  refreshSavedCarsPanel();
}

/* Remove a car from saved list (called from dashboard) */
function removeSavedCar(name) {
  let saved = getSavedCars();
  saved = saved.filter(c => c.name !== name);
  setSavedCars(saved);
  refreshSavedCarsPanel();
  // Also update heart buttons on the page
  document.querySelectorAll('.save-car-btn').forEach(btn => {
    const card = btn.closest('.car-card');
    const cardName = card && card.querySelector('h3') ? card.querySelector('h3').textContent : '';
    if (cardName === name) {
      btn.classList.remove('saved');
      const svg = btn.querySelector('svg');
      if (svg) svg.setAttribute('fill', 'none');
      btn.title = 'Save car';
    }
  });
  showToast('Removed from saved.');
}

/* Refresh the saved cars section in the profile panel */
function refreshSavedCarsPanel() {
  const countEl = document.getElementById('pspSavedCount');
  const listEl  = document.getElementById('pspSavedList');
  if (!countEl && !listEl) return;

  const saved = getSavedCars();

  if (countEl) {
    countEl.textContent = saved.length;
  }

  // Also update the stat box at the top of the dashboard
  const statCountEl = document.getElementById('pspStatSavedCount');
  if (statCountEl) statCountEl.textContent = saved.length;

  if (listEl) {
    if (!saved.length) {
      listEl.innerHTML = '<p class="psp-saved-empty">No saved cars yet. Browse and tap ❤️ to save!</p>';
      return;
    }
    listEl.innerHTML = saved.map(car => `
      <div class="psp-saved-item">
        <img src="${car.image}" alt="${car.name}" onerror="this.src='../images/placeholder.png'">
        <div class="psp-saved-item-info">
          <div class="psp-saved-item-name">${car.name}</div>
          <div class="psp-saved-item-meta">
            <span>📅 ${car.year}</span>
            <span>🚗 ${car.type}</span>
            <span>⛽ ${car.fuel}</span>
          </div>
          <div class="psp-saved-item-price">₹${Number(car.price).toLocaleString('en-IN')}</div>
        </div>
        <button class="psp-saved-remove" onclick="removeSavedCar('${car.name.replace(/'/g, "\\'")}')" title="Remove">✕</button>
      </div>
    `).join('');
  }
}

/* Hook into openProfilePanel to refresh saved cars each time */
const _origOpenProfilePanel = window.openProfilePanel;
window.openProfilePanel = function () {
  if (_origOpenProfilePanel) _origOpenProfilePanel.call(this);
  setTimeout(refreshSavedCarsPanel, 50);
};

/* Toggle saved cars section open/closed */
function toggleSavedCarsSection() {
  const list    = document.getElementById('pspSavedList');
  const chevron = document.getElementById('pspSavedChevron');
  if (!list) return;

  const isCollapsed = list.classList.contains('psp-saved-collapsed');

  if (isCollapsed) {
    list.classList.remove('psp-saved-collapsed');
    list.classList.add('psp-saved-open');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  } else {
    list.classList.remove('psp-saved-open');
    list.classList.add('psp-saved-collapsed');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }
}

/* Click on "0 Saved Cars" stat → scroll to & open the saved list */
function openSavedCarsFromStat() {
  // Switch to Profile tab if tabs exist
  const profileTab = document.querySelector('.psp-tab[data-tab="profile"]');
  if (profileTab && !profileTab.classList.contains('active')) {
    profileTab.click();
  }

  // Small delay to let tab switch render
  setTimeout(function () {
    const list    = document.getElementById('pspSavedList');
    const chevron = document.getElementById('pspSavedChevron');
    const toggle  = document.getElementById('pspSavedToggle');

    // Force it open
    if (list) {
      list.classList.remove('psp-saved-collapsed');
      list.classList.add('psp-saved-open');
    }
    if (chevron) chevron.style.transform = 'rotate(180deg)';

    // Scroll the toggle header into view inside the panel
    if (toggle) {
      toggle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Pulse highlight on the section
    if (toggle) {
      toggle.classList.add('psp-saved-pulse');
      setTimeout(() => toggle.classList.remove('psp-saved-pulse'), 1200);
    }
  }, 80);
}


/* ============================================================
   17. BOOKINGS DASHBOARD
   ============================================================ */

/* ── Storage helpers ── */
function getUserBookings() {
  const user = localStorage.getItem('autodrive_user');
  if (!user) return [];
  try {
    const email = JSON.parse(user).email;
    if (!email) return [];
    return JSON.parse(localStorage.getItem('ad_bookings_' + btoa(email)) || '[]');
  } catch { return []; }
}

function saveUserBookings(list) {
  const user = localStorage.getItem('autodrive_user');
  if (!user) return;
  try {
    const email = JSON.parse(user).email;
    if (!email) return;
    localStorage.setItem('ad_bookings_' + btoa(email), JSON.stringify(list));
  } catch {}
}

/* ── Store a booking locally after successful submit ── */
function storeBookingLocally(data, backendId) {
  const bookings = getUserBookings();
  bookings.unshift({
    id:        Date.now(),
    backendId: backendId || null,   // backend _id for DELETE calls
    car:       data.car || 'Unknown Car',
    date:      data.booking_date || '',
    time:      data.booking_time || '',
    name:      (data.first_name + ' ' + data.last_name).trim(),
    phone:     data.phone || '',
    city:      data.city || '',
    type:      data.vehicle_type || '',
    bookedAt:  new Date().toISOString()
  });
  saveUserBookings(bookings);
  refreshBookingsPanel();
}

/* ── Remove a single booking by id (local + backend) ── */
async function removeBooking(id) {
  const bookings   = getUserBookings();
  const target     = bookings.find(b => b.id === id);
  const backendId  = target?.backendId;

  // Remove locally first so UI updates immediately
  saveUserBookings(bookings.filter(b => b.id !== id));
  refreshBookingsPanel();

  // Refresh the drawer if it's open
  const drawer = document.getElementById('detailDrawer');
  if (drawer && drawer.classList.contains('open') && drawer.dataset.type === 'bookings') {
    const body = document.getElementById('detailDrawerBody');
    if (body) renderDrawerBookings(body);
  }

  // Hit the backend if we have the _id
  if (backendId) {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${backendId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      if (result.success) {
        showToast('Booking removed ✓');
      } else {
        showToast('Removed locally. Server: ' + (result.message || 'error'), true);
      }
    } catch (err) {
      // Backend offline — already removed locally, just notify
      showToast('Removed locally (server unreachable).', true);
    }
  } else {
    showToast('Booking removed.');
  }
}

/* ── Refresh the bookings panel list & counts ── */
function refreshBookingsPanel() {
  const bookings = getUserBookings();

  // Update both badge and stat counter
  const badgeEl = document.getElementById('pspBookingCount');
  const statEl  = document.getElementById('pspStatBookingCount');
  if (badgeEl) badgeEl.textContent = bookings.length;
  if (statEl)  statEl.textContent  = bookings.length;

  const listEl = document.getElementById('pspBookingList');
  if (!listEl) return;

  if (!bookings.length) {
    listEl.innerHTML = '<p class="psp-saved-empty">No bookings yet. Book a car to see it here!</p>';
    return;
  }

  listEl.innerHTML = bookings.map(b => {
    const dateStr = b.date ? new Date(b.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
    return `
      <div class="psp-booking-item">
        <div class="psp-booking-icon-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </div>
        <div class="psp-booking-info">
          <div class="psp-booking-car">${b.car}</div>
          <div class="psp-booking-meta">
            <span>📅 ${dateStr}</span>
            ${b.time ? `<span>🕐 ${b.time}</span>` : ''}
            ${b.type ? `<span>🚗 ${b.type}</span>` : ''}
          </div>
          <div class="psp-booking-sub">${b.city ? '📍 ' + b.city : ''}</div>
        </div>
        <div class="psp-booking-right">
          <span class="psp-booking-status">Confirmed</span>
          <button class="psp-saved-remove" onclick="removeBooking(${b.id})" title="Remove booking">✕</button>
        </div>
      </div>
    `;
  }).join('');
}

/* ── Toggle open/close ── */
function toggleBookingsSection() {
  const list    = document.getElementById('pspBookingList');
  const chevron = document.getElementById('pspBookingChevron');
  if (!list) return;

  const isCollapsed = list.classList.contains('psp-saved-collapsed');
  if (isCollapsed) {
    list.classList.remove('psp-saved-collapsed');
    list.classList.add('psp-saved-open');
    if (chevron) chevron.style.transform = 'rotate(180deg)';
  } else {
    list.classList.remove('psp-saved-open');
    list.classList.add('psp-saved-collapsed');
    if (chevron) chevron.style.transform = 'rotate(0deg)';
  }
}

/* ── Stat box click → scroll & open ── */
function openBookingsFromStat() {
  const profileTab = document.querySelector('.psp-tab[data-tab="profile"]');
  if (profileTab && !profileTab.classList.contains('active')) profileTab.click();

  setTimeout(function () {
    const list    = document.getElementById('pspBookingList');
    const chevron = document.getElementById('pspBookingChevron');
    const toggle  = document.getElementById('pspBookingToggle');

    if (list) {
      list.classList.remove('psp-saved-collapsed');
      list.classList.add('psp-saved-open');
    }
    if (chevron) chevron.style.transform = 'rotate(180deg)';
    if (toggle) {
      toggle.scrollIntoView({ behavior: 'smooth', block: 'start' });
      toggle.classList.add('psp-booking-pulse');
      setTimeout(() => toggle.classList.remove('psp-booking-pulse'), 1200);
    }
  }, 80);
}

/* ── patchBookingSubmit removed — storeBookingLocally() is called
       directly inside result.success in initBookingForm ── */

/* ── Refresh bookings when profile panel opens ── */
const _origOpenProfilePanel2 = window.openProfilePanel;
window.openProfilePanel = function () {
  if (_origOpenProfilePanel2) _origOpenProfilePanel2.call(this);
  setTimeout(refreshBookingsPanel, 50);
};


/* ============================================================
   18. DETAIL DRAWER — Bookings & Saved Cars
   ============================================================ */

function openDetailDrawer(type) {
  const overlay = document.getElementById('detailDrawerOverlay');
  const drawer  = document.getElementById('detailDrawer');
  const title   = document.getElementById('detailDrawerTitle');
  const body    = document.getElementById('detailDrawerBody');
  if (!drawer || !body) return;

  if (type === 'bookings') {
    title.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      My Bookings`;
    drawer.dataset.type = 'bookings';
    renderDrawerBookings(body);
  } else {
    title.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="#e53e3e" stroke="#e53e3e" stroke-width="1.5" style="vertical-align:middle;margin-right:6px"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      Saved Cars`;
    drawer.dataset.type = 'saved';
    renderDrawerSaved(body);
  }

  if (overlay) overlay.classList.add('active');
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDetailDrawer() {
  const overlay = document.getElementById('detailDrawerOverlay');
  const drawer  = document.getElementById('detailDrawer');
  if (overlay) overlay.classList.remove('active');
  if (drawer)  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

function renderDrawerBookings(body) {
  const bookings = getUserBookings();
  if (!bookings.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#cbd5e1" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        <p>No bookings yet.</p>
        <span>Book a test drive to see it here!</span>
      </div>`;
    return;
  }
  body.innerHTML = bookings.map(b => {
    const dateStr = b.date ? new Date(b.date).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
    return `
      <div class="drawer-card drawer-booking-card">
        <div class="drawer-card-top">
          <div class="drawer-card-icon blue">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </div>
          <div class="drawer-card-info">
            <div class="drawer-card-name">${b.car}</div>
            <div class="drawer-card-meta">
              <span>📅 ${dateStr}</span>
              ${b.time ? `<span>🕐 ${b.time}</span>` : ''}
              ${b.type ? `<span>🚗 ${b.type}</span>` : ''}
              ${b.city ? `<span>📍 ${b.city}</span>` : ''}
            </div>
          </div>
          <span class="drawer-status confirmed">Confirmed</span>
        </div>
        <button class="drawer-remove-btn" onclick="removeBookingFromDrawer(${b.id})">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          Remove Booking
        </button>
      </div>`;
  }).join('');
}

function renderDrawerSaved(body) {
  const saved = getSavedCars();
  if (!saved.length) {
    body.innerHTML = `
      <div class="drawer-empty">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#cbd5e1" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        <p>No saved cars yet.</p>
        <span>Tap ❤️ on any car to save it here!</span>
      </div>`;
    return;
  }
  body.innerHTML = saved.map(car => `
    <div class="drawer-card drawer-saved-card">
      <img src="${car.image}" alt="${car.name}" onerror="this.src='../images/placeholder.png'">
      <div class="drawer-card-info">
        <div class="drawer-card-name">${car.name}</div>
        <div class="drawer-card-meta">
          <span>📅 ${car.year}</span>
          <span>🚗 ${car.type}</span>
          <span>⛽ ${car.fuel}</span>
        </div>
        <div class="drawer-card-price">₹${Number(car.price).toLocaleString('en-IN')}</div>
      </div>
      <button class="drawer-remove-btn drawer-remove-saved" onclick="removeSavedFromDrawer('${car.name.replace(/'/g, "\\'")}')">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        Remove
      </button>
    </div>`).join('');
}

function removeBookingFromDrawer(id) {
  removeBooking(id); // async — handles local + backend + drawer refresh
}

function removeSavedFromDrawer(name) {
  removeSavedCar(name);
  const body = document.getElementById('detailDrawerBody');
  if (body) renderDrawerSaved(body);
}

/* Override stat-click and toggle functions to open drawer instead */
function openBookingsFromStat()  { openDetailDrawer('bookings'); }
function openSavedCarsFromStat() { openDetailDrawer('saved'); }
function toggleBookingsSection() { openDetailDrawer('bookings'); }
function toggleSavedCarsSection() { openDetailDrawer('saved'); }
/* ============================================================
   CALL POPUP
   ============================================================ */
function openCallPopup() {
  document.getElementById('callPopupOverlay').classList.add('active');
  document.getElementById('callPopup').classList.add('active');
}

function closeCallPopup() {
  document.getElementById('callPopupOverlay').classList.remove('active');
  document.getElementById('callPopup').classList.remove('active');
}

function copyPhoneNumber() {
  navigator.clipboard.writeText('+916284267058').then(function () {
    const btn = document.getElementById('copyNumberBtn');
    btn.textContent = '✔ Copied!';
    btn.classList.add('copied');
    setTimeout(function () {
      btn.innerHTML = '📋 &nbsp;Copy Number';
      btn.classList.remove('copied');
    }, 2000);
  });
}


/* ============================================================
   19. BOOKING NOTIFICATIONS
   — EmailJS  →  email alert to admin on every booking
   — Browser Push  →  confirmation shown on user's device

   ── EMAILJS SETUP (free, 5 mins) ──
   1. Sign up at emailjs.com
   2. Email Services → Add Service → connect your Gmail
   3. Email Templates → Create Template with these variables:
        {{customer_name}}, {{customer_phone}}, {{car_name}},
        {{booking_date}}, {{booking_time}}, {{city}}, {{customer_email}}
   4. Account → copy your Public Key
   5. Fill in the 3 values below
   ============================================================ */

const EMAILJS_CONFIG = {
  SERVICE_ID:           'service_sm8hnre',
  TEMPLATE_ID:          'template_pc0qbrc',   // admin notification template
  SELL_REPLY_TEMPLATE_ID: 'template_pc0qbrc', // seller confirmation — replace with new template ID
  PUBLIC_KEY:           'hKmaYG8yqtXpcxE_E',
  ADMIN_EMAIL:          'jashanpreet7534@gmail.com'
};


/* ── Load EmailJS SDK ── */
(function loadEmailJS() {
  if (document.getElementById('emailjs-sdk')) return;
  const script = document.createElement('script');
  script.id  = 'emailjs-sdk';
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  script.onload = () => {
    if (window.emailjs) emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
  };
  document.head.appendChild(script);
})();


/* ── 1. Send email to admin via EmailJS ── */
async function sendAdminEmail(data) {
  if (
    !EMAILJS_CONFIG.SERVICE_ID  || EMAILJS_CONFIG.SERVICE_ID  === 'YOUR_SERVICE_ID' ||
    !EMAILJS_CONFIG.TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    !EMAILJS_CONFIG.PUBLIC_KEY  || EMAILJS_CONFIG.PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'
  ) {
    console.warn('EmailJS not configured. Fill in EMAILJS_CONFIG in script.js.');
    return;
  }

  const date = data.booking_date
    ? new Date(data.booking_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';

  const templateParams = {
    customer_name:  `${data.first_name || ''} ${data.last_name || ''}`.trim(),
    customer_phone: data.phone         || 'N/A',
    customer_email: data.email         || 'N/A',
    car_name:       data.car           || 'N/A',
    booking_date:   date,
    booking_time:   data.booking_time  || 'N/A',
    city:           data.city          || 'N/A',
    to_email:       EMAILJS_CONFIG.ADMIN_EMAIL
  };

  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams
    );
    console.log('Booking email sent to admin');
  } catch (e) {
    console.warn('EmailJS send failed:', e);
  }
}


/* ── 2. Browser Push Notification (shown on user's device) ── */
async function requestPushPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function sendPushNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(title, {
      body,
      icon:    '../images/logo.png',
      badge:   '../images/logo.png',
      tag:     'autodrive-booking',
      vibrate: [200, 100, 200]
    });
  } catch (e) {
    console.warn('Push notification error:', e);
  }
}


/* ── 3. Fire all notifications on confirmed booking ── */
async function sendBookingNotifications(data) {
  const carName = data.car          || 'Unknown Car';
  const date    = data.booking_date
    ? new Date(data.booking_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';
  const time = data.booking_time || 'N/A';

  await Promise.allSettled([
    // Email → admin
    sendAdminEmail(data),

    // Push → user's browser/device
    sendPushNotification(
      'Booking Confirmed - AutoDrive',
      `Your test drive for ${carName} is confirmed!\nDate: ${date}  Time: ${time}`
    )
  ]);
}


/* ── 4. Ask push permission once when logged-in user loads page ── */
document.addEventListener('DOMContentLoaded', function () {
  setTimeout(async () => {
    if ('Notification' in window &&
        Notification.permission === 'default' &&
        localStorage.getItem('autodrive_user')) {
      await requestPushPermission();
    }
  }, 3000);
});


/* ── 4b. Send email for Sell Car form submission ── */
async function sendSellNotificationEmail(data) {
  if (
    !EMAILJS_CONFIG.SERVICE_ID  || EMAILJS_CONFIG.SERVICE_ID  === 'YOUR_SERVICE_ID' ||
    !EMAILJS_CONFIG.TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    !EMAILJS_CONFIG.PUBLIC_KEY  || EMAILJS_CONFIG.PUBLIC_KEY  === 'YOUR_PUBLIC_KEY'
  ) {
    console.warn('EmailJS not configured.');
    return;
  }

  const carLabel    = `${data.car_name || 'N/A'} (${data.year || 'N/A'}) — KM: ${data.km_driven || 'N/A'}`;
  const priceLabel  = `₹${Number(data.expected_price || 0).toLocaleString('en-IN')}`;

  // ── 1. Email to ADMIN ──
  try {
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      {
        customer_name:  data.owner_name  || 'N/A',
        customer_phone: data.phone       || 'N/A',
        customer_email: data.email       || 'N/A',
        car_name:       carLabel,
        booking_date:   data.car_name    || 'N/A',
        booking_time:   priceLabel,
        city:           data.description || '—',
        to_email:       EMAILJS_CONFIG.ADMIN_EMAIL
      }
    );
    console.log('Sell notification sent to admin');
  } catch (e) {
    console.warn('Admin email failed:', e);
  }


}


/* ── 5. Hook into storeBookingLocally — fires on every confirmed booking ── */
(function patchBookingForNotifications() {
  const _origStore = window.storeBookingLocally;
  window.storeBookingLocally = function (data, id) {
    if (_origStore) _origStore.call(this, data, id);
    requestPushPermission().then(() => sendBookingNotifications(data));
  };
})();