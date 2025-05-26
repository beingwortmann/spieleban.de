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
    // Simulate click on the actual contact navigation link
    const contactNavLink = document.querySelector("[data-nav-link='kontakt']");
    if (contactNavLink) {
      contactNavLink.click();
      // If sidebar is open on mobile, close it
      if (sidebar && sidebar.classList.contains("active")) {
        elementToggleFunc(sidebar);
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
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
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
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }
    });
  }
  // Event listener for form submission (optional, for now just prevents default)
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    // Potentially add form submission logic here (e.g., using Formspree or similar)
    alert("Nachricht gesendet! (Dies ist eine Demo)");
    form.reset();
    formBtn.setAttribute("disabled", "");
  });
}

// Load and display events
async function loadEvents() {
  try {
    const response = await fetch('./assets/js/veranstaltungen.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const events = await response.json();

    const upcomingEventsContainer = document.querySelector(".timeline-list-upcoming");
    const pastEventsContainer = document.querySelector(".timeline-list-past");

    if (!upcomingEventsContainer || !pastEventsContainer) {
      console.error("Event containers not found!");
      return;
    }

    upcomingEventsContainer.innerHTML = ''; // Clear existing
    pastEventsContainer.innerHTML = '';   // Clear existing

    const now = new Date();

    events.forEach(event => {
      const eventDate = new Date(event.date);
      const listItem = document.createElement("li");
      listItem.classList.add("timeline-item");

      let mitDabeiHTML = '';
      if (event.mit_dabei && event.mit_dabei.length > 0) {
        mitDabeiHTML = `<p class="timeline-item-detailed-text">mit dabei: ${event.mit_dabei.join(', ')}</p>`;
      }

      listItem.innerHTML = `
        <h4 class="h4 timeline-item-title">${event.name}
          <span class="timeline-item-date">(${eventDate.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })})</span>
        </h4>
        <span>${event.location}</span>
        <p class="timeline-text">${event.description}</p>
        ${mitDabeiHTML}
      `;

      if (eventDate >= now) {
        upcomingEventsContainer.appendChild(listItem);
      } else {
        pastEventsContainer.appendChild(listItem);
      }
    });

    sortEventList(upcomingEventsContainer, true); // Ascending for upcoming (nearest first)
    sortEventList(pastEventsContainer, false);   // Descending for past (newest first)

  } catch (error) {
    console.error("Could not load events:", error);
  }
}

function sortEventList(listContainer, ascending = true) {
  const items = Array.from(listContainer.children);
  items.sort((a, b) => {
    const dateAStr = a.querySelector(".timeline-item-date").textContent.replace(/[()]/g, '');
    const dateBStr = b.querySelector(".timeline-item-date").textContent.replace(/[()]/g, '');
    
    const dateA = new Date(dateAStr.split('.').reverse().join('-'));
    const dateB = new Date(dateBStr.split('.').reverse().join('-'));

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
    console.error("Service list container not found for team members!");
    return;
  }

  serviceListContainer.innerHTML = ''; // Clear existing members
  teamMembers.forEach(member => {
    const serviceItem = document.createElement("li");
    serviceItem.classList.add("service-item");
    serviceItem.innerHTML = `
      <div class="service-icon-box">
        <img src="${member.image}" alt="${member.name}" width="60" style="border-radius: 50%;">
      </div>
      <div class="service-content-box">
        <h4 class="h4 service-item-title">${member.name}</h4>
        <p class="service-item-text">${member.role}</p>
      </div>
    `;
    serviceListContainer.appendChild(serviceItem);
  });
}

// Portfolio variables
let allProjects = [];
let filterItems; // Will be a NodeList of project <li> items

// custom select variables for portfolio filtering
let selectType, selectItemsTypeButtons, selectValueType;
let selectGenre, selectItemsGenreButtons, selectValueGenre;
let filterBtnType, filterBtnGenre; // These will be NodeLists of desktop buttons
let lastClickedBtnType, lastClickedBtnGenre; // For managing active state on desktop

// Store current filters
let currentFilterType = "Alle Typen";
let currentFilterGenre = "Alle Genres";


// Load and display projects and filters
async function loadProjects() {
  try {
    const response = await fetch('./assets/js/projekte.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    allProjects = await response.json();

    const projectsContainer = document.querySelector(".projects .project-list");
    if (!projectsContainer) {
      console.error("Project container (.projects .project-list) not found!");
      return;
    }
    projectsContainer.innerHTML = ''; 

    const filterTypeContainerDesktop = document.querySelector(".filter-list[data-filter-type-list]");
    const filterGenreContainerDesktop = document.querySelector(".filter-list[data-filter-genre-list]");
    const selectTypeListContainer = document.querySelector("[data-select-type] .select-list");
    const selectGenreListContainer = document.querySelector("[data-select-genre] .select-list");

    const types = new Set(["Alle Typen"]);
    const genres = new Set(["Alle Genres"]);

    allProjects.forEach(project => {
      project.types.forEach(type => types.add(type));
      project.genres.forEach(genre => genres.add(genre));

      const projectLi = document.createElement("li");
      projectLi.classList.add("project-item", "active"); 
      projectLi.dataset.projectTypes = project.types.join('%%');
      projectLi.dataset.projectGenres = project.genres.join('%%');
      
      // Add normalized class names for potential advanced filtering (not used by current logic but good practice)
      project.types.forEach(t => projectLi.classList.add(t.toLowerCase().replace(/\\s+/g, '-')));
      project.genres.forEach(g => projectLi.classList.add(g.toLowerCase().replace(/\\s+/g, '-')));


      projectLi.innerHTML = `
        <a href="#">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <span class="material-symbols-outlined">visibility</span>
            </div>
            <img src="${project.image}" alt="${project.name}" loading="lazy">
          </figure>
          <h3 class="project-title">${project.name}</h3>
          <p class="project-category">${project.types.join(', ')}</p>
          <p class="project-category">${project.genres.join(', ')}</p>
        </a>
      `;
      projectsContainer.appendChild(projectLi);
    });

    filterItems = projectsContainer.querySelectorAll(".project-item");

    if (filterTypeContainerDesktop) {
      filterTypeContainerDesktop.innerHTML = '';
      types.forEach(type => createFilterButton(type, 'type', filterTypeContainerDesktop, false, type === "Alle Typen"));
    }
    if (selectTypeListContainer) {
      selectTypeListContainer.innerHTML = '';
      types.forEach(type => createFilterButton(type, 'type', selectTypeListContainer, true, type === "Alle Typen"));
    }

    if (filterGenreContainerDesktop) {
      filterGenreContainerDesktop.innerHTML = '';
      genres.forEach(genre => createFilterButton(genre, 'genre', filterGenreContainerDesktop, false, genre === "Alle Genres"));
    }
    if (selectGenreListContainer) {
      selectGenreListContainer.innerHTML = '';
      genres.forEach(genre => createFilterButton(genre, 'genre', selectGenreListContainer, true, genre === "Alle Genres"));
    }
    
    initializePortfolioSelectorsAndListeners();

  } catch (error) {
    console.error("Could not load projects:", error);
  }
}

function createFilterButton(value, category, container, isSelect = false, isActive = false) {
  const listItem = document.createElement("li");
  if (isSelect) listItem.classList.add("select-item");

  const button = document.createElement("button");
  button.textContent = value;

  if (category === 'type') {
    if (!isSelect) button.dataset.filterBtnType = value;
    button.dataset.filterValue = value; // Common attribute for easier selection in listeners
    button.dataset.filterCat = 'type';
  }
  if (category === 'genre') {
    if (!isSelect) button.dataset.filterBtnGenre = value;
    button.dataset.filterValue = value; // Common attribute
    button.dataset.filterCat = 'genre';
  }

  if (isActive) {
    button.classList.add("active");
    if (!isSelect) { // Only for desktop buttons, manage lastClicked
        if (category === 'type') lastClickedBtnType = button;
        if (category === 'genre') lastClickedBtnGenre = button;
    }
  }

  listItem.appendChild(button);
  container.appendChild(listItem);
}

function initializePortfolioSelectorsAndListeners() {
    selectType = document.querySelector("[data-select-type]");
    selectValueType = document.querySelector("[data-select-value-type]");
    
    selectGenre = document.querySelector("[data-select-genre]");
    selectValueGenre = document.querySelector("[data-select-value-genre]");

    if (selectType) {
        const selectBoxType = selectType.querySelector("[data-select-box]");
        if (selectBoxType) selectBoxType.addEventListener("click", function () { elementToggleFunc(selectType); });
        
        selectItemsTypeButtons = selectType.querySelectorAll(".select-list li button");
        selectItemsTypeButtons.forEach(button => {
            button.addEventListener("click", function () {
                const selectedValue = this.dataset.filterValue;
                if(selectValueType) selectValueType.textContent = this.textContent;
                elementToggleFunc(selectType);
                filterFunc(selectedValue, 'type');
            });
        });
    }

    if (selectGenre) {
        const selectBoxGenre = selectGenre.querySelector("[data-select-box]");
        if (selectBoxGenre) selectBoxGenre.addEventListener("click", function () { elementToggleFunc(selectGenre); });

        selectItemsGenreButtons = selectGenre.querySelectorAll(".select-list li button");
        selectItemsGenreButtons.forEach(button => {
            button.addEventListener("click", function () {
                const selectedValue = this.dataset.filterValue;
                if(selectValueGenre) selectValueGenre.textContent = this.textContent;
                elementToggleFunc(selectGenre);
                filterFunc(selectedValue, 'genre');
            });
        });
    }
    addEventListenersToFilterButtons();
}

function addEventListenersToFilterButtons() {
    filterBtnType = document.querySelectorAll("[data-filter-btn-type]");
    filterBtnType.forEach(button => {
        button.addEventListener("click", function () {
            filterFunc(this.dataset.filterBtnType, 'type');
        });
    });

    filterBtnGenre = document.querySelectorAll("[data-filter-btn-genre]");
    filterBtnGenre.forEach(button => {
        button.addEventListener("click", function () {
            filterFunc(this.dataset.filterBtnGenre, 'genre');
        });
    });
}

const filterFunc = function (selectedValue, filterCategory) {
  if (filterCategory === 'type') {
    currentFilterType = selectedValue;
  } else if (filterCategory === 'genre') {
    currentFilterGenre = selectedValue;
  }

  // Update active classes for Type filters (desktop and select)
  document.querySelectorAll("[data-filter-cat='type']").forEach(btn => {
    if (btn.dataset.filterValue === currentFilterType) {
      btn.classList.add("active");
      if (btn.dataset.filterBtnType) lastClickedBtnType = btn; // Update for desktop
    } else {
      btn.classList.remove("active");
    }
  });
  if (selectValueType) selectValueType.textContent = currentFilterType;

  // Update active classes for Genre filters (desktop and select)
  document.querySelectorAll("[data-filter-cat='genre']").forEach(btn => {
    if (btn.dataset.filterValue === currentFilterGenre) {
      btn.classList.add("active");
      if (btn.dataset.filterBtnGenre) lastClickedBtnGenre = btn; // Update for desktop
    } else {
      btn.classList.remove("active");
    }
  });
  if (selectValueGenre) selectValueGenre.textContent = currentFilterGenre;
  
  // Filter project items
  if (!filterItems) filterItems = document.querySelectorAll(".project-item");

  filterItems.forEach(item => {
    const projectTypes = item.dataset.projectTypes ? item.dataset.projectTypes.split('%%') : [];
    const projectGenres = item.dataset.projectGenres ? item.dataset.projectGenres.split('%%') : [];

    const typeMatch = (currentFilterType === "Alle Typen" || projectTypes.includes(currentFilterType));
    const genreMatch = (currentFilterGenre === "Alle Genres" || projectGenres.includes(currentFilterGenre));

    if (typeMatch && genreMatch) {
      item.style.display = ""; 
      item.classList.add("active"); // Ensure it's styled as active/visible
      item.classList.remove("hide"); 
    } else {
      item.style.display = "none"; 
      item.classList.remove("active");
      item.classList.add("hide");
    }
  });

  updateFilterStates();
};

function updateFilterStates() {
    if (!allProjects) return; // Guard clause if projects haven't loaded

    const typeFilterElements = document.querySelectorAll("[data-filter-cat='type']");
    const genreFilterElements = document.querySelectorAll("[data-filter-cat='genre']");

    typeFilterElements.forEach(button => {
        const buttonValue = button.dataset.filterValue;
        let count = 0;
        allProjects.forEach(project => {
            const projectMatchesThisType = (buttonValue === "Alle Typen" || project.types.includes(buttonValue));
            const projectMatchesCurrentGenre = (currentFilterGenre === "Alle Genres" || project.genres.includes(currentFilterGenre));
            if (projectMatchesThisType && projectMatchesCurrentGenre) {
                count++;
            }
        });
        button.disabled = count === 0;
        if (count === 0) button.classList.add('disabled-filter'); else button.classList.remove('disabled-filter');
    });

    genreFilterElements.forEach(button => {
        const buttonValue = button.dataset.filterValue;
        let count = 0;
        allProjects.forEach(project => {
            const projectMatchesThisGenre = (buttonValue === "Alle Genres" || project.genres.includes(buttonValue));
            const projectMatchesCurrentType = (currentFilterType === "Alle Typen" || project.types.includes(currentFilterType));
            if (projectMatchesThisGenre && projectMatchesCurrentType) {
                count++;
            }
        });
        button.disabled = count === 0;
        if (count === 0) button.classList.add('disabled-filter'); else button.classList.remove('disabled-filter');
    });
}


// Initial load functions
window.addEventListener('load', async () => {
  loadTeamMembers();
  await loadEvents(); // Ensure events are loaded
  await loadProjects(); // Load projects, create filters

  // Initial display of projects (all should be visible by default from projectLi.classList.add("active"))
  // and currentFilterType/Genre are "Alle Typen"/"Alle Genres"
  
  // Set initial active state for "Alle Typen" and "Alle Genres" buttons/selects
  // This is handled by createFilterButton and filterFunc's active class management
  if (selectValueType) selectValueType.textContent = "Alle Typen";
  if (selectValueGenre) selectValueGenre.textContent = "Alle Genres";
  
  // Call filterFunc once to ensure correct initial display and active states
  // This will also call updateFilterStates for the first time.
  filterFunc(currentFilterType, 'type'); 
  // No, this might not be ideal if filterFunc changes currentFilterType.
  // Instead, directly call updateFilterStates after loadProjects has run and set up initial filters.
  // loadProjects already calls initializePortfolioSelectorsAndListeners which sets up buttons.
  // The default active buttons ("Alle Typen", "Alle Genres") are set by createFilterButton.
  // So, just call updateFilterStates.
  updateFilterStates();
});

// Ensure that the portfolio page is active by default if no other page is specified (e.g. by hash)
// Or, if you want "Über uns" to be default:
document.addEventListener('DOMContentLoaded', () => {
  const defaultPage = 'über uns'; // Change to 'portfolio' or any other default
  let pageActivated = false;
  pages.forEach(page => {
    if (page.classList.contains('active')) {
      pageActivated = true;
    }
  });

  if (!pageActivated) {
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].dataset.page === defaultPage) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active"); // Also activate corresponding nav link
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  }
});