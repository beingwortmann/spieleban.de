'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}

// Contact button in sidebar
const contactBtnSidebar = document.querySelector("[data-nav-link-contact]");
if (contactBtnSidebar) {
  contactBtnSidebar.addEventListener("click", function () {
    const kontaktNavLink = Array.from(navigationLinks).find(link => link.textContent.toLowerCase() === "kontakt");
    if (kontaktNavLink) {
      kontaktNavLink.click();
      if (sidebar.classList.contains("active")) {
        sidebarBtn.click();
      }
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const clickedLinkText = this.innerHTML.toLowerCase();
    for (let j = 0; j < pages.length; j++) {
      if (clickedLinkText === pages[j].dataset.page.toLowerCase()) {
        pages[j].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        // navigationLinks[j].classList.remove("active"); // Keep this line commented or remove
      }
    }
    // Ensure the clicked link itself is marked active, and others are not.
    for (let k = 0; k < navigationLinks.length; k++) {
      if (navigationLinks[k] !== this) {
        navigationLinks[k].classList.remove("active");
      }
    }
    this.classList.add("active");
  });
}


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
if (form) {
  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      if (form.checkValidity()) {
        if (formBtn) formBtn.removeAttribute("disabled");
      } else {
        if (formBtn) formBtn.setAttribute("disabled", "");
      }
    });
  }
}


// Load and display events
async function loadEvents() {
  try {
    const response = await fetch('./assets/js/veranstaltungen.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const events = await response.json();

    const upcomingEventsContainer = document.getElementById("upcoming-events-list");
    const pastEventsContainer = document.getElementById("past-events-list");

    if (!upcomingEventsContainer || !pastEventsContainer) return;

    upcomingEventsContainer.innerHTML = ''; // Clear existing static content
    pastEventsContainer.innerHTML = '';   // Clear existing static content

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    events.forEach(event => {
      const eventDate = new Date(event.dateStart); // Use dateStart for comparison
      const listItem = document.createElement('li');
      listItem.classList.add('timeline-item');
      listItem.dataset.date = event.dateStart; // Store sortable date

      const title = document.createElement('h4');
      title.classList.add('h4', 'timeline-item-title');
      title.textContent = event.title;

      const dateSpan = document.createElement('span');
      dateSpan.textContent = event.displayDate;

      const text = document.createElement('p');
      text.classList.add('timeline-text');
      text.textContent = "mit dabei: " + event.projects.join(', ');

      listItem.appendChild(title);
      listItem.appendChild(dateSpan);
      listItem.appendChild(text);

      if (eventDate >= today) {
        upcomingEventsContainer.appendChild(listItem);
      } else {
        pastEventsContainer.appendChild(listItem);
      }
    });

    sortEventList(upcomingEventsContainer, false); // Anstehende: Neueste zuerst (oben)
    sortEventList(pastEventsContainer, false);    // Vergangene: Neueste zuerst (oben)

  } catch (error) {
    console.error("Fehler beim Laden der Veranstaltungsdaten:", error);
  }
}

function sortEventList(listContainer, ascending = true) {
  const items = Array.from(listContainer.children);
  items.sort((a, b) => {
    const dateA = new Date(a.dataset.date);
    const dateB = new Date(b.dataset.date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
  items.forEach(item => listContainer.appendChild(item));
}


// Team members data
const teamMembers = [
  { name: "Sebastian Motsch", role: "Game Design & Development", image: "./assets/images/BastiMemojiRemovedBG.png" },
  { name: "Luise Motsch", role: "Illustration & Art Direction", image: "./assets/images/IsiMemojiRemovedBG.png" },
  { name: "Jannik Wortmann", role: "Project Management & Narrative Design", image: "./assets/images/JannikMemojiRemovedBG.png" }
];

// Load and display team members
function loadTeamMembers() {
  const serviceListContainer = document.querySelector("article[data-page='über uns'] .service-list");

  if (!serviceListContainer) {
    console.error("Service list container not found for team members.");
    return;
  }

  serviceListContainer.innerHTML = ''; // Clear existing, if any

  teamMembers.forEach(member => {
    const listItem = document.createElement("li");
    listItem.classList.add("service-item");

    const iconBox = document.createElement("div");
    iconBox.classList.add("service-icon-box");

    const img = document.createElement("img");
    img.src = member.image;
    img.alt = member.name;
    img.width = 60; // Adjusted size for team member images

    iconBox.appendChild(img);

    const contentBox = document.createElement("div");
    contentBox.classList.add("service-content-box");

    const title = document.createElement("h4");
    title.classList.add("h4", "service-item-title");
    title.textContent = member.name;

    const text = document.createElement("p");
    text.classList.add("service-item-text");
    text.textContent = member.role;

    contentBox.appendChild(title);
    contentBox.appendChild(text);

    listItem.appendChild(iconBox);
    listItem.appendChild(contentBox);

    serviceListContainer.appendChild(listItem);
  });
}


// Load and display projects and filters
async function loadProjects() {
  try {
    const response = await fetch('./assets/js/projekte.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const projects = await response.json();

    const projectListContainer = document.querySelector(".project-list");
    const noResultsMessageContainer = document.getElementById("no-results-message");
    const filterListTypeContainer = document.getElementById("filter-list-type");
    const filterListGenreContainer = document.getElementById("filter-list-genre");
    const selectListTypeContainer = document.getElementById("select-list-type");
    const selectListGenreContainer = document.getElementById("select-list-genre");
    const selectValueType = document.querySelector("[data-select-value-type]");
    const selectValueGenre = document.querySelector("[data-select-value-genre]");

    if (!projectListContainer || !filterListTypeContainer || !filterListGenreContainer || !selectListTypeContainer || !selectListGenreContainer || !selectValueType || !selectValueGenre) {
      console.error("Einige Portfolio-Elemente wurden nicht im DOM gefunden.");
      return;
    }

    projectListContainer.innerHTML = ''; // Clear existing static content

    const allTypes = new Set(["Alle Typen"]);
    const allGenres = new Set(["Alle Genres"]);

    projects.forEach(project => {
      project.types.forEach(type => allTypes.add(type));
      project.genres.forEach(genre => allGenres.add(genre));

      const listItem = document.createElement('li');
      listItem.classList.add('project-item', 'active'); // Start with active, filterFunc will adjust
      listItem.dataset.filterItem = ''; // Mark as a filterable item
      // Normalisiere Typen und Genres für zuverlässiges Filtern
      listItem.dataset.categoryType = project.types
        .map(type => type.toLowerCase().replace(/\\s+/g, '-'))
        .join('%%');
      listItem.dataset.categoryGenre = project.genres
        .map(genre => genre.toLowerCase().replace(/\\s+/g, '-'))
        .join('%%');

      const link = document.createElement('a');
      link.href = "#"; // Or project.link if available

      const figure = document.createElement('figure');
      figure.classList.add('project-img');

      const iconBox = document.createElement('div');
      iconBox.classList.add('project-item-icon-box');
      const icon = document.createElement('span'); // Using span for Material Icon
      icon.classList.add('material-symbols-outlined');
      icon.textContent = 'visibility'; // Example icon, replace as needed
      iconBox.appendChild(icon);

      const img = document.createElement('img');
      img.src = project.image;
      img.alt = project.name;
      img.loading = 'lazy';

      figure.appendChild(iconBox);
      figure.appendChild(img);

      const title = document.createElement('h3');
      title.classList.add('project-title');
      title.textContent = project.name;

      const category = document.createElement('p');
      category.classList.add('project-category');
      category.textContent = project.genres.join(', '); // Display genres

      link.appendChild(figure);
      link.appendChild(title);
      link.appendChild(category);
      listItem.appendChild(link);
      projectListContainer.appendChild(listItem);
    });

    // Populate Type Filters
    filterListTypeContainer.innerHTML = ''; // Clear static "Alle Typen"
    selectListTypeContainer.innerHTML = '';
    allTypes.forEach(type => {
      createFilterButton(type, 'type', filterListTypeContainer, false, type === "Alle Typen");
      createFilterButton(type, 'type', selectListTypeContainer, true, type === "Alle Typen");
    });

    // Populate Genre Filters
    filterListGenreContainer.innerHTML = ''; // Clear static "Alle Genres"
    selectListGenreContainer.innerHTML = '';
    allGenres.forEach(genre => {
      createFilterButton(genre, 'genre', filterListGenreContainer, false, genre === "Alle Genres");
      createFilterButton(genre, 'genre', selectListGenreContainer, true, genre === "Alle Genres");
    });

    // Initialize filter items for filterFunc
    filterItems = document.querySelectorAll("[data-filter-item]");
    // Initialize last clicked buttons for desktop filters
    lastClickedBtnType = filterListTypeContainer.querySelector('button.active');
    lastClickedBtnGenre = filterListGenreContainer.querySelector('button.active');


    // Add event listeners to newly created filter buttons
    addEventListenersToFilterButtons();


  } catch (error) {
    console.error("Fehler beim Laden der Projektdaten:", error);
  }
}

function createFilterButton(value, category, container, isSelect = false, isActive = false) {
  const listItem = document.createElement("li");
  if (!isSelect) listItem.classList.add("filter-item");
  else listItem.classList.add("select-item");

  const button = document.createElement("button");
  button.textContent = value; // No need to capitalize "Alle Typen" or "Alle Genres"
  if (category === 'type') button.dataset.filterBtnType = '';
  if (category === 'genre') button.dataset.filterBtnGenre = '';
  if (isSelect && category === 'type') button.dataset.selectItemType = '';
  if (isSelect && category === 'genre') button.dataset.selectItemGenre = '';

  if (isActive) {
    button.classList.add("active");
  }

  listItem.appendChild(button);
  container.appendChild(listItem);
}


// custom select variables for portfolio filtering
let selectType, selectItemsType, selectValueType;
let selectGenre, selectItemsGenre, selectValueGenre;
let filterBtnType, filterBtnGenre; // These will be NodeLists of buttons
let filterItems; // This will be a NodeList of project items
let lastClickedBtnType, lastClickedBtnGenre;

function initializePortfolioSelectorsAndListeners() {
    selectType = document.querySelector("[data-select-type]");
    selectValueType = document.querySelector("[data-select-value-type]");

    selectGenre = document.querySelector("[data-select-genre]");
    selectValueGenre = document.querySelector("[data-select-value-genre]");

    if (selectType) {
        selectType.addEventListener("click", function () { elementToggleFunc(this); });
    }
    if (selectGenre) {
        selectGenre.addEventListener("click", function () { elementToggleFunc(this); });
    }
    addEventListenersToFilterButtons(); // Call here after buttons are potentially created
}


function addEventListenersToFilterButtons() {
    // Desktop/Button Filters
    filterBtnType = document.querySelectorAll("[data-filter-btn-type]");
    filterBtnGenre = document.querySelectorAll("[data-filter-btn-genre]");

    // Select/Dropdown Filters
    selectItemsType = document.querySelectorAll("[data-select-item-type]");
    selectItemsGenre = document.querySelectorAll("[data-select-item-genre]");

    filterBtnType.forEach(btn => {
        btn.addEventListener("click", function () {
            const selectedValue = this.innerText;
            filterFunc(selectedValue, 'type');
            if (lastClickedBtnType) lastClickedBtnType.classList.remove("active");
            this.classList.add("active");
            lastClickedBtnType = this;
            if (selectValueType) selectValueType.innerText = selectedValue; // Sync select
        });
    });

    filterBtnGenre.forEach(btn => {
        btn.addEventListener("click", function () {
            const selectedValue = this.innerText;
            filterFunc(selectedValue, 'genre');
            if (lastClickedBtnGenre) lastClickedBtnGenre.classList.remove("active");
            this.classList.add("active");
            lastClickedBtnGenre = this;
            if (selectValueGenre) selectValueGenre.innerText = selectedValue; // Sync select
        });
    });

    selectItemsType.forEach(item => {
        item.addEventListener("click", function () {
            const selectedValue = this.innerText;
            if (selectValueType) selectValueType.innerText = selectedValue;
            if (selectType) elementToggleFunc(selectType);
            filterFunc(selectedValue, 'type');
            // Sync desktop buttons
            filterBtnType.forEach(btn => {
                if (btn.innerText === selectedValue) {
                    if (lastClickedBtnType) lastClickedBtnType.classList.remove("active");
                    btn.classList.add("active");
                    lastClickedBtnType = btn;
                } else {
                    btn.classList.remove("active");
                }
            });
        });
    });

    selectItemsGenre.forEach(item => {
        item.addEventListener("click", function () {
            const selectedValue = this.innerText;
            if (selectValueGenre) selectValueGenre.innerText = selectedValue;
            if (selectGenre) elementToggleFunc(selectGenre);
            filterFunc(selectedValue, 'genre');
            // Sync desktop buttons
            filterBtnGenre.forEach(btn => {
                if (btn.innerText === selectedValue) {
                    if (lastClickedBtnGenre) lastClickedBtnGenre.classList.remove("active");
                    btn.classList.add("active");
                    lastClickedBtnGenre = btn;
                } else {
                    btn.classList.remove("active");
                }
            });
        });
    });
}


// Store current filters
let currentFilterType = "Alle Typen";
let currentFilterGenre = "Alle Genres";

const filterFunc = function (selectedValue, filterCategory) {
  const normalizedSelectedValue = selectedValue.toLowerCase();

  if (filterCategory === 'type') {
    currentFilterType = normalizedSelectedValue;
  } else if (filterCategory === 'genre') {
    currentFilterGenre = normalizedSelectedValue;
  }

  if (!filterItems || filterItems.length === 0) {
    const noResultsMessageContainer = document.getElementById("no-results-message");
    if (noResultsMessageContainer) noResultsMessageContainer.style.display = 'none';
    // Ensure project list is also clear if there are no filterable items
    const projectList = document.querySelector('.project-list');
    if (projectList) projectList.innerHTML = ''; // Clear project list if no items to filter
    return;
  }

  let hasResults = false;
  for (let i = 0; i < filterItems.length; i++) {
    const item = filterItems[i];
    const itemTypes = item.dataset.categoryType ? item.dataset.categoryType.toLowerCase().split(' ') : [];
    const itemGenres = item.dataset.categoryGenre ? item.dataset.categoryGenre.toLowerCase().split(' ') : [];

    const typeMatch = (currentFilterType === "alle typen" || (itemTypes.length > 0 && itemTypes.includes(currentFilterType)));
    const genreMatch = (currentFilterGenre === "alle genres" || (itemGenres.length > 0 && itemGenres.includes(currentFilterGenre)));

    if (typeMatch && genreMatch) {
      item.classList.add("active");
      hasResults = true;
    } else {
      item.classList.remove("active");
    }
  }

  const noResultsMessageContainer = document.getElementById("no-results-message");
  if (noResultsMessageContainer) {
    if (hasResults) {
      noResultsMessageContainer.style.display = 'none';
      noResultsMessageContainer.innerHTML = '';
    } else {
      noResultsMessageContainer.style.display = 'block';
      let messageHTML = 'Mit diesen Eigenschaften haben wir noch kein Projekt veröffentlicht.';
      
      const suggestions = [];
      // Only suggest "Alle Typen" if not already selected and if it's a valid filter criteria to change
      if (currentFilterType !== "alle typen") {
        suggestions.push({text: "Allen Typen", cat: 'type', val: "Alle Typen"});
      }
      // Only suggest "Alle Genres" if not already selected and if it's a valid filter criteria to change
      if (currentFilterGenre !== "alle genres") {
         suggestions.push({text: "Allen Genres", cat: 'genre', val: "Alle Genres"});
      }

      if (suggestions.length > 0) {
        messageHTML += " Versuche es mit: ";
        suggestions.forEach((sugg, index) => {
          messageHTML += `<button class="filter-suggestion btn" data-filter-cat="${sugg.cat}" data-filter-val="${sugg.val}">${sugg.text}</button>`; // Added 'btn' class for potential styling
          if (index < suggestions.length - 1) {
            messageHTML += " oder ";
          }
        });
        messageHTML += ".";
      }
      noResultsMessageContainer.innerHTML = messageHTML;

      document.querySelectorAll('.filter-suggestion').forEach(button => {
        button.addEventListener('click', function() {
          const cat = this.dataset.filterCat;
          const val = this.dataset.filterVal;
          
          let targetButton;
          if (cat === 'type') {
            // Prefer desktop button, fallback to select item
            targetButton = Array.from(document.querySelectorAll(`[data-filter-btn-type]`)).find(b => b.innerText.toLowerCase() === val.toLowerCase());
            if (!targetButton) {
                 targetButton = Array.from(document.querySelectorAll(`[data-select-item-type]`)).find(b => b.innerText.toLowerCase() === val.toLowerCase());
            }
            if (selectValueType) selectValueType.innerText = val;
          } else { // genre
            targetButton = Array.from(document.querySelectorAll(`[data-filter-btn-genre]`)).find(b => b.innerText.toLowerCase() === val.toLowerCase());
             if (!targetButton) {
                targetButton = Array.from(document.querySelectorAll(`[data-select-item-genre]`)).find(b => b.innerText.toLowerCase() === val.toLowerCase());
             }
            if (selectValueGenre) selectValueGenre.innerText = val;
          }

          if (targetButton) {
            targetButton.click(); 
          } else {
            // Fallback if no UI button found (e.g. if filters are not fully populated yet)
            filterFunc(val, cat);
            // Manually update active states for desktop buttons if fallback is used
            if (cat === 'type') {
                document.querySelectorAll('[data-filter-btn-type]').forEach(btn => {
                    const isActive = btn.innerText.toLowerCase() === val.toLowerCase();
                    btn.classList.toggle('active', isActive);
                    if (isActive) lastClickedBtnType = btn;
                    else if (lastClickedBtnType === btn) lastClickedBtnType.classList.remove('active');
                });
            } else { // genre
                document.querySelectorAll('[data-filter-btn-genre]').forEach(btn => {
                    const isActive = btn.innerText.toLowerCase() === val.toLowerCase();
                    btn.classList.toggle('active', isActive);
                    if (isActive) lastClickedBtnGenre = btn;
                    else if (lastClickedBtnGenre === btn) lastClickedBtnGenre.classList.remove('active');
                });
            }
          }
        });
      });
    }
  }
};

// Initial load functions
window.addEventListener('load', () => {
  loadEvents();
  loadProjects().then(() => {
    initializePortfolioSelectorsAndListeners(); // Ensure this is still called
  });
  loadTeamMembers(); // Add this call
});