# Campus Lost & Found Portal

A simple, authentic Web Technology practical project built using **HTML5, CSS3, Vanilla JavaScript**, with a lightweight **PHP & MySQL** backend bridge.

---

## 1. Project Overview

The **Campus Lost & Found Portal** is an intuitive web portal allowing students, faculty, and campus staff to:
- Browse and search active lost and found reports with live keyword and category filtering.
- Switch between interactive filter tabs (`All Reports`, `Lost Items`, `Found Items`, and `Claimed / Returned`).
- File reports using quick report-type tabs (`I Lost an Item` vs `I Found an Item`).
- Manage report statuses by marking retrieved items as Returned or deleting records.

---

## 2. File & Folder Structure

```text
WT-Project/
│
├── images/             # Visual assets (SVGs)
│   ├── logo.svg            # College campus emblem & search crest
│   ├── campus-banner.svg   # Home page central lost & found desk illustration
│   ├── cat-*.svg           # Category icons (electronics, bags, keys, etc.)
│   └── item-*.svg          # Item thumbnail graphics
│
├── index.html          # Home page: Header with tabs, campus banner, statistics, recent items
├── items.html          # Browse items: In-page filter tabs, live search, categories, table
├── report.html         # Report form: Interactive report-type tabs (Lost/Found), validated form
├── manage-items.html   # Manage items: Action table to mark items as Returned or Delete
│
├── style.css           # Authentic Academic Navy & Slate theme (#16325C, #D97706, #F4F6F9)
├── script.js           # Vanilla JavaScript: Dynamic tables, in-page tab switching, localStorage
│
├── api.php             # Minimal PHP backend connecting JavaScript to MySQL
├── db.php              # Database connection helper for MySQL/MariaDB
├── database.sql        # Database schema and initial sample records
└── README.md           # Documentation
```

---

## 3. Design & Features

- **Collegiate Color Scheme**: Built with classic university tones—Academic Navy (`#16325C`), subtle warm collegiate gold accent (`#D97706`), soft campus grey-white background (`#F4F6F9`), crisp white cards, and natural status badges.
- **Relocated Navigation Tabs**: The main navigation tabs (`Home`, `Browse Items`, `Report Item`, `Manage Items`) are integrated cleanly on the right side of the top header bar alongside the college emblem, rather than as a stacked secondary block.
- **In-Page Interactive Tabs**: 
  - `items.html`: Clickable filter tabs (`All Reports`, `Lost Items`, `Found Items`, `Claimed / Returned`) with live count badges.
  - `report.html`: Form mode toggle tabs (`I Lost an Item` vs `I Found an Item`).
- **Visual Images**: Includes a college portal emblem, a hero desk banner, category icons, and item thumbnails in all data tables.

---

## 4. How to Run the Project

### Option A: Direct Browser Preview (Offline)
Double-click [`index.html`](file:///d:/WT-Project/index.html) in File Explorer to open directly in Chrome or Edge. All features work immediately using `localStorage`.

### Option B: Running with XAMPP (Apache & MySQL)
1. Start **Apache** and **MySQL** in XAMPP.
2. Open your browser and navigate to:
   ```text
   http://localhost/lost-found-portal/index.html
   ```
