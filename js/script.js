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
    const tabEls = Array.from(tabsEl.children);

    function renderDestination(destination) {
        nameEl.textContent = destination.name;
        descriptionEl.textContent = destination.description;
        distanceEl.textContent = destination.distance;
        travelEl.textContent = destination.travel;
        imageEl.src = new URL(destination.images.webp, dataUrl).href;
        imageEl.alt = destination.name;
    }

    try {
        const response = await fetch(dataUrl);

        if (!response.ok)
            throw new Error(`Error al cargar datos: ${response.status}`);

        const data = await response.json();

        function selectDestination(index) {
            const destination = data.destinations[index];

            if (!destination) return;

            renderDestination(destination);

            tabEls.forEach(function (tabEl) {
                tabEl.classList.toggle(
                    "selected",
                    Number(tabEl.dataset.index) === index,
                );
            });
        }

        selectDestination(0);

        tabsEl.addEventListener("click", function (event) {
            const tabEl = tabEls.find(function (tabEl) {
                return tabEl.contains(event.target);
            });

            if (!tabEl) return;

            const tabIndex = Number(tabEl.dataset.index);

            selectDestination(tabIndex);
        });
    } catch (error) {
        console.error(error);
    }
}

initDestinationTabs();
