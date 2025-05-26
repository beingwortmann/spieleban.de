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
    const filterListTypeContainer = document.getElementById("filter-list-type");
    const filterListGenreContainer = document.getElementById("filter-list-genre");
    const selectListTypeContainer = document.getElementById("select-list-type"); // Corrected
    const selectListGenreContainer = document.getElementById("select-list-genre"); // Corrected


    if (!projectListContainer || !filterListTypeContainer || !filterListGenreContainer || !selectListTypeContainer || !selectListGenreContainer) {
      console.error("Einige Projekt- oder Filtercontainer wurden nicht gefunden.");
      return;
    }

    projectListContainer.innerHTML = '';
    filterListTypeContainer.innerHTML = '';
    filterListGenreContainer.innerHTML = '';
    selectListTypeContainer.innerHTML = '';
    selectListGenreContainer.innerHTML = '';

    // Populate "Alle" options first
    createFilterButton("Alle Typen", 'type', filterListTypeContainer, false, true);
    createFilterButton("Alle Genres", 'genre', filterListGenreContainer, false, true);
    createFilterButton("Alle Typen", 'type', selectListTypeContainer, true, true);
    createFilterButton("Alle Genres", 'genre', selectListGenreContainer, true, true);


    const allTypes = new Set();
    const allGenres = new Set();
    projects.forEach(project => {
      project.types.forEach(type => allTypes.add(type));
      project.genres.forEach(genre => allGenres.add(genre));
    });

    allTypes.forEach(type => {
      createFilterButton(type, 'type', filterListTypeContainer);
      createFilterButton(type, 'type', selectListTypeContainer, true);
    });
    allGenres.forEach(genre => {
      createFilterButton(genre, 'genre', filterListGenreContainer);
      createFilterButton(genre, 'genre', selectListGenreContainer, true);
    });

    projects.forEach(project => {
      const listItem = document.createElement("li");
      listItem.classList.add("project-item", "active");
      listItem.dataset.type = project.types.join(',').toLowerCase();
      listItem.dataset.genre = project.genres.join(',').toLowerCase();
      listItem.dataset.id = project.id; // Store project ID

      listItem.innerHTML = `
        <a href="#">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img src="${project.image}" alt="${project.name}" loading="lazy">
          </figure>
          <h3 class="project-title">${project.name}</h3>
          <p class="project-category">${project.types.join(' / ')}</p>
          <p class="project-category">${project.genres.join(' / ')}</p>
        </a>
      `;
      projectListContainer.appendChild(listItem);
    });

    filterItems = document.querySelectorAll(".project-item");
    initializePortfolioSelectorsAndListeners(); // Make sure this is called after projects are loaded
    updateFilterButtonsState(); // Initial update of button states

  } catch (error) {
    console.error("Fehler beim Laden der Projektdaten:", error);
  }
}

function createFilterButton(value, category, container, isSelect = false, isActive = false) {
  const listItem = document.createElement("li");
  if (!isSelect) {
    listItem.classList.add("filter-item");
  } else {
    listItem.classList.add("select-item");
  }

  const button = document.createElement("button");
  button.textContent = value;
  if (category === 'type') {
    if (isSelect) {
      button.dataset.selectItemType = true; // For select/dropdown filters
    } else {
      button.dataset.filterBtnType = true; // For desktop/button filters
    }
  }
  if (category === 'genre') {
    if (isSelect) {
      button.dataset.selectItemGenre = true; // For select/dropdown filters
    } else {
      button.dataset.filterBtnGenre = true; // For desktop/button filters
    }
  }

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
            filterByType(this.textContent);
            filterBtnType.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            if (selectValueType) selectValueType.textContent = this.textContent;
            // Sync select dropdown
            selectItemsType.forEach(item => {
                if (item.textContent === this.textContent) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        });
    });

    filterBtnGenre.forEach(btn => {
        btn.addEventListener("click", function () {
            filterByGenre(this.textContent);
            filterBtnGenre.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            if (selectValueGenre) selectValueGenre.textContent = this.textContent;
            // Sync select dropdown
            selectItemsGenre.forEach(item => {
                if (item.textContent === this.textContent) {
                    item.classList.add("active");
                } else {
                    item.classList.remove("active");
                }
            });
        });
    });

    selectItemsType.forEach(item => {
        item.addEventListener("click", function () {
            if (selectValueType) selectValueType.textContent = this.textContent;
            filterByType(this.textContent);
            if (selectType) elementToggleFunc(selectType);
            // Sync desktop buttons
            filterBtnType.forEach(btn => {
                if (btn.textContent === this.textContent) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        });
    });

    selectItemsGenre.forEach(item => {
        item.addEventListener("click", function () {
            if (selectValueGenre) selectValueGenre.textContent = this.textContent;
            filterByGenre(this.textContent);
            if (selectGenre) elementToggleFunc(selectGenre);
            // Sync desktop buttons
            filterBtnGenre.forEach(btn => {
                if (btn.textContent === this.textContent) {
                    btn.classList.add("active");
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

const filterByType = function (type) {
    currentFilterType = type;
    applyFilters();
};

const filterByGenre = function (genre) {
    currentFilterGenre = genre;
    applyFilters();
};

const applyFilters = function () {
    if (!filterItems || filterItems.length === 0) {
        console.warn("Keine Projektelemente zum Filtern vorhanden.");
        return;
    }

    const normalizedFilterType = currentFilterType.toLowerCase();
    const normalizedFilterGenre = currentFilterGenre.toLowerCase();

    for (let i = 0; i < filterItems.length; i++) {
        const item = filterItems[i];
        const itemTypes = item.dataset.type.toLowerCase();
        const itemGenres = item.dataset.genre.toLowerCase();

        const typeMatch = normalizedFilterType === "alle typen" || itemTypes.includes(normalizedFilterType);
        const genreMatch = normalizedFilterGenre === "alle genres" || itemGenres.includes(normalizedFilterGenre);

        if (typeMatch && genreMatch) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    }
    updateFilterButtonsState(); // Update button states after filtering
};

function updateFilterButtonsState() {
    const allProjectItems = Array.from(document.querySelectorAll(".project-item")); // Get all project items, not just currently filtered ones

    // Update Type Filters
    filterBtnType.forEach(btn => {
        const typeValue = btn.textContent.toLowerCase();
        if (typeValue === "alle typen") {
            btn.classList.remove("disabled"); // "Alle Typen" should never be disabled
            return;
        }
        const wouldHaveResults = allProjectItems.some(item => {
            const itemTypes = item.dataset.type.toLowerCase();
            const itemGenres = item.dataset.genre.toLowerCase();
            const typeMatch = itemTypes.includes(typeValue);
            const genreMatch = currentFilterGenre.toLowerCase() === "alle genres" || itemGenres.includes(currentFilterGenre.toLowerCase());
            return typeMatch && genreMatch;
        });
        if (wouldHaveResults) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }
    });
    selectItemsType.forEach(item => { // Also update select items
        const typeValue = item.textContent.toLowerCase();
        if (typeValue === "alle typen") {
            item.classList.remove("disabled");
            return;
        }
        const wouldHaveResults = allProjectItems.some(projectItem => {
            const itemTypes = projectItem.dataset.type.toLowerCase();
            const itemGenres = projectItem.dataset.genre.toLowerCase();
            const typeMatch = itemTypes.includes(typeValue);
            const genreMatch = currentFilterGenre.toLowerCase() === "alle genres" || itemGenres.includes(currentFilterGenre.toLowerCase());
            return typeMatch && genreMatch;
        });
        if (wouldHaveResults) {
            item.classList.remove("disabled");
        } else {
            item.classList.add("disabled");
        }
    });


    // Update Genre Filters
    filterBtnGenre.forEach(btn => {
        const genreValue = btn.textContent.toLowerCase();
        if (genreValue === "alle genres") {
            btn.classList.remove("disabled"); // "Alle Genres" should never be disabled
            return;
        }
        const wouldHaveResults = allProjectItems.some(item => {
            const itemTypes = item.dataset.type.toLowerCase();
            const itemGenres = item.dataset.genre.toLowerCase();
            const typeMatch = currentFilterType.toLowerCase() === "alle typen" || itemTypes.includes(currentFilterType.toLowerCase());
            const genreMatch = itemGenres.includes(genreValue);
            return typeMatch && genreMatch;
        });
        if (wouldHaveResults) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }
    });
    selectItemsGenre.forEach(item => { // Also update select items
        const genreValue = item.textContent.toLowerCase();
        if (genreValue === "alle genres") {
            item.classList.remove("disabled");
            return;
        }
        const wouldHaveResults = allProjectItems.some(projectItem => {
            const itemTypes = projectItem.dataset.type.toLowerCase();
            const itemGenres = projectItem.dataset.genre.toLowerCase();
            const typeMatch = currentFilterType.toLowerCase() === "alle typen" || itemTypes.includes(currentFilterType.toLowerCase());
            const genreMatch = itemGenres.includes(genreValue);
            return typeMatch && genreMatch;
        });
        if (wouldHaveResults) {
            item.classList.remove("disabled");
        } else {
            item.classList.add("disabled");
        }
    });
}


// Initial load functions
window.addEventListener('load', () => {
  loadEvents();
  loadProjects().then(() => {
    // Ensure applyFilters is called after projects and filterItems are fully initialized
    applyFilters(); // This will also call updateFilterButtonsState
  });
  loadTeamMembers();
});