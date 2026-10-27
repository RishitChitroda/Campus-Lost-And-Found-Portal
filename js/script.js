// Campus Lost & Found Portal - JavaScript
// Clean, student-level script with dynamic DOM rendering, in-page tabs, and localStorage

// Default sample items for first-time load (plain data, no icon thumbnails)
var defaultItems = [
  { id: 101, name: "HP Wireless Mouse", type: "Lost", category: "Electronics", location: "Computer Lab 2", date: "2026-10-10", description: "Black HP wireless mouse with USB dongle.", contactName: "Rahul Sharma", contactEmail: "rahul@college.edu", status: "Active" },
  { id: 102, name: "College ID Card", type: "Found", category: "Documents/ID Cards", location: "Library Reading Room", date: "2026-10-11", description: "Student ID card belonging to Roll No 45.", contactName: "Priya Patel", contactEmail: "priya@college.edu", status: "Active" },
  { id: 103, name: "Blue Water Bottle", type: "Lost", category: "Accessories", location: "Main Canteen", date: "2026-10-12", description: "Milton steel water bottle, blue color.", contactName: "Amit Kumar", contactEmail: "amit@college.edu", status: "Active" },
  { id: 104, name: "Scientific Calculator", type: "Found", category: "Electronics", location: "Room 304", date: "2026-10-13", description: "Casio fx-991EX scientific calculator.", contactName: "Ananya Roy", contactEmail: "ananya@college.edu", status: "Active" },
  { id: 105, name: "Engineering Mathematics Book", type: "Lost", category: "Books/Stationery", location: "Central Workshop", date: "2026-10-14", description: "Higher Engineering Mathematics by B.S. Grewal.", contactName: "Vikas Singh", contactEmail: "vikas@college.edu", status: "Returned" }
];

// Function to get items from localStorage
function getItems() {
  var storedItems = localStorage.getItem("campus_lost_found_items");
  if (!storedItems) {
    localStorage.setItem("campus_lost_found_items", JSON.stringify(defaultItems));
    return defaultItems;
  }
  try {
    var parsed = JSON.parse(storedItems);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {}
  return defaultItems;
}

// Function to save items array to localStorage
function saveItems(items) {
  localStorage.setItem("campus_lost_found_items", JSON.stringify(items));
}

// Safe HTML escape helper
function escapeHtml(text) {
  if (typeof text !== "string") {
    return text || "";
  }
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Optional background sync with MySQL database if running under XAMPP
function syncWithDatabase() {
  fetch("backend/api.php?action=get_items")
    .then(function (res) { return res.json(); })
    .then(function (result) {
      if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
        saveItems(result.data);
        if (document.getElementById("home-items-table")) loadHomePage();
        if (document.getElementById("view-items-table")) loadViewItemsPage();
        if (document.getElementById("manage-items-table")) loadManageItemsPage();
      }
    })
    .catch(function () {
      // Offline mode or direct file:// view
    });
}

// ==========================================
// 1. HOME PAGE LOGIC
// ==========================================
function loadHomePage() {
  var items = getItems();

  var totalCount = items.length;
  var lostCount = 0;
  var foundCount = 0;

  for (var i = 0; i < items.length; i++) {
    if (items[i].status === "Active") {
      if (items[i].type === "Lost") lostCount++;
      else if (items[i].type === "Found") foundCount++;
    }
  }

  var totalElem = document.getElementById("total-items");
  var lostElem = document.getElementById("total-lost");
  var foundElem = document.getElementById("total-found");

  if (totalElem) totalElem.textContent = totalCount;
  if (lostElem) lostElem.textContent = lostCount;
  if (foundElem) foundElem.textContent = foundCount;

  var tableBody = document.getElementById("home-items-table");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  var activeItems = [];
  for (var k = 0; k < items.length; k++) {
    if (items[k].status === "Active") {
      activeItems.push(items[k]);
    }
  }

  if (activeItems.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='7' style='text-align:center; padding: 18px;'>No active items reported currently.</td></tr>";
    return;
  }

  var displayLimit = Math.min(activeItems.length, 6);
  for (var j = 0; j < displayLimit; j++) {
    var it = activeItems[j];
    var badgeClass = it.type === "Lost" ? "badge-lost" : "badge-found";

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>#" + it.id + "</td>" +
      "<td><strong>" + escapeHtml(it.name) + "</strong></td>" +
      "<td><span class='badge " + badgeClass + "'>" + it.type + "</span></td>" +
      "<td>" + escapeHtml(it.category) + "</td>" +
      "<td>" + escapeHtml(it.location) + "</td>" +
      "<td>" + it.date + "</td>" +
      "<td><a href='items.html' class='btn btn-outline' style='padding: 4px 10px; font-size: 12px;'>View</a></td>";
    tableBody.appendChild(row);
  }
}

// ==========================================
// 2. VIEW ITEMS & INTERACTIVE TABS LOGIC
// ==========================================
var activeFilterTab = "All";

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

  var elAll = document.getElementById("tab-count-all");
  var elLost = document.getElementById("tab-count-lost");
  var elFound = document.getElementById("tab-count-found");
  var elReturned = document.getElementById("tab-count-returned");

  if (elAll) elAll.textContent = countAll;
  if (elLost) elLost.textContent = countLost;
  if (elFound) elFound.textContent = countFound;
  if (elReturned) elReturned.textContent = countReturned;
}

function renderViewItemsTable(itemsToDisplay) {
  var tableBody = document.getElementById("view-items-table");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  if (itemsToDisplay.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='8' style='text-align:center; padding: 22px; color: #64748B;'>No matching items found. Try adjusting your search query or filter tab.</td></tr>";
    return;
  }

  for (var i = 0; i < itemsToDisplay.length; i++) {
    var it = itemsToDisplay[i];
    var badgeClass = it.type === "Lost" ? "badge-lost" : "badge-found";
    var statusBadgeClass = it.status === "Active" ? "badge-active" : "badge-returned";

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>#" + it.id + "</td>" +
      "<td><strong>" + escapeHtml(it.name) + "</strong>" + (it.description ? "<br><small style='color:#64748B;'>" + escapeHtml(it.description) + "</small>" : "") + "</td>" +
      "<td><span class='badge " + badgeClass + "'>" + it.type + "</span></td>" +
      "<td>" + escapeHtml(it.category) + "</td>" +
      "<td>" + escapeHtml(it.location) + "</td>" +
      "<td>" + it.date + "</td>" +
      "<td><strong>" + escapeHtml(it.contactName) + "</strong><br><small><a href='mailto:" + escapeHtml(it.contactEmail) + "' style='color:#1D4ED8;'>" + escapeHtml(it.contactEmail) + "</a></small></td>" +
      "<td><span class='badge " + statusBadgeClass + "'>" + it.status + "</span></td>";
    tableBody.appendChild(row);
  }
}

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

    // Text query match
    var matchesText = query === "" || name.indexOf(query) !== -1 || desc.indexOf(query) !== -1 || loc.indexOf(query) !== -1;

    // In-Page Filter Tab match
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

function loadViewItemsPage() {
  updateTabCounts();
  searchItems();

  var searchInput = document.getElementById("search-input");
  var searchBtn = document.getElementById("search-btn");
  var categorySelect = document.getElementById("category-filter");
  var resetBtn = document.getElementById("reset-btn");

  if (searchInput) {
    searchInput.addEventListener("keyup", searchItems);
  }
  if (searchBtn) {
    searchBtn.addEventListener("click", searchItems);
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", searchItems);
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (searchInput) searchInput.value = "";
      if (categorySelect) categorySelect.value = "All";
      activeFilterTab = "All";
      var tabs = document.querySelectorAll(".filter-tab");
      tabs.forEach(function (t) {
        if (t.getAttribute("data-type") === "All") t.classList.add("active");
        else t.classList.remove("active");
      });
      searchItems();
    });
  }

  // Bind click events on in-page filter tabs
  var filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      filterTabs.forEach(function (t) { t.classList.remove("active"); });
      this.classList.add("active");
      activeFilterTab = this.getAttribute("data-type");
      searchItems();
    });
  });
}

// ==========================================
// 3. REPORT ITEM LOGIC (FORM TABS)
// ==========================================
window.selectReportType = function(type) {
  var typeInput = document.getElementById("item-type");
  var tabLost = document.getElementById("tab-btn-lost");
  var tabFound = document.getElementById("tab-btn-found");
  var labelLocation = document.getElementById("label-location");
  var submitBtn = document.getElementById("submit-report-btn");

  if (typeInput) typeInput.value = type;

  if (type === "Lost") {
    if (tabLost) tabLost.className = "form-type-btn active lost";
    if (tabFound) tabFound.className = "form-type-btn found";
    if (labelLocation) labelLocation.textContent = "Location where item was Lost *";
    if (submitBtn) {
      submitBtn.textContent = "Submit Lost Report";
      submitBtn.className = "btn btn-blue";
    }
  } else {
    if (tabLost) tabLost.className = "form-type-btn lost";
    if (tabFound) tabFound.className = "form-type-btn active found";
    if (labelLocation) labelLocation.textContent = "Location where item was Found *";
    if (submitBtn) {
      submitBtn.textContent = "Submit Found Report";
      submitBtn.className = "btn btn-green";
    }
  }
};

function loadReportPage() {
  var form = document.getElementById("report-form");
  if (!form) return;

  var dateInput = document.getElementById("item-date");
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().split("T")[0];
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nameInput = document.getElementById("item-name");
    var typeInput = document.getElementById("item-type");
    var categoryInput = document.getElementById("item-category");
    var locationInput = document.getElementById("item-location");
    var dateInput = document.getElementById("item-date");
    var descInput = document.getElementById("item-desc");
    var contactNameInput = document.getElementById("contact-name");
    var contactEmailInput = document.getElementById("contact-email");

    var name = nameInput.value.trim();
    var type = typeInput ? typeInput.value : "Lost";
    var category = categoryInput.value;
    var location = locationInput.value.trim();
    var dateVal = dateInput.value;
    var description = descInput.value.trim();
    var contactName = contactNameInput.value.trim();
    var contactEmail = contactEmailInput.value.trim();

    if (!name || !category || !location || !dateVal || !description || !contactName || !contactEmail) {
      alert("Please fill in all required fields marked with *.");
      return;
    }

    var items = getItems();

    var newId = 101;
    if (items.length > 0) {
      var maxId = 0;
      for (var i = 0; i < items.length; i++) {
        if (items[i].id > maxId) maxId = items[i].id;
      }
      newId = maxId + 1;
    }

    var newItem = {
      id: newId,
      name: name,
      type: type,
      category: category,
      location: location,
      date: dateVal,
      description: description,
      contactName: contactName,
      contactEmail: contactEmail,
      status: "Active"
    };

    items.unshift(newItem);
    saveItems(items);

    // Sync with MySQL if running on server
    fetch("backend/api.php?action=add_item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    }).catch(function () {});

    alert("Report filed successfully!\n\nReport ID: #" + newId + "\nType: " + type + "\nItem: " + name + "\n\nStudents can now search and contact you about this item.");
    form.reset();
    if (dateInput) {
      dateInput.value = new Date().toISOString().split("T")[0];
    }
    window.location.href = "items.html";
  });
}

// ==========================================
// 4. MANAGE ITEMS LOGIC
// ==========================================
function renderManageItemsTable() {
  var tableBody = document.getElementById("manage-items-table");
  if (!tableBody) return;

  var items = getItems();
  tableBody.innerHTML = "";

  if (items.length === 0) {
    tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center; padding: 20px;'>No items available to manage.</td></tr>";
    return;
  }

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var badgeClass = it.type === "Lost" ? "badge-lost" : "badge-found";
    var statusBadgeClass = it.status === "Active" ? "badge-active" : "badge-returned";

    var actionButtons = "";
    if (it.status === "Active") {
      actionButtons += "<button class='btn btn-green' style='padding: 5px 10px; font-size: 12px;' onclick='markItemReturned(" + it.id + ")'>Mark Returned</button>";
    } else {
      actionButtons += "<span style='margin-right:8px; color:#64748B; font-size: 12px; font-style: italic;'>Completed</span>";
    }

    actionButtons += "<button class='btn btn-red' style='padding: 5px 10px; font-size: 12px;' onclick='deleteItem(" + it.id + ")'>Delete</button>";

    var row = document.createElement("tr");
    row.innerHTML =
      "<td>#" + it.id + "</td>" +
      "<td><strong>" + escapeHtml(it.name) + "</strong></td>" +
      "<td><span class='badge " + badgeClass + "'>" + it.type + "</span></td>" +
      "<td>" + escapeHtml(it.category) + "</td>" +
      "<td><span class='badge " + statusBadgeClass + "'>" + it.status + "</span></td>" +
      "<td class='actions-cell'>" + actionButtons + "</td>";
    tableBody.appendChild(row);
  }
}

function markItemReturned(itemId) {
  var confirmAction = confirm("Are you sure you want to mark this item as Returned / Claimed?");
  if (!confirmAction) return;

  var items = getItems();
  for (var i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      items[i].status = "Returned";
      saveItems(items);
      alert("Report #" + itemId + " (" + items[i].name + ") has been marked as Returned.");
      break;
    }
  }

  fetch("backend/api.php?action=mark_returned&id=" + itemId).catch(function () {});
  renderManageItemsTable();
}

function deleteItem(itemId) {
  var confirmDelete = confirm("Are you sure you want to permanently delete this report?");
  if (!confirmDelete) return;

  var items = getItems();
  var updatedItems = [];
  var deletedName = "";

  for (var i = 0; i < items.length; i++) {
    if (items[i].id === itemId) {
      deletedName = items[i].name;
    } else {
      updatedItems.push(items[i]);
    }
  }

  saveItems(updatedItems);
  fetch("backend/api.php?action=delete_item&id=" + itemId).catch(function () {});

  alert("Item #" + itemId + " (" + deletedName + ") was deleted.");
  renderManageItemsTable();
}

function loadManageItemsPage() {
  renderManageItemsTable();
}

// ==========================================
// INITIALIZATION ON PAGE LOAD
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
  getItems();

  if (document.getElementById("home-items-table")) {
    loadHomePage();
  }
  if (document.getElementById("view-items-table")) {
    loadViewItemsPage();
  }
  if (document.getElementById("report-form")) {
    loadReportPage();
  }
  if (document.getElementById("manage-items-table")) {
    loadManageItemsPage();
  }

  syncWithDatabase();
});
