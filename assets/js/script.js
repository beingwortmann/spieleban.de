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

// Store all project data globally
let allProjectsData = [];

// Load and display projects and filters
async function loadProjects() {
  try {
    const response = await fetch('./assets/js/projekte.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allProjectsData = await response.json(); // Store projects globally

    const projectList = document.querySelector(".project-list");
    const filterListType = document.getElementById("filter-list-type");
    const filterListGenre = document.getElementById("filter-list-genre");
    const selectListTypeContainer = document.querySelector("[data-select-type] + .select-list");
    const selectListGenreContainer = document.querySelector("[data-select-genre] + .select-list");

    if (!projectList || !filterListType || !filterListGenre || !selectListTypeContainer || !selectListGenreContainer) {
      console.error("Required DOM elements for projects or filters not found.");
      return;
    }

    projectList.innerHTML = ''; // Clear existing projects
    filterListType.innerHTML = '';
    filterListGenre.innerHTML = '';
    selectListTypeContainer.innerHTML = '';
    selectListGenreContainer.innerHTML = '';

    const types = new Set();
    const genres = new Set();
    allProjectsData.forEach(project => {
      types.add(project.type);
      genres.add(project.genre);

      const listItem = document.createElement("li");
      listItem.classList.add("project-item");
      listItem.dataset.filterType = project.type;
      listItem.dataset.filterGenre = project.genre;

      listItem.innerHTML = `
        <a href="#">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img src="${project.image}" alt="${project.name}" loading="lazy">
          </figure>
          <h3 class="project-title">${project.name}</h3>
          <p class="project-category">${project.type} - ${project.genre}</p>
        </a>
      `;
      projectList.appendChild(listItem);
    });

    // Create "Alle" options first
    createFilterButton("Alle Typen", "type", filterListType, false);
    createFilterButton("Alle Genres", "genre", filterListGenre, false);
    createFilterButton("Alle Typen", "type", selectListTypeContainer, true);
    createFilterButton("Alle Genres", "genre", selectListGenreContainer, true);

    types.forEach(type => {
      createFilterButton(type, "type", filterListType);
      createFilterButton(type, "type", selectListTypeContainer, true);
    });
    genres.forEach(genre => {
      createFilterButton(genre, "genre", filterListGenre);
      createFilterButton(genre, "genre", selectListGenreContainer, true);
    });

    filterItems = document.querySelectorAll(".project-item");
    initializePortfolioSelectorsAndListeners(); 

    currentFilterType = "Alle Typen";
    currentFilterGenre = "Alle Genres";

    // Set initial active visual states for buttons
    if (filterBtnType) {
        const alleTypenBtn = Array.from(filterBtnType).find(btn => btn.textContent === "Alle Typen");
        if (alleTypenBtn) {
            alleTypenBtn.classList.add("active");
            lastClickedBtnType = alleTypenBtn;
        }
    }
    if (filterBtnGenre) {
        const alleGenresBtn = Array.from(filterBtnGenre).find(btn => btn.textContent === "Alle Genres");
        if (alleGenresBtn) {
            alleGenresBtn.classList.add("active");
            lastClickedBtnGenre = alleGenresBtn;
        }
    }
    
    if (selectValueType) selectValueType.innerText = "Alle Typen";
    if (selectValueGenre) selectValueGenre.innerText = "Alle Genres";
    
    applyCurrentFiltersAndRefreshStates(); // Initial display and filter state update

  } catch (error) {
    console.error("Fehler beim Laden der Projektdaten:", error);
  }
}

function createFilterButton(value, category, container, isSelect = false) {
  const listItem = document.createElement("li");
  if (!isSelect) {
    listItem.classList.add("filter-item");
  } else {
    listItem.classList.add("select-item");
  }

  const button = document.createElement("button");
  button.textContent = value;
  if (category === 'type') {
    if (isSelect) button.dataset.selectItemType = value;
    else button.dataset.filterBtnType = value;
  }
  if (category === 'genre') {
    if (isSelect) button.dataset.selectItemGenre = value;
    else button.dataset.filterBtnGenre = value;
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
    // selectItemsType will be populated by loadProjects, then queried in addEventListenersToFilterButtons

    selectGenre = document.querySelector("[data-select-genre]");
    selectValueGenre = document.querySelector("[data-select-value-genre]");
    // selectItemsGenre will be populated by loadProjects, then queried in addEventListenersToFilterButtons

    if (selectType) {
        selectType.addEventListener("click", function () { elementToggleFunc(this); });
    }
    if (selectGenre) {
        selectGenre.addEventListener("click", function () { elementToggleFunc(this); });
    }
    addEventListenersToFilterButtons();
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
            if (this.disabled) return; // Do nothing if button is disabled
            if (lastClickedBtnType) lastClickedBtnType.classList.remove("active");
            this.classList.add("active");
            lastClickedBtnType = this;
            filterFunc(this.textContent, "type");
        });
    });

    filterBtnGenre.forEach(btn => {
        btn.addEventListener("click", function () {
            if (this.disabled) return; // Do nothing if button is disabled
            if (lastClickedBtnGenre) lastClickedBtnGenre.classList.remove("active");
            this.classList.add("active");
            lastClickedBtnGenre = this;
            filterFunc(this.textContent, "genre");
        });
    });

    selectItemsType.forEach(item => { // item is the button inside li.select-item
        item.addEventListener("click", function () {
            if (this.disabled) return; // Do nothing if button is disabled
            selectValueType.innerText = this.textContent;
            filterFunc(this.textContent, "type");
            elementToggleFunc(selectType); // Close dropdown
        });
    });

    selectItemsGenre.forEach(item => { // item is the button inside li.select-item
        item.addEventListener("click", function () {
            if (this.disabled) return; // Do nothing if button is disabled
            selectValueGenre.innerText = this.textContent;
            filterFunc(this.textContent, "genre");
            elementToggleFunc(selectGenre); // Close dropdown
        });
    });
}


// Store current filters
let currentFilterType = "Alle Typen";
let currentFilterGenre = "Alle Genres";

const filterFunc = function (selectedValue, filterCategory) {
  if (filterCategory === 'type') {
    currentFilterType = selectedValue;
  } else if (filterCategory === 'genre') {
    currentFilterGenre = selectedValue;
  }
  applyCurrentFiltersAndRefreshStates();
};

function applyCurrentFiltersAndRefreshStates() {
  if (!filterItems || filterItems.length === 0) {
    return;
  }

  for (let i = 0; i < filterItems.length; i++) {
    const projectItem = filterItems[i];
    const projectType = projectItem.dataset.filterType.toLowerCase();
    const projectGenre = projectItem.dataset.filterGenre.toLowerCase();

    const typeMatch = currentFilterType === "Alle Typen" || projectType === currentFilterType.toLowerCase();
    const genreMatch = currentFilterGenre === "Alle Genres" || projectGenre === currentFilterGenre.toLowerCase();

    if (typeMatch && genreMatch) {
      projectItem.classList.add("active");
    } else {
      projectItem.classList.remove("active");
    }
  }
  updateFilterStates();
}

function updateFilterStates() {
  if (allProjectsData.length === 0) return;

  const allTypeButtons = document.querySelectorAll("[data-filter-btn-type], [data-select-item-type]");
  const allGenreButtons = document.querySelectorAll("[data-filter-btn-genre], [data-select-item-genre]");

  // Update Type Filters
  allTypeButtons.forEach(button => {
    const potentialType = button.textContent;
    let count = 0;
    if (potentialType === "Alle Typen") {
        count = allProjectsData.filter(project =>
            currentFilterGenre === "Alle Genres" || project.genre.toLowerCase() === currentFilterGenre.toLowerCase()
        ).length;
    } else {
        count = allProjectsData.filter(project =>
            project.type.toLowerCase() === potentialType.toLowerCase() &&
            (currentFilterGenre === "Alle Genres" || project.genre.toLowerCase() === currentFilterGenre.toLowerCase())
        ).length;
    }
    button.disabled = count === 0;
  });

  // Update Genre Filters
  allGenreButtons.forEach(button => {
    const potentialGenre = button.textContent;
    let count = 0;
    if (potentialGenre === "Alle Genres") {
        count = allProjectsData.filter(project =>
            currentFilterType === "Alle Typen" || project.type.toLowerCase() === currentFilterType.toLowerCase()
        ).length;
    } else {
        count = allProjectsData.filter(project =>
            project.genre.toLowerCase() === potentialGenre.toLowerCase() &&
            (currentFilterType === "Alle Typen" || project.type.toLowerCase() === currentFilterType.toLowerCase())
        ).length;
    }
    button.disabled = count === 0;
  });
}

// Initial load functions
window.addEventListener('load', () => {
  loadEvents();
  loadProjects();
  loadTeamMembers();
});