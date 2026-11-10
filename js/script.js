"use strict";

// /////////////////////////////////
// Mobile Navigation

const btnMobileEl = document.querySelector(".btn-mobile-nav");
const mainNavEl = document.getElementById(
    btnMobileEl.getAttribute("aria-controls"),
);
const headerEl = document.querySelector(".header");
const mobileNavLayout = window.matchMedia("(width <= 785px)");

function setMobileNavExpanded(expanded) {
    btnMobileEl.setAttribute("aria-expanded", String(expanded));
    mainNavEl.inert = mobileNavLayout.matches && !expanded;
}

function resetMobileNav() {
    if (mobileNavLayout.matches && mainNavEl.contains(document.activeElement)) {
        btnMobileEl.focus();
    }

    setMobileNavExpanded(false);
}

resetMobileNav();
mobileNavLayout.addEventListener("change", resetMobileNav);

btnMobileEl.addEventListener("click", function () {
    const expanded = btnMobileEl.getAttribute("aria-expanded") === "true";
    setMobileNavExpanded(!expanded);
});

headerEl.addEventListener("keydown", function (event) {
    const expanded = btnMobileEl.getAttribute("aria-expanded") === "true";
    if (event.key !== "Escape" || !expanded) return;

    event.preventDefault();
    btnMobileEl.focus();
    setMobileNavExpanded(false);
});

// /////////////////////////////////
// Tabs functionality

async function loadData(dataUrl) {
    const response = await fetch(dataUrl);

    if (!response.ok)
        throw new Error(`Error al cargar datos: ${response.status}`);

    return response.json();
}

function initTabs(tabsEl, items, renderPanel, renderImage, labelTab) {
    if (!items.length) return;

    const firstTab = tabsEl.firstElementChild;
    const firstPanel = document.getElementById(
        firstTab.getAttribute("aria-controls"),
    );
    const tabEls = [firstTab];
    const panelEls = [firstPanel];

    items.slice(1).forEach(function (item, index) {
        const tabNumber = index + 2;
        const tab = firstTab.cloneNode(true);
        const panel = firstPanel.cloneNode(true);

        tab.id = `${tabsEl.id}-${tabNumber}`;
        panel.id = `${tab.id}-panel`;
        tab.setAttribute("aria-controls", panel.id);
        tab.setAttribute("aria-selected", "false");
        tab.tabIndex = -1;
        labelTab(tab, item, tabNumber);

        panel.setAttribute("aria-labelledby", tab.id);
        panel.hidden = true;
        renderPanel(panel, item);

        tabEls.push(tab);
        panelEls.push(panel);
    });

    renderPanel(firstPanel, items[0]);
    firstPanel.after(...panelEls.slice(1));
    tabsEl.append(...tabEls.slice(1));

    function selectTab(index) {
        renderImage(items[index]);

        tabEls.forEach(function (tabEl, tabIndex) {
            const selected = tabIndex === index;
            tabEl.setAttribute("aria-selected", String(selected));
            tabEl.tabIndex = selected ? 0 : -1;
            panelEls[tabIndex].hidden = !selected;
        });
    }

    selectTab(0);

    tabsEl.addEventListener("click", function (event) {
        const tabIndex = tabEls.indexOf(event.target.closest('[role="tab"]'));

        if (tabIndex === -1) return;

        selectTab(tabIndex);
    });

    tabsEl.addEventListener("keydown", function (event) {
        const tabIndex = tabEls.indexOf(event.target);
        if (tabIndex === -1) return;

        const vertical = tabsEl.getAttribute("aria-orientation") === "vertical";
        const previousKey = vertical ? "ArrowUp" : "ArrowLeft";
        const nextKey = vertical ? "ArrowDown" : "ArrowRight";
        let nextIndex;

        switch (event.key) {
            case previousKey:
                nextIndex = (tabIndex - 1 + tabEls.length) % tabEls.length;
                break;
            case nextKey:
                nextIndex = (tabIndex + 1) % tabEls.length;
                break;
            case "Home":
                nextIndex = 0;
                break;
            case "End":
                nextIndex = tabEls.length - 1;
                break;
            default:
                return;
        }

        event.preventDefault();
        selectTab(nextIndex);
        tabEls[nextIndex].focus();
    });
}

async function initDestinationTabs() {
    const tabsEl = document.querySelector(".tabs--underline");

    if (!tabsEl) return;

    const dataUrl = new URL("../data.json", window.location.href);

    const imageEl = document.querySelector(".destination-img");
    const sourceEl = document.getElementById("destination-image-webp");

    function renderDestination(panel, destination) {
        panel.querySelector("h2").textContent = destination.name;
        panel.querySelector(".paragraph").textContent = destination.description;
        panel.querySelector(".destination-distance").textContent =
            destination.distance;
        panel.querySelector(".destination-travel").textContent =
            destination.travel;
    }

    function renderImage(destination) {
        sourceEl.srcset = new URL(destination.images.webp, dataUrl).href;
        imageEl.src = new URL(destination.images.png, dataUrl).href;
        imageEl.alt = destination.name;
    }

    try {
        const data = await loadData(dataUrl);
        initTabs(
            tabsEl,
            data.destinations,
            renderDestination,
            renderImage,
            function (tab, destination) {
                tab.textContent = destination.name;
            },
        );
    } catch (error) {
        console.error(error);
    }
}

initDestinationTabs();

async function initCrewTabs() {
    const tabsEl = document.querySelector(".tabs--dots");

    if (!tabsEl) return;

    const dataUrl = new URL("../data.json", window.location.href);
    const imageEl = document.querySelector(".crew-member-photo");
    const sourceEl = document.getElementById("crew-image-webp");

    function renderCrewMember(panel, member) {
        panel.querySelector(".crew-member-role").textContent = member.role;
        panel.querySelector(".crew-member-full-name").textContent = member.name;
        panel.querySelector(".paragraph").textContent = member.bio;
    }

    function renderImage(member) {
        sourceEl.srcset = new URL(member.images.webp, dataUrl).href;
        imageEl.src = new URL(member.images.png, dataUrl).href;
        imageEl.alt = member.name;
    }

    try {
        const data = await loadData(dataUrl);
        initTabs(
            tabsEl,
            data.crew,
            renderCrewMember,
            renderImage,
            function (tab, member) {
                tab.setAttribute("aria-label", member.name);
            },
        );
    } catch (error) {
        console.error(error);
    }
}

initCrewTabs();

async function initTechnologyTabs() {
    const tabsEl = document.querySelector(".tabs--circles");

    if (!tabsEl) return;

    const dataUrl = new URL("../data.json", window.location.href);
    const imageEl = document.getElementById("technology-image");
    const sourceEl = document.getElementById("technology-image-landscape");
    const horizontalLayout = window.matchMedia("(width <= 1300px)");

    function updateOrientation() {
        tabsEl.setAttribute(
            "aria-orientation",
            horizontalLayout.matches ? "horizontal" : "vertical",
        );
    }

    updateOrientation();
    horizontalLayout.addEventListener("change", updateOrientation);

    function renderTechnology(panel, technology) {
        panel.querySelector(".technology-term").textContent = technology.name;
        panel.querySelector(".paragraph").textContent = technology.description;
    }

    function renderImage(technology) {
        sourceEl.srcset = new URL(technology.images.landscape, dataUrl).href;
        imageEl.src = new URL(technology.images.portrait, dataUrl).href;
        imageEl.alt = technology.name;
    }

    try {
        const data = await loadData(dataUrl);
        initTabs(
            tabsEl,
            data.technology,
            renderTechnology,
            renderImage,
            function (tab, technology, tabNumber) {
                tab.textContent = tabNumber;
                tab.setAttribute("aria-label", `${tabNumber}. ${technology.name}`);
            },
        );
    } catch (error) {
        console.error(error);
    }
}

initTechnologyTabs();
