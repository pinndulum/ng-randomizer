"use strict";

const select = (el, all = false) => {
    el = el.trim();
    if (all) {
        return [...document.querySelectorAll(el)];
    }
    return document.querySelector(el);
};

const on = (type, el, listener, all = false) => {
    let elms = select(el, all);
    if (!Array.isArray(elms)) {
        elms = [elms];
    }
    elms.forEach(e => e.addEventListener(type, listener));
};

const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
};

setTimeout(() => {
    if (select('.search-bar-toggle')) {
        on('click', '.search-bar-toggle', () => {
            select('.search-bar').classList.toggle('search-bar-show');
        });
    }

    const navlinks = select('#navbar .scrollto', true);
    const navlinksActive = () => {
        const position = window.scrollY + 200;
        navlinks.forEach(navlink => {
            if (!navlink.hash) {
                return;
            }
            const section = select(navlink.hash);
            if (!section) {
                return;
            }
            
            navlink.classList.remove('active');
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navlink.classList.add('active');
            }
        })
    };
    window.addEventListener('load', navlinksActive);
    onscroll(document, navlinksActive);

    const selectHeader = select('#header');
    if (selectHeader) {
        const headerScrolled = () => {
            selectHeader.classList.remove('header-scrolled');
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled');
            }
        };
        window.addEventListener('load', headerScrolled);
        onscroll(document, headerScrolled);
    }

    const backtotop = select('.back-to-top');
    if (backtotop) {
        const toggleBacktotop = () => {
            backtotop.classList.remove('active');
            if (window.scrollY > 100) {
                backtotop.classList.add('active');
            }
        };
        window.addEventListener('load', toggleBacktotop);
        onscroll(document, toggleBacktotop);
    }
}, 300);
