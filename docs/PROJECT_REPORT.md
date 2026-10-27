# COLLEGE PROJECT REPORT

## PROJECT TITLE:
**Campus Lost & Found Portal**

---

## 1. PROJECT EXPLANATION

### 1.1 Overview
The **Campus Lost & Found Portal** is an intuitive, web-based management system developed to address the common issue of misplaced belongings across college campuses. On any educational campus, students and staff frequently lose valuable items such as student ID cards, notebooks, electronic devices, calculators, wallets, and keys. Traditional lost-and-found approaches rely on physical inquiry desks, notice boards, or scattered social media groups, which are often inefficient, slow, and unorganized. 

This portal provides a unified, real-time platform where any student or campus member can quickly report a lost item or register a found item. Other students can browse active listings, search by keywords, filter by category and report status, and directly contact the finder or owner to safely recover their belongings.

### 1.2 Objectives
- **Centralized Platform**: Create a single, reliable hub for all lost and found activities on campus.
- **Easy Reporting**: Enable students to file lost or found reports within seconds using structured forms.
- **Instant Search & Filter**: Provide fast keyword searching and categorized filtering to quickly identify matching items.
- **Status Tracking**: Allow users to track and update the status of items from *Active* to *Returned / Claimed*.
- **Privacy & Direct Communication**: Facilitate safe, direct communication between finders and owners via college email contact information.
- **Dual-Storage Resilience**: Implement client-side storage (`localStorage`) for offline access alongside a robust MySQL relational database backend via a lightweight PHP API.

### 1.3 Key Functionality & Modules
1. **Home Module (`index.html`)**:
   - Displays real-time statistics (Total Reports, Active Lost Items, Active Found Items).
   - Features a clean university navigation bar with top-level tabs.
   - Summarizes the latest active reports in an organized data table.
2. **Browse & Search Module (`items.html`)**:
   - Interactive in-page filter tabs (`All Reports`, `Lost Items`, `Found Items`, `Claimed / Returned`) with live counters.
   - Real-time keyword search bar (matches item title, location, or description).
   - Category dropdown filter (Electronics, Documents/ID Cards, Bags, Wallets, Keys, Books, etc.).
3. **Report Submission Module (`report.html`)**:
   - Interactive mode toggle tabs (`I Lost an Item` vs. `I Found an Item`).
   - Client-side validation ensuring all required fields are accurately filled.
   - Assigns unique auto-incrementing Item IDs (`#101`, `#102`, etc.).
4. **Item Management Module (`manage-items.html`)**:
   - Allows users and campus administrators to mark recovered items as *Returned* or delete outdated listings.
5. **Database & API Layer (`backend/api.php`, `backend/db.php`, `database/database.sql`)**:
   - Connects the front-end to a relational MySQL database (`lost_found_db`) using PHP Data Objects (PDO) with prepared statements.

---

## 2. SCREENSHOTS OF THE MAIN MODULE

> *(Paste your screenshots in the designated sections below in MS Word)*

### [Screenshot 1: Home Page Dashboard]
*(Paste screenshot of `index.html` here showing the navigation bar, college logo, statistics cards, and recent items table)*
- **Figure 1.1**: Campus Lost & Found Portal Home Page Dashboard displaying active counters and recent item reports.

### [Screenshot 2: Browse & Search Module with Filter Tabs]
*(Paste screenshot of `items.html` here showing the interactive filter tabs, search field, category filter, and table)*
- **Figure 1.2**: Browse Items Module with real-time keyword search and interactive status filter tabs.

### [Screenshot 3: Report Submission Form]
*(Paste screenshot of `report.html` here showing the toggle tabs for Lost/Found and input fields)*
- **Figure 1.3**: Report Item Form with interactive Lost/Found selection tabs and input validation.

### [Screenshot 4: Manage Items & Status Update Module]
*(Paste screenshot of `manage-items.html` here showing the Action buttons)*
- **Figure 1.4**: Manage Items Module showing "Mark Returned" and "Delete" actions.

### [Screenshot 5: MySQL Database Table in phpMyAdmin]
*(Paste screenshot of phpMyAdmin `lost_found_db` -> `items` table under the "Browse" tab)*
- **Figure 1.5**: MySQL backend database (`lost_found_db`) records in phpMyAdmin.

### [Screenshot 6: MySQL Database Schema / Structure]
*(Paste screenshot of phpMyAdmin `lost_found_db` -> `items` table under the "Structure" tab)*
- **Figure 1.6**: MySQL Table Structure showing column definitions, data types, and primary key.

---

## 3. MAIN MODULE LOGIC CODE

### 3.1 Front-End Controller Logic (`js/script.js` - Search & Dynamic Table Rendering)

```javascript
// ==========================================
// BROWSE ITEMS & INTERACTIVE TABS LOGIC
// ==========================================
var activeFilterTab = "All";

// Updates count badges on interactive tabs
function updateTabCounts() {
  var items = getItems();
  var countAll = items.length;
  var countLost = 0;
  var countFound = 0;
  var countReturned = 0;

  for (var i = 0; i < items.length; i++) {
    if (items[i].status === "Returned") {
      countReturned++;
    } else {
      if (items[i].type === "Lost") countLost++;
      else if (items[i].type === "Found") countFound++;
    }
  }

  document.getElementById("tab-count-all").textContent = countAll;
  document.getElementById("tab-count-lost").textContent = countLost;
  document.getElementById("tab-count-found").textContent = countFound;
  document.getElementById("tab-count-returned").textContent = countReturned;
}

// Filters items based on active tab, search keyword, and category
function searchItems() {
  var searchInput = document.getElementById("search-input");
  var categorySelect = document.getElementById("category-filter");

  var query = searchInput ? searchInput.value.toLowerCase().trim() : "";
  var selectedCategory = categorySelect ? categorySelect.value : "All";

  var allItems = getItems();
  var filteredItems = [];

  for (var i = 0; i < allItems.length; i++) {
    var it = allItems[i];
    var name = (it.name || "").toLowerCase();
    var desc = (it.description || "").toLowerCase();
    var loc = (it.location || "").toLowerCase();

    // Text match: matches name, description, or location
    var matchesText = query === "" || 
      name.indexOf(query) !== -1 || 
      desc.indexOf(query) !== -1 || 
      loc.indexOf(query) !== -1;

    // Filter Tab match: matches All, Lost, Found, or Returned
    var matchesTab = false;
    if (activeFilterTab === "All") {
      matchesTab = true;
    } else if (activeFilterTab === "Lost") {
      matchesTab = it.type === "Lost" && it.status === "Active";
    } else if (activeFilterTab === "Found") {
      matchesTab = it.type === "Found" && it.status === "Active";
    } else if (activeFilterTab === "Returned") {
      matchesTab = it.status === "Returned";
    }

    // Category match
    var matchesCategory = selectedCategory === "All" || it.category === selectedCategory;

    if (matchesText && matchesTab && matchesCategory) {
      filteredItems.push(it);
    }
  }

  renderViewItemsTable(filteredItems);
}

// Dynamically creates and injects HTML table rows into the DOM
function renderViewItemsTable(itemsToDisplay) {
  var tableBody = document.getElementById("view-items-table");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (itemsToDisplay.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='8' style='text-align:center; padding: 22px; color: #64748B;'>" +
      "No matching items found. Try adjusting your search query or filter tab.</td></tr>";
    return;
  }

  for (var i = 0; i < itemsToDisplay.length; i++) {
    var it = itemsToDisplay[i];
    var badgeClass = it.type === "Lost" ? "badge-lost" : "badge-found";
    var statusBadgeClass = it.status === "Active" ? "badge-active" : "badge-returned";

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>#" + it.id + "</td>" +
      "<td><strong>" + escapeHtml(it.name) + "</strong>" + 
        (it.description ? "<br><small style='color:#64748B;'>" + escapeHtml(it.description) + "</small>" : "") + "</td>" +
      "<td><span class='badge " + badgeClass + "'>" + it.type + "</span></td>" +
      "<td>" + escapeHtml(it.category) + "</td>" +
      "<td>" + escapeHtml(it.location) + "</td>" +
      "<td>" + it.date + "</td>" +
      "<td><strong>" + escapeHtml(it.contactName) + "</strong><br><small><a href='mailto:" + 
        escapeHtml(it.contactEmail) + "'>" + escapeHtml(it.contactEmail) + "</a></small></td>" +
      "<td><span class='badge " + statusBadgeClass + "'>" + it.status + "</span></td>";
    tableBody.appendChild(row);
  }
}
```

### 3.2 Explanation of Main Module Logic
1. **State Management (`activeFilterTab`)**: The application tracks the user's active view state (`All`, `Lost`, `Found`, or `Returned`). Clicking any tab updates this variable and immediately re-triggers filtering.
2. **Multi-Condition Search Algorithm (`searchItems`)**: The function loops through the item records and evaluates three conditions simultaneously:
   - **Text Condition**: Substring match across item title, description, and location using JavaScript `indexOf()`.
   - **Tab Status Condition**: Verifies if the item type and active status align with the chosen tab.
   - **Category Condition**: Filters against the chosen category dropdown.
3. **Safe Dynamic DOM Manipulation (`renderViewItemsTable`)**: The filtered items are converted to HTML table rows using standard DOM APIs (`document.createElement('tr')`, `tableBody.appendChild(row)`). All user inputs pass through an `escapeHtml()` sanitizer function to prevent Cross-Site Scripting (XSS).
4. **Backend Database Synchronization (`api.php`)**: When running in an Apache/MySQL environment, client-side actions issue non-blocking asynchronous `fetch()` requests to `api.php`, ensuring changes persist in the MySQL `lost_found_db` database while falling back to browser `localStorage` when offline.

---

## 4. CONCLUSION

The **Campus Lost & Found Portal** successfully addresses the challenge of managing lost and found belongings on a college campus. By combining clean HTML5, modular CSS3 styling, and responsive Vanilla JavaScript with a reliable MySQL database backend, the system delivers a fast, user-friendly, and accessible tool for the student body. 

The application removes the delays of manual notice boards and physical inquiry desks, streamlining the process of reporting, discovering, and reclaiming misplaced articles. The dual-storage design ensures that the interface operates seamlessly in offline environments while syncing with an enterprise-grade MySQL database when connected. Overall, the project achieves its intended objective of improving campus student support services through practical web technology.

---

## 5. LEARNING OUTCOMES

Through the conceptualization, design, and implementation of this project, the following core technical and analytical skills were gained:

1. **Semantic HTML5 & Responsive Layouts**:
   - Mastered the use of semantic HTML5 structural tags (`<header>`, `<nav>`, `<main>`, `<table>`, `<form>`).
   - Designed clean, accessible web forms using custom input groups, date pickers, and textareas.
2. **CSS3 Styling & UI/UX Principles**:
   - Applied a professional, collegiate color scheme (Academic Navy `#16325C`, Gold `#D97706`, and Slate `#F4F6F9`).
   - Built custom responsive navigation bars, interactive tab indicators, and status badges without relying on heavy external frameworks.
3. **Vanilla JavaScript & DOM Manipulation**:
   - Gained deep hands-on experience manipulating the Document Object Model (DOM) dynamically without external libraries like jQuery.
   - Implemented real-time event listeners (`keyup`, `click`, `change`) for instant client-side search and multi-criteria filtering.
   - Utilized HTML5 `localStorage` for client-side state persistence and JSON parsing.
4. **Relational Database Design & MySQL Management**:
   - Designed a normalized relational database schema (`lost_found_db`) with appropriate data types (`ENUM`, `VARCHAR`, `TEXT`, `TIMESTAMP`).
   - Configured and managed MySQL tables, indices, and auto-increment keys using phpMyAdmin and SQL scripts.
   - Solved port-binding and service conflicts on Windows by configuring services to port `3307`.
5. **Backend Integration with PHP & RESTful Principles**:
   - Created a lightweight API bridge (`api.php`) utilizing PHP Data Objects (PDO) with prepared statements to protect against SQL Injection.
   - Implemented standard CRUD operations (Create, Read, Update, Delete) via HTTP requests (`GET`, `POST`).

---

## 6. GITHUB REPOSITORY LINK & DEPLOYMENT

- **GitHub Repository**: [https://github.com/rishitchitroda/campus-lost-and-found-portal](https://github.com/rishitchitroda/campus-lost-and-found-portal) *(Replace with your GitHub repository link)*
- **Local Deployment URL**: `http://localhost/lost-found-portal/index.html`
- **Database Management URL**: `http://localhost/phpmyadmin/index.php?route=/database/structure&db=lost_found_db`
- **Environment**: XAMPP (Apache 2.4, PHP 8.2, MariaDB/MySQL on Port 3307)
