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
const successMessage = document.getElementById("success-message");

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

form.addEventListener("submit", function (e) {
  e.preventDefault(); 


  if (form.checkValidity()) {

    successMessage.style.display = "block";


    formInputs.forEach(input => {
      if (input.value) {
        input.value = ''; 
      }
    });


    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 20000); 
  }
});


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

      const projectTitleClass = project.markdownFile ? 'project-title has-markdown' : 'project-title';

      listItem.innerHTML = `
        <figure class="project-img" data-project-id="${project.id}">
          <div class="project-item-icon-box">
            <ion-icon name="eye-outline"></ion-icon>
          </div>
          <img src="${project.image}" alt="${project.name}" loading="lazy">
        </figure>
        <h3 class="${projectTitleClass}" data-project-id="${project.id}">${project.name}</h3>
        <p class="project-category">${project.types.join(' / ')}</p>
        <p class="project-category">${project.genres.join(' / ')}</p>
      `;
      projectListContainer.appendChild(listItem);

      if (project.markdownFile) {
        const projectImage = listItem.querySelector('.project-img');
        const projectTitle = listItem.querySelector('.project-title');

        projectImage.addEventListener('click', () => openProjectModal(project.markdownFile));
        projectTitle.addEventListener('click', () => openProjectModal(project.markdownFile));
        projectImage.style.cursor = 'pointer';
        projectTitle.style.cursor = 'pointer';
      }
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
            const selectedValue = this.textContent;
            if (selectValueType) selectValueType.textContent = selectedValue;
            filterByType(selectedValue);
            if (selectType) elementToggleFunc(selectType); // Close dropdown

            // Set active state for this select item group
            selectItemsType.forEach(si => si.classList.remove("active"));
            this.classList.add("active");

            // Sync desktop buttons
            filterBtnType.forEach(btn => {
                if (btn.textContent === selectedValue) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            });
        });
    });

    selectItemsGenre.forEach(item => {
        item.addEventListener("click", function () {
            const selectedValue = this.textContent;
            if (selectValueGenre) selectValueGenre.textContent = selectedValue;
            filterByGenre(selectedValue);
            if (selectGenre) elementToggleFunc(selectGenre); // Close dropdown

            // Set active state for this select item group
            selectItemsGenre.forEach(si => si.classList.remove("active"));
            this.classList.add("active");

            // Sync desktop buttons
            filterBtnGenre.forEach(btn => {
                if (btn.textContent === selectedValue) {
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
    // const allProjectItems = Array.from(document.querySelectorAll(".project-item")); // Get all project items, not just currently filtered ones

    // Update Type Filters
    filterBtnType.forEach(btn => {
        btn.classList.remove("disabled"); // Ensure all buttons are enabled
        // const typeValue = btn.textContent.toLowerCase();
        // if (typeValue === "alle typen") {
        //     btn.classList.remove("disabled"); // "Alle Typen" should never be disabled
        //     return;
        // }
        // const wouldHaveResults = allProjectItems.some(item => {
        //     const itemTypes = item.dataset.type.toLowerCase();
        //     const itemGenres = item.dataset.genre.toLowerCase();
        //     const typeMatch = itemTypes.includes(typeValue);
        //     const genreMatch = currentFilterGenre.toLowerCase() === "alle genres" || itemGenres.includes(currentFilterGenre.toLowerCase());
        //     return typeMatch && genreMatch;
        // });
        // if (wouldHaveResults) {
        //     btn.classList.remove("disabled");
        // } else {
        //     btn.classList.add("disabled");
        // }
    });
    selectItemsType.forEach(item => { // Also update select items
        item.classList.remove("disabled"); // Ensure all items are enabled
        // const typeValue = item.textContent.toLowerCase();
        // if (typeValue === "alle typen") {
        //     item.classList.remove("disabled");
        //     return;
        // }
        // const wouldHaveResults = allProjectItems.some(projectItem => {
        //     const itemTypes = projectItem.dataset.type.toLowerCase();
        //     const itemGenres = projectItem.dataset.genre.toLowerCase();
        //     const typeMatch = itemTypes.includes(typeValue);
        //     const genreMatch = currentFilterGenre.toLowerCase() === "alle genres" || itemGenres.includes(currentFilterGenre.toLowerCase());
        //     return typeMatch && genreMatch;
        // });
        // if (wouldHaveResults) {
        //     item.classList.remove("disabled");
        // } else {
        //     item.classList.add("disabled");
        // }
    });


    // Update Genre Filters
    filterBtnGenre.forEach(btn => {
        btn.classList.remove("disabled"); // Ensure all buttons are enabled
        // const genreValue = btn.textContent.toLowerCase();
        // if (genreValue === "alle genres") {
        //     btn.classList.remove("disabled"); // "Alle Genres" should never be disabled
        //     return;
        // }
        // const wouldHaveResults = allProjectItems.some(item => {
        //     const itemTypes = item.dataset.type.toLowerCase();
        //     const itemGenres = item.dataset.genre.toLowerCase();
        //     const typeMatch = currentFilterType.toLowerCase() === "alle typen" || itemTypes.includes(currentFilterType.toLowerCase());
        //     const genreMatch = itemGenres.includes(genreValue);
        //     return typeMatch && genreMatch;
        // });
        // if (wouldHaveResults) {
        //     btn.classList.remove("disabled");
        // } else {
        //     btn.classList.add("disabled");
        // }
    });
    selectItemsGenre.forEach(item => { // Also update select items
        item.classList.remove("disabled"); // Ensure all items are enabled
        // const genreValue = item.textContent.toLowerCase();
        // if (genreValue === "alle genres") {
        //     item.classList.remove("disabled");
        //     return;
        // }
        // const wouldHaveResults = allProjectItems.some(projectItem => {
        //     const itemTypes = projectItem.dataset.type.toLowerCase();
        //     const itemGenres = projectItem.dataset.genre.toLowerCase();
        //     const typeMatch = currentFilterType.toLowerCase() === "alle typen" || itemTypes.includes(currentFilterType.toLowerCase());
        //     const genreMatch = itemGenres.includes(genreValue);
        //     return typeMatch && genreMatch;
        // });
        // if (wouldHaveResults) {
        //     item.classList.remove("disabled");
        // } else {
        //     item.classList.add("disabled");
        // }
    });
}


// Project Modal Variables and Functions
const projectModalContainer = document.querySelector("[data-project-modal-container]");
const projectOverlay = document.querySelector("[data-project-overlay]");
const projectModalCloseBtn = document.querySelector("[data-project-modal-close-btn]");
const projectModalContent = document.querySelector("[data-project-modal-content]");

async function openProjectModal(markdownPath) {
  if (!markdownPath) return;

  try {
    const response = await fetch(markdownPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let markdownText = await response.text();

    // Ersetze relative Bildpfade im Markdown
    // Annahme: Bilder im Markdown sind relativ zum Ordner assets/
    // z.B. ![Alt Text](./images/mein-bild.png) wird zu ![Alt Text](./assets/images/mein-bild.png)
    // Da die Markdown-Dateien bereits in assets/markdown liegen und Pfade wie ./assets/images/... haben, 
    // müssen wir den Pfad so anpassen, dass er vom Stammverzeichnis der Website aus korrekt ist.
    // Derzeitiger Pfad: ./assets/markdown/mein.md -> Bildpfad im MD: ./assets/images/bild.png
    // Korrekter relativer Pfad von index.html aus: ./assets/images/bild.png
    // Die Pfade in den Markdown-Dateien scheinen bereits korrekt zu sein, wenn sie als `assets/images/...` angegeben sind.
    // Wenn sie als `./images/...` angegeben sind, müssen sie angepasst werden.
    // Diese Ersetzung geht davon aus, dass die Bilder im Markdown relativ zum `assets` Ordner sind.
    // Und die Markdown-Datei selbst ist in `assets/markdown`.
    // Ein Pfad wie `![Alt Text](./image.png)` in `assets/markdown/file.md` würde zu `assets/markdown/image.png`.
    // Wir wollen, dass es zu `assets/image.png` wird, wenn das Bild direkt in `assets` liegt,
    // oder `assets/images/image.png`, wenn es in `assets/images` liegt.
    // Die aktuelle Struktur der Markdown-Beispieldateien verwendet bereits `./assets/images/...`,
    // was von der `index.html` aus korrekt aufgelöst werden sollte, wenn das HTML direkt in den Modal-Inhalt eingefügt wird.
    // Daher ist eine Pfadanpassung hier möglicherweise nicht notwendig, wenn die Markdown-Pfade konsistent sind.
    // Wir gehen davon aus, dass Pfade im Markdown wie folgt sind: `![Alt Text](assets/images/bild.jpg)`
    // oder relativ zum Markdown-File, z.B. `../images/bild.jpg` wenn das Bild in `assets/images` liegt.

    // Einfache Markdown-zu-HTML-Konvertierung (Basis-Funktionalität)
    // Überschriften
    markdownText = markdownText.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    markdownText = markdownText.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdownText = markdownText.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    // Fett
    markdownText = markdownText.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    markdownText = markdownText.replace(/__(.*?)__/gim, '<strong>$1</strong>');
    // Kursiv
    markdownText = markdownText.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    markdownText = markdownText.replace(/_(.*?)_/gim, '<em>$1</em>');
    // Bilder: ![Alt Text](Pfad)
    // Die Pfade in Markdown sind relativ zum Markdown-File.
    // Wir müssen sie so anpassen, dass sie relativ zur index.html sind.
    // Annahme: Markdown liegt in assets/markdown/, Bilder in assets/images/
    // Ein Pfad wie `../images/foo.png` in `assets/markdown/projekt.md` wird zu `assets/images/foo.png`
    // Ein Pfad wie `./bild.png` in `assets/markdown/projekt.md` wird zu `assets/markdown/bild.png`
    // Ein Pfad wie `assets/images/bild.png` in `assets/markdown/projekt.md` ist bereits korrekt, wenn die Basis `index.html` ist.
    // Die bereitgestellten Markdown-Beispiele verwenden `./assets/images/...`.
    // Wenn die Markdown-Datei in `assets/markdown/` liegt, dann ist `./assets/` von dort aus `assets/markdown/assets/`.
    // Das ist falsch. Die Pfade in den Markdown-Dateien sollten `../images/bild.png` sein oder absolute Pfade vom Root `/assets/images/bild.png`.
    // Wir gehen davon aus, dass die Pfade in den Markdown-Dateien bereits korrekt sind für die Anzeige in index.html,
    // d.h. sie sind relativ zum Root oder beginnen mit `assets/`.
    // Die Markdown-Beispiele haben: ![Käse³](./assets/images/project-1.jpg)
    // Wenn die MD-Datei in `s:/Entwicklung/GitHub Pages/spieleban.de/assets/markdown/kaese3.md` ist,
    // dann zeigt `./assets/images/project-1.jpg` auf `s:/Entwicklung/GitHub Pages/spieleban.de/assets/markdown/assets/images/project-1.jpg`.
    // Das ist nicht korrekt. Die Pfade in den Markdown-Dateien müssen angepasst werden oder die Ersetzung hier muss das korrigieren.

    // Korrektur für Bildpfade: Annahme, dass Pfade im Markdown wie `![Alt Text](./image.png)` oder `![Alt Text](image.png)`
    // und sich auf Bilder beziehen, die relativ zum `assets/images/` Ordner sind, oder dass der Pfad bereits `assets/images/...` ist.
    // Sicherer Ansatz: Pfade, die mit `./assets/` beginnen, sind bereits korrekt relativ zur `index.html`.
    // Pfade, die nur mit `./` beginnen (z.B. `./image.png`) und sich in `assets/markdown/` befinden, müssen zu `assets/markdown/image.png` werden.
    // Pfade, die mit `../images/` beginnen, werden zu `assets/images/`.

    markdownText = markdownText.replace(/\!\[(.*?)\]\((.*?)\)/gim, (match, alt, src) => {
      let newSrc = src;
      if (src.startsWith('./assets/')) {
        // Bereits korrekter Pfad relativ zu index.html, wenn MD in assets/markdown liegt und Pfad so ist.
        // Beispiel: MD in assets/markdown/file.md, Bildpfad ./assets/images/img.png -> wird zu assets/images/img.png
        // Das ist nur korrekt, wenn die Webseite von einem Unterordner aus serviert wird, wo assets/ ein direkter Unterordner ist.
        // Für GitHub Pages (spieleban.de/repo-name/) ist das anders.
        // Sicherer ist, Pfade relativ zum Root zu machen oder die Basis-URL zu berücksichtigen.
        // Für dieses Projekt gehen wir davon aus, dass die Pfade in den Markdown-Dateien bereits korrekt sind
        // und beginnen mit `assets/` oder `./assets/` was als `assets/` vom Root interpretiert wird.
        // Die Markdown-Beispiele haben `./assets/images/...`. Das wird von `index.html` als `assets/images/...` interpretiert.
      } else if (src.startsWith('../')) {
        // Pfad wie ../images/foo.png in assets/markdown/file.md -> assets/images/foo.png
        newSrc = src.replace(/^\.\.\//, 'assets/');
      } else if (src.startsWith('./')) {
        // Pfad wie ./foo.png in assets/markdown/file.md -> assets/markdown/foo.png
        const basePath = markdownPath.substring(0, markdownPath.lastIndexOf('/'));
        newSrc = basePath + '/' + src.substring(2);
      }
      // Für dieses Projekt sind die Pfade in den Markdown-Dateien bereits `./assets/images/...`,
      // was von der `index.html` korrekt als `assets/images/...` interpretiert wird.
      // Daher ist keine komplexe Ersetzung notwendig, solange dieses Format beibehalten wird.
      return `<img src="${newSrc}" alt="${alt}" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; margin-bottom: 10px;">`;
    });

    // Absätze (nach anderen Blockelementen, um Konflikte zu vermeiden)
    markdownText = markdownText.split('\n\n').map(paragraph => {
      if (paragraph.startsWith('<') || paragraph.trim() === '') return paragraph; // Nicht anrühren, wenn es schon HTML ist oder leer
      return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
    }).join('');

    projectModalContent.innerHTML = markdownText;
    if (projectModalContainer) elementToggleFunc(projectModalContainer);
    if (projectOverlay) elementToggleFunc(projectOverlay);

  } catch (error) {
    console.error("Fehler beim Laden oder Parsen der Markdown-Datei:", error);
    projectModalContent.innerHTML = "<p>Fehler beim Laden des Projekt-Details. Bitte versuchen Sie es später erneut.</p>";
    if (projectModalContainer) elementToggleFunc(projectModalContainer);
    if (projectOverlay) elementToggleFunc(projectOverlay);
  }
}

if (projectModalCloseBtn) {
  projectModalCloseBtn.addEventListener("click", () => {
    if (projectModalContainer) elementToggleFunc(projectModalContainer);
    if (projectOverlay) elementToggleFunc(projectOverlay);
  });
}
if (projectOverlay) {
  projectOverlay.addEventListener("click", () => {
    if (projectModalContainer) elementToggleFunc(projectModalContainer);
    if (projectOverlay) elementToggleFunc(projectOverlay);
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