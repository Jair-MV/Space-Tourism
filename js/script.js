"use strict";

// /////////////////////////////////
// Mobile Navigation

const btnMobileEl = document.querySelector(".btn-mobile-nav");
const mainNavEl = document.querySelector(".main-nav");
const headerEl = document.querySelector(".header");

btnMobileEl.addEventListener("click", function () {
    headerEl.classList.toggle("main-nav-open");
});

// /////////////////////////////////
// Tabs functionality

async function loadData(dataUrl) {
    const response = await fetch(dataUrl);

    if (!response.ok)
        throw new Error(`Error al cargar datos: ${response.status}`);

    return response.json();
}

function initTabs(tabsEl, items, render) {
    const tabEls = Array.from(tabsEl.children);

    function selectTab(index) {
        const item = items[index];

        if (!item) return;

        render(item);

        tabEls.forEach(function (tabEl, tabIndex) {
            tabEl.classList.toggle("selected", tabIndex === index);
        });
    }

    selectTab(0);

    tabsEl.addEventListener("click", function (event) {
        const tabIndex = tabEls.findIndex(function (tabEl) {
            return tabEl.contains(event.target);
        });

        if (tabIndex === -1) return;

        selectTab(tabIndex);
    });
}

async function initDestinationTabs() {
    const tabsEl = document.querySelector(".tabs--underline");

    if (!tabsEl) return;

    const dataUrl = new URL("../data.json", window.location.href);

    const imageEl = document.querySelector(".destination-img");
    const nameEl = document.querySelector(".destination-info h2");
    const descriptionEl = document.querySelector(
        ".destination-info .paragraph",
    );
    const distanceEl = document.getElementById("destination-distance");
    const travelEl = document.getElementById("destination-travel");

    function renderDestination(destination) {
        nameEl.textContent = destination.name;
        descriptionEl.textContent = destination.description;
        distanceEl.textContent = destination.distance;
        travelEl.textContent = destination.travel;
        imageEl.src = new URL(destination.images.webp, dataUrl).href;
        imageEl.alt = destination.name;
    }

    try {
        const data = await loadData(dataUrl);
        initTabs(tabsEl, data.destinations, renderDestination);
    } catch (error) {
        console.error(error);
    }
}

initDestinationTabs();

async function initCrewTabs() {
    const tabsEl = document.querySelector(".tabs--dots");

    if (!tabsEl) return;

    const dataUrl = new URL("../data.json", window.location.href);
    const roleEl = document.getElementById("crew-member-role");
    const nameEl = document.getElementById("crew-member-name");
    const bioEl = document.querySelector(".crew-member-info .paragraph");
    const imageEl = document.querySelector(".crew-member-photo");

    function renderCrewMember(member) {
        roleEl.textContent = member.role;
        nameEl.textContent = member.name;
        bioEl.textContent = member.bio;
        imageEl.src = new URL(member.images.webp, dataUrl).href;
        imageEl.alt = member.name;
    }

    try {
        const data = await loadData(dataUrl);
        initTabs(tabsEl, data.crew, renderCrewMember);
    } catch (error) {
        console.error(error);
    }
}

initCrewTabs();

async function initTechnologyTabs() {
    const tabsEl = document.querySelector(".tabs--circles");

    if (!tabsEl) return;

    const dataUrl = new URL("../data.json", window.location.href);
    const nameEl = document.getElementById("technology-name");
    const descriptionEl = document.querySelector(
        ".technology-info-block .paragraph",
    );
    const imageEl = document.getElementById("technology-image");
    const sourceEl = document.getElementById("technology-image-landscape");

    function renderTechnology(technology) {
        nameEl.textContent = technology.name;
        descriptionEl.textContent = technology.description;
        sourceEl.srcset = new URL(technology.images.landscape, dataUrl).href;
        imageEl.src = new URL(technology.images.portrait, dataUrl).href;
        imageEl.alt = technology.name;
    }

    try {
        const data = await loadData(dataUrl);
        initTabs(tabsEl, data.technology, renderTechnology);
    } catch (error) {
        console.error(error);
    }
}

initTechnologyTabs();
