"use strict";

// /////////////////////////////////
// Mobile Navigation

const btnMobileEl = document.querySelector(".btn-mobile-nav");
const mainNavEl = document.querySelector(".main-nav");
const headerEl = document.querySelector(".header");

btnMobileEl.addEventListener("click", function () {
    headerEl.classList.toggle("main-nav-open");
});
