'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}

// Datenstruktur für Projekte und Veranstaltungen
const projekte = [
  {
    title: "Käse³",
    image: "./assets/images/project-kaese3.png",
    tags: ["kartenspiel", "familienspiele"],
    main: ["familienspiele"],
    description: "Ein schnelles, witziges Kartenspiel rund um Käse und Würfelglück.",
  },
  {
    title: "Phantom",
    image: "./assets/images/project-phantom.png",
    tags: ["wuerfelspiel", "kenner-expertenspiele"],
    main: ["kenner-expertenspiele"],
    description: "Würfellaufspiel mit taktischen Elementen und Geisterjagd.",
  },
  {
    title: "Packgammon",
    image: "./assets/images/project-packgammon.png",
    tags: ["abstrakt", "kennerspiel"],
    main: ["kenner-expertenspiele"],
    description: "Backgammon neu gedacht – modern, schnell, spannend.",
  },
  {
    title: "DnD-Projekt (Arbeitstitel)",
    image: "./assets/images/project-dnd.png",
    tags: ["penpaper", "kenner-expertenspiele", "rollwrite", "rollenspiel"],
    main: ["kenner-expertenspiele"],
    description: "Großes, DnD-kompatibles Rollenspielprojekt für Selbstveröffentlichung.",
  },
];

const veranstaltungen = [
  {
    title: "Göttingen Spieleautor:innentreffen 2025",
    dateStart: "2025-05-31",
    dateEnd: "2025-06-01",
    ort: "Göttingen",
    projekte: ["Phantom", "Käse³"],
  },
  {
    title: "Berlin Brettspiel Con 2025",
    dateStart: "2025-08-01",
    dateEnd: "2025-08-03",
    ort: "Berlin",
    projekte: ["DnD-Projekt (Arbeitstitel)", "Phantom", "Käse³", "Packgammon"],
  },
  {
    title: "Brettspiel Con Berlin 2024",
    dateStart: "2024-07-19",
    dateEnd: "2024-07-21",
    ort: "Berlin",
    projekte: ["Phantom"],
  },
];

// Hilfsfunktion: Datumsvergleich
function isFuture(dateStr) {
  const today = new Date();
  const end = new Date(dateStr);
  return end >= today;
}

// Veranstaltungen dynamisch einsortieren
function renderEvents() {
  const upcoming = [];
  const past = [];
  veranstaltungen.forEach(ev => {
    if (isFuture(ev.dateEnd)) {
      upcoming.push(ev);
    } else {
      past.push(ev);
    }
  });
  // Sortierung: nächste zuerst
  upcoming.sort((a, b) => new Date(a.dateStart) - new Date(b.dateStart));
  past.sort((a, b) => new Date(b.dateStart) - new Date(a.dateStart));
  const upList = document.getElementById('upcoming-events-list');
  const pastList = document.getElementById('past-events-list');
  upList.innerHTML = '';
  pastList.innerHTML = '';
  for (const ev of upcoming) {
    upList.innerHTML += `<li class="timeline-item">
      <h4 class="h4 timeline-item-title">${ev.title}</h4>
      <span>${formatDate(ev.dateStart)} – ${formatDate(ev.dateEnd)}</span>
      <p class="timeline-text">Ort: ${ev.ort}<br>Mit dabei: ${ev.projekte.map(p => `<b>${p}</b>`).join(', ')}</p>
    </li>`;
  }
  for (const ev of past) {
    pastList.innerHTML += `<li class="timeline-item">
      <h4 class="h4 timeline-item-title">${ev.title}</h4>
      <span>${formatDate(ev.dateStart)} – ${formatDate(ev.dateEnd)}</span>
      <p class="timeline-text">Ort: ${ev.ort}<br>Mit dabei: ${ev.projekte.map(p => `<b>${p}</b>`).join(', ')}</p>
    </li>`;
  }
}
function formatDate(str) {
  const d = new Date(str);
  return d.toLocaleDateString('de-DE');
}

// Portfolio dynamisch rendern mit zwei Filtergruppen
function renderPortfolio() {
  const list = document.getElementById('project-list');
  list.innerHTML = '';
  projekte.forEach(proj => {
    const tags = proj.tags.map(t => `<span class='project-tag'>${tagLabel(t)}</span>`).join(' ');
    list.innerHTML += `
      <li class="project-item active" data-filter-item data-main="${proj.main.join(' ')}" data-tags="${proj.tags.join(' ')}">
        <a href="#">
          <figure class="project-img">
            <img src="${proj.image}" alt="${proj.title}" loading="lazy">
          </figure>
          <h3 class="project-title">${proj.title}</h3>
          <p class="project-category">${proj.description}</p>
          <div class="project-tags">${tags}</div>
        </a>
      </li>
    `;
  });
}
function tagLabel(tag) {
  const map = {
    kinderspiele: 'Kinderspiele', familienspiele: 'Familienspiele', 'kenner-expertenspiele': 'Kenner-/Expertenspiele',
    penpaper: 'Pen and Paper', abstrakt: 'Abstraktes Spiel', kartenspiel: 'Kartenspiel', wuerfelspiel: 'Würfelspiel',
    logik: 'Logik-/Rätselspiel', kommunikation: 'Kommunikations-/Partyspiel', rollwrite: 'Roll & Write',
    geschick: 'Geschicklichkeitsspiel', kennerspiel: 'Kennerspiel', socialdeduction: 'Social Deduction', rollenspiel: 'Rollenspiel'
  };
  return map[tag] || tag;
}

// Filterlogik für zwei Filtergruppen
let selectedMain = 'all';
let selectedTag = 'all';

document.getElementById('main-filter-list').addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON') {
    selectedMain = e.target.dataset.mainFilter;
    Array.from(this.querySelectorAll('button')).forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    filterProjects();
  }
});
document.getElementById('tag-filter-list').addEventListener('click', function(e) {
  if (e.target.tagName === 'BUTTON') {
    selectedTag = e.target.dataset.tagFilter;
    Array.from(this.querySelectorAll('button')).forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    filterProjects();
  }
});
function filterProjects() {
  const items = document.querySelectorAll('#project-list .project-item');
  items.forEach(item => {
    const mains = item.dataset.main.split(' ');
    const tags = item.dataset.tags.split(' ');
    let show = true;
    if (selectedMain !== 'all' && !mains.includes(selectedMain)) show = false;
    if (selectedTag !== 'all' && !tags.includes(selectedTag)) show = false;
    item.style.display = show ? '' : 'none';
  });
}

window.addEventListener('DOMContentLoaded', function() {
  renderEvents();
  renderPortfolio();
});