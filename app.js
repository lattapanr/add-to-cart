import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

// Firebase configuration
const appSettings = {
  databaseURL:
    "https://realtime-database-d978f-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase app
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// Get elements from HTML
const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const categoryButtons = document.querySelectorAll(".category-button");
const shoppingListEl = document.getElementById("shopping-list");

let selectedCategory = null;

// Utility functions
const clearInputField = () => (inputField.value = "");
const clearShoppingListEl = () => (shoppingListEl.innerHTML = "");

// Add event listener to category buttons
categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.id;
  });
});

// Add event listener to the add button
addButton.addEventListener("click", () => {
  let inputValue = inputField.value.trim();

  // Check if a category button is selected and if the input field is empty
  // If so, display an alert and exit the function
  if (!selectedCategory) {
    alert("Please select a category");
    return;
  }

  if (inputValue === "") {
    alert("Please add an item");
    return;
  }

  // Push value and background color to database
  const newItemRef = push(shoppingListInDB);
  const newItemData = {
    value: inputValue,
    category: selectedCategory,
  };
  set(newItemRef, newItemData);

  // Reset values
  clearInputField();
  selectedCategory = null;
});

onValue(shoppingListInDB, (snapshot) => {
  const items = snapshot.val();

  if (snapshot.exists()) {
    const itemsArray = Object.entries(items);
    clearShoppingListEl();

    // Extract data's ID and value to psuh to the function's parameter
    for (const [itemID, item] of itemsArray) {
      appendItemToShoppingList(itemID, item);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function appendItemToShoppingList(itemID, item) {
  const { value, category } = item;

  const listItem = document.createElement("li");
  listItem.classList.add("list-item");
  listItem.textContent = value;
  listItem.style.backgroundColor = getCategoryColor(category);
  shoppingListEl.append(listItem);

  listItem.addEventListener("click", () => {
    let exactLocationOfItemInDatabase = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDatabase);
  });
}

function getCategoryColor(color) {
  // Return the corresponding color based on the category ID
  switch (color) {
    case "food":
      return "#00bf63";
    case "health":
      return "#ffde59";
    case "hobby":
      return "#ff5757";
    case "fashion":
      return "#0cc0df";
    case "electronic":
      return "#cb6ce6";
    default:
      return "";
  }
}
