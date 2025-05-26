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

const filterFunc = function (event) {
  lastClickedFilterBtn = this;

  const selectedType = filterSelects.type.value.toLowerCase();
  const selectedGenre = filterSelects.genre.value.toLowerCase();

  // Remove 'active' class from all filter buttons
  filterBtns.forEach(btn => btn.classList.remove("active"));

  // Add 'active' class to the clicked button if it's a button
  if (this.tagName === 'BUTTON') {
    this.classList.add("active");
  }


  // Update filter values based on the event target
  if (event.target.dataset.select === 'type') {
    filterSelects.type.value = event.target.dataset.filterValue;
  } else if (event.target.dataset.select === 'genre') {
    filterSelects.genre.value = event.target.dataset.filterValue;
  }


  const currentSelectedType = filterSelects.type.value.toLowerCase();
  const currentSelectedGenre = filterSelects.genre.value.toLowerCase();

  // Update filter button states
  updateFilterStates(projects, currentSelectedType, currentSelectedGenre);


  const filteredProjects = projects.filter(project => {
    const projectType = project.type.toLowerCase();
    const projectGenres = project.tags.map(tag => tag.toLowerCase());

    const typeMatch = currentSelectedType === "alle typen" || projectType === currentSelectedType;
    const genreMatch = currentSelectedGenre === "alle genres" || projectGenres.includes(currentSelectedGenre);

    return typeMatch && genreMatch;
  });

  addProjectItems(filteredProjects);

  // Hide the "no results" message initially
  const noResultsMessage = document.getElementById('no-results-message');
  if (noResultsMessage) {
    noResultsMessage.style.display = 'none';
  }

  if (filteredProjects.length === 0) {
    // Instead of showing a message, we rely on the disabled filter options
    // to guide the user.
    // If you still want a message, you can re-enable it here.
    // For example:
    // if (noResultsMessage) {
    //   noResultsMessage.style.display = 'block';
    // }
  }
};

/**
 * Updates the enabled/disabled state of filter options.
 */
const updateFilterStates = function (allProjects, activeType, activeGenre) {
  const typeOptions = document.querySelectorAll('.filter-select[data-select="type"] .select-item, .filter-btn[data-select-value="type"]');
  const genreOptions = document.querySelectorAll('.filter-select[data-select="genre"] .select-item, .filter-btn[data-select-value="genre"]');

  // Helper function to check if a project matches a potential filter combination
  const hasMatchingProject = (project, type, genre) => {
    const projectTypeMatch = type === "alle typen" || project.type.toLowerCase() === type;
    const projectGenreMatch = genre === "alle genres" || project.tags.map(tag => tag.toLowerCase()).includes(genre);
    return projectTypeMatch && projectGenreMatch;
  };

  // Update type options
  typeOptions.forEach(option => {
    const optionValue = (option.dataset.filterValue || option.textContent.trim()).toLowerCase();
    if (optionValue === "alle typen") {
      option.disabled = false; // "Alle Typen" should never be disabled
      if (option.classList.contains('select-item')) option.classList.remove('disabled');
      return;
    }
    const wouldHaveResults = allProjects.some(project => hasMatchingProject(project, optionValue, activeGenre));
    option.disabled = !wouldHaveResults;
    if (option.classList.contains('select-item')) {
        if (wouldHaveResults) {
            option.classList.remove('disabled');
        } else {
            option.classList.add('disabled');
        }
    }
  });

  // Update genre options
  genreOptions.forEach(option => {
    const optionValue = (option.dataset.filterValue || option.textContent.trim()).toLowerCase();
    if (optionValue === "alle genres") {
      option.disabled = false; // "Alle Genres" should never be disabled
      if (option.classList.contains('select-item')) option.classList.remove('disabled');
      return;
    }
    const wouldHaveResults = allProjects.some(project => hasMatchingProject(project, activeType, optionValue));
    option.disabled = !wouldHaveResults;
     if (option.classList.contains('select-item')) {
        if (wouldHaveResults) {
            option.classList.remove('disabled');
        } else {
            option.classList.add('disabled');
        }
    }
  });
};


/**
 * Load projects from JSON and populate the portfolio section.
 */
const loadProjects = async () => {
  try {
    const res = await fetch('assets/js/projekte.json');
    projects = await res.json(); // Store projects globally

    // Populate filter buttons and select options
    const projectTypes = ["Alle Typen", ...new Set(projects.map(project => project.type))];
    const projectGenres = ["Alle Genres", ...new Set(projects.flatMap(project => project.tags))];

    const typeFilterButtonsContainer = document.querySelector('.filter-list[data-filter="type"]');
    const genreFilterButtonsContainer = document.querySelector('.filter-list[data-filter="genre"]');
    const typeSelectItemsContainer = document.querySelector('.select-list[data-select="type"]');
    const genreSelectItemsContainer = document.querySelector('.select-list[data-select="genre"]');

    // Clear existing filter buttons and select options
    if (typeFilterButtonsContainer) typeFilterButtonsContainer.innerHTML = '';
    if (genreFilterButtonsContainer) genreFilterButtonsContainer.innerHTML = '';
    if (typeSelectItemsContainer) typeSelectItemsContainer.innerHTML = '';
    if (genreSelectItemsContainer) genreSelectItemsContainer.innerHTML = '';


    projectTypes.forEach(type => {
      if (typeFilterButtonsContainer) {
        const button = document.createElement('button');
        button.className = `filter-btn ${type === "Alle Typen" ? "active" : ""}`;
        button.textContent = type;
        button.dataset.filterValue = type; // Store the original case for display
        button.dataset.selectValue = "type"; // To identify which select to update
        button.addEventListener("click", filterFunc);
        typeFilterButtonsContainer.appendChild(button);
      }
      if (typeSelectItemsContainer) {
        const li = document.createElement('li');
        li.className = 'select-item';
        li.textContent = type;
        li.dataset.filterValue = type; // Store the original case for display
        li.addEventListener('click', function() {
          filterSelects.type.value = this.dataset.filterValue;
          filterSelects.type.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change for filterFunc
          // Manually trigger filterFunc for select items as they don't have the button's context
          filterFunc.call(this, { target: this });
        });
        typeSelectItemsContainer.appendChild(li);
      }
    });

    projectGenres.forEach(genre => {
      if (genreFilterButtonsContainer) {
        const button = document.createElement('button');
        button.className = `filter-btn ${genre === "Alle Genres" ? "active" : ""}`;
        button.textContent = genre;
        button.dataset.filterValue = genre; // Store the original case for display
        button.dataset.selectValue = "genre"; // To identify which select to update
        button.addEventListener("click", filterFunc);
        genreFilterButtonsContainer.appendChild(button);
      }
      if (genreSelectItemsContainer) {
        const li = document.createElement('li');
        li.className = 'select-item';
        li.textContent = genre;
        li.dataset.filterValue = genre; // Store the original case for display
        li.addEventListener('click', function() {
          filterSelects.genre.value = this.dataset.filterValue;
          filterSelects.genre.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change for filterFunc
           // Manually trigger filterFunc for select items
          filterFunc.call(this, { target: this });
        });
        genreSelectItemsContainer.appendChild(li);
      }
    });

    // Re-assign filterBtns and selectItems after dynamic creation
    filterBtns = document.querySelectorAll("[data-filter-btn]"); // This might need adjustment if buttons are not data-filter-btn
    // A more robust way to get all filter buttons:
    filterBtns = document.querySelectorAll(".filter-btn");


    selectItems = document.querySelectorAll("[data-select-item]"); // This might need adjustment

    // Initial population of projects
    addProjectItems(projects);
    updateFilterStates(projects, "alle typen", "alle genres"); // Initial filter state update

  } catch (error) {
    console.error("Fehler beim Laden der Projekte:", error);
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

// Event listeners for filter buttons and select dropdowns
filterBtns.forEach(btn => {
  btn.addEventListener("click", filterFunc);
});

Object.values(filterSelects).forEach(select => {
  // Listen for 'change' event, which is triggered when select value is programmatically changed
  select.addEventListener("change", function(event) {
    // We need to call filterFunc with a context that mimics a button click or select item click
    // to ensure `this` is correctly set and we can determine which filter was changed.
    // We'll create a mock event object.
    const mockEvent = { target: { dataset: {} } };
    if (this.dataset.select === 'type') {
      mockEvent.target.dataset.select = 'type';
      mockEvent.target.dataset.filterValue = this.value;
    } else if (this.dataset.select === 'genre') {
      mockEvent.target.dataset.select = 'genre';
      mockEvent.target.dataset.filterValue = this.value;
    }
    filterFunc.call(this, mockEvent); // 'this' will be the select element
  });
});