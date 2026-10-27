# Campus Lost & Found Portal

A complete, authentic Web Technology practical project built using **HTML5, CSS3, Vanilla JavaScript**, with a lightweight **PHP & MySQL** backend bridge.

---

## 1. Project Overview

The **Campus Lost & Found Portal** is an intuitive web portal allowing students, faculty, and campus staff to:
- Browse and search active lost and found reports with live keyword and category filtering.
- Switch between interactive filter tabs (`All Reports`, `Lost Items`, `Found Items`, and `Claimed / Returned`).
- File reports using quick report-type tabs (`I Lost an Item` vs `I Found an Item`).
- Manage report statuses by marking retrieved items as Returned or deleting records.

---

## 2. Organized File & Folder Structure

```text
Campus-Lost-And-Found-Portal/
│
├── index.html            # Home page (Hero card, statistics, recent items table)
├── items.html            # Browse items page (Search bar, filter tabs, dynamic data table)
├── report.html           # Report submission page (Toggle tabs for Lost / Found)
├── manage-items.html     # Manage items page (Action table to Mark as Returned or Delete)
│
├── css/                  # Stylesheets folder
│   └── style.css             # Collegiate Academic Navy & Slate theme with campus photo background
│
├── js/                   # Client-side JavaScript folder
│   └── script.js             # Core logic: DOM rendering, interactive tabs, localStorage, API sync
│
├── images/               # Image assets folder
│   ├── campus-bg.jpg         # High-resolution modern university campus background photo
│   ├── college-logo.jpg      # Prestigious university crest emblem
│   └── logo.svg              # Vector college crest
│
├── backend/              # Server-side PHP backend folder
│   ├── api.php               # Lightweight REST API handling CRUD requests from JavaScript
│   └── db.php                # Secure PDO MySQL database connection helper
│
├── database/             # Database scripts folder
│   └── database.sql          # MySQL schema and sample records
│
├── docs/                 # Documentation & reports folder
│   └── PROJECT_REPORT.md     # Complete formatted college project report
│
└── README.md             # Project overview and setup instructions
```

---

## 3. Design & Features

- **Collegiate Color Scheme**: Built with classic university tones—Academic Navy (`#16325C`), subtle warm collegiate gold accent (`#D97706`), soft campus grey-white background (`#F4F6F9`), crisp white cards, and natural status badges.
- **Relocated Navigation Tabs**: The main navigation tabs (`Home`, `Browse Items`, `Report Item`, `Manage Items`) are integrated cleanly on the right side of the top header bar alongside the college emblem.
- **In-Page Interactive Tabs**: 
  - `items.html`: Clickable filter tabs (`All Reports`, `Lost Items`, `Found Items`, `Claimed / Returned`) with live count badges.
  - `report.html`: Form mode toggle tabs (`I Lost an Item` vs `I Found an Item`).
- **Real Visual Images**: Real campus background photograph (`images/campus-bg.jpg`) and collegiate crest logo (`images/college-logo.jpg`). No distracting icons in tables.

---

## 4. How to Run the Project

### Option A: Direct Browser Preview (Offline)
Double-click `index.html` in File Explorer to open directly in Chrome or Edge. All features work immediately using `localStorage`.

### Option B: Running with XAMPP (Apache & MySQL)
1. Start **Apache** and **MySQL** in XAMPP (or run `C:\xampp\mysql_start.bat`).
2. Open your browser and navigate to:
   ```text
   http://localhost/lost-found-portal/index.html
   ```
