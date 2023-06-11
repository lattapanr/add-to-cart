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
const appSetting = {
  databaseURL:
    "https://realtime-database-d978f-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

// Initialize Firebase app
const app = initializeApp(appSetting);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

// Get elements from HTML
const inputField = document.getElementById("input-field");
const addButton = document.getElementById("add-button");
const categoryButtons = document.querySelectorAll(".category-button");
const shoppingListEl = document.getElementById("shopping-list");
let backgroundColor = "";

// Utility functions
const clearInputField = () => (inputField.value = "");
const clearShoppingListEl = () => (shoppingListEl.innerHTML = "");

// Add event listener to category buttons
function getCategoryButtonBackgroundColor() {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("selected");

      backgroundColor = getCategoryColor(button.id);
    });
  });
}
getCategoryButtonBackgroundColor();

// Add event listener to the add button
addButton.addEventListener("click", () => {
  let inputValue = inputField.value;

  // Check if a category button is selected
  // If not, display an alert and exit the function
  const selectedCategory = document.querySelector(".category-button.selected");
  if (!selectedCategory) {
    alert("Please select a category");
    return;
  }

  // Push value and background color to database
  const newItemRef = push(shoppingListInDB);
  const newItemData = {
    value: inputValue,
    backgroundColor: getCategoryColor(selectedCategory.id),
  };
  set(newItemRef, newItemData);

  // Reset values
  clearInputField();

  selectedCategory.classList.remove("selected");
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToShoppingList(currentItem);
    }
  } else {
    shoppingListEl.innerHTML = "No items here... yet";
  }
});

function appendItemToShoppingList(item) {
  let itemID = item[0];
  let itemValue = item[1].value;
  let itemBackgroundColor = item[1].backgroundColor;

  const listItem = document.createElement("li");
  listItem.classList.add("list-item");
  listItem.textContent = itemValue;
  listItem.style.backgroundColor = itemBackgroundColor;
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
