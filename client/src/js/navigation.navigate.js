/* General Navigation Functions
-------------------------------------------------- */

var systemEvents        = require('./system.events.js'),
    navigationHelpers   = require('./navigation.helpers.js'),
    KeyEvent            = require('./navigation.keyEvent.js'),
    navigationBrowse    = require('./navigation.browser.js').browserNavigationEvents,
    _                   = require('lodash'),
    formInputs          = ['text', 'input', 'submit', 'password'],
    memSelection,
    timeSync;


/*  Show Selection in Small Game Profile
-------------------------------------------------- */
function showSelection() {
    navigationBrowse(memSelection);
}

var initialize = _.throttle(showSelection, 3000);

/* Exported Navigation Module (blackbox)
-------------------------------------------------- */
module.exports = function(k) {

    var s = document.getElementsByClassName("selectedNav")[0];
    var i = document.getElementsByClassName("selectedNav")[0].getAttribute("data-nav");

    s.classList.remove('selectedActive');

    var _parent = _.first(document.querySelectorAll(".parent"));

    var q = _parent.querySelectorAll(".navable");
    var us = document.querySelectorAll(".unselected");

    var screen = document.getElementById("screen-active").classList[0];

    function showCurrentSelection() {

        if (screen == 'Browser') {

            var currentSelection = document.querySelectorAll(".selectedNav");
            memSelection = currentSelection[0];

            initialize();

            currentSelection[0].scrollIntoView(false);

        }
    }

    // Left & Right
    if (k == 'right' || k == 'left') {

        var d;

        if (us[0]) {
            us[0].classList.toggle("unselected");
        }

        navigationHelpers();

        q = q.length - 1;

        // right
        if (k == 'right') {

            if (!i) {
                i = s.parentNode.parentNode.getAttribute("data-nav");
            }
            if (i < q) {
                i++;
            }


            if (s.parentNode.classList.contains("scroll-into-view")) {


                if (s.nextElementSibling) {
                    d = s.nextElementSibling.nextElementSibling;
                }

                if (d) {
                    d.scrollIntoView(false);
                }

                else {
                    s.scrollIntoView(false);
                }

            }
        }

        // left
        if (k == 'left') {

            if (!i) {
                i = s.parentNode.parentNode.getAttribute("data-nav");
                i = i-1;
            }
            if (i - 1 != -1) {
                i--;
            }

            if (s.parentNode.classList.contains("scroll-into-view")) {

                if (s.previousElementSibling) {
                    d = s.previousElementSibling.previousElementSibling;

                    if (d) {
                        d.scrollIntoView(false);
                    }

                    else {
                        s.scrollIntoView(false);
                    }


                }
            }
        }



        s.classList.remove("selectedNav");


        var lastNodeNav = _parent.querySelectorAll(".navable")[i];


        // Outside Panel
        if (lastNodeNav) {
            _parent.querySelectorAll(".navable")[i].classList.add("selectedNav");
        }

        // Inside Panel
        else {
            if (screen != 'Browser') {
                s.parentNode.parentNode.classList.add("selectedNav");
            } else {
                document.querySelectorAll(".parent .navable")[0].classList.add("selectedNav");
            }
        }

        // This will focus. Should make it happen on action button press
        // document.querySelectorAll(".selectedNav")[0].focus();


    }

    // Up & Down
    if (k == 'up' || k == 'down') {

        var sel = document.querySelectorAll(".selectedNav");
        var sub = sel[0].querySelectorAll(".subNavable");

        // Down
        if (k == 'down') {

            if(_.contains(formInputs, sel[0].type)) {
                KeyEvent(39);
            }

            // Textarea/ScollingDiv Scrolling
            if (sel[0].nodeName == "TEXTAREA") {
                sel[0].scrollTop = sel[0].scrollTop + 20;
            }

            if (sel[0].classList.contains("scrollable-view")) {
                sel[0].scrollTop = sel[0].scrollTop + 20;
            }

            // Inside onScreen Keyboard
            if (sel[0].classList.contains("rowParent")) {

                var allRows = document.querySelectorAll("[data-row]").length;
                var curRow = sel[0].parentNode.getAttribute("data-row");

                var elIndex = Array.prototype.indexOf.call(sel[0].parentNode.childNodes, sel[0]);

                curRow++;

                if (curRow != allRows) {

                    sel[0].classList.remove("selectedNav");

                    var nextRow = document.querySelectorAll("[data-row]")[curRow];

                    if (nextRow.childNodes[elIndex]) {

                        nextRow.childNodes[elIndex].classList.add("selectedNav");
                    }

                    else {

                    }

                }

            }

            // Inside Sub Navigation
            if (sel[0].classList.contains("subNavable")) {

                i = sel[0].getAttribute("data-snav");

                i--;

                var cont = sel[0].nextSibling;

                if (cont) {
                    i++;
                }


                if (sel[0].parentNode.classList.contains("scroll-into-view")) {
                    // var d = document.querySelectorAll(".selectedNav");

                    var d;

                    if (sel[0].nextElementSibling) {
                        d = sel[0].nextElementSibling.nextElementSibling;
                    }

                    if (d) {
                        d.scrollIntoView(false);
                    }

                    else {
                        sel[0].scrollIntoView(false);
                    }

                }


                sel[0].classList.remove("selectedNav");
                sel[0].parentNode.parentNode.querySelectorAll(".subNavable")[i].classList.add("selectedNav");

                showCurrentSelection();

            } else {

                if (screen == 'Browser') {

                    if (!sub[0]) {
                        // If on System Selection, but not on game selection, down goes to game selection.
                        sel[0].classList.remove("selectedNav");

                        document.getElementById("alpha_list").classList.add("selectedNav");

                    }
                }
            }

        }

        // Up
        if (k == 'up') {

            // is an Input
            if(_.contains(formInputs, sel[0].type)) {
                KeyEvent(37);
            }

            // Scrollable Textarea/Div
            if (sel[0].nodeName == "TEXTAREA") {
                sel[0].scrollTop = sel[0].scrollTop - 20;
            }

            if (sel[0].classList.contains("scrollable-view")) {
                sel[0].scrollTop = sel[0].scrollTop - 20;
            }

            // Inside onScreen Keyboard
            if (sel[0].classList.contains("rowParent")) {

                var allRows = document.querySelectorAll("[data-row]").length;
                var curRow = sel[0].parentNode.getAttribute("data-row");

                var elIndex = Array.prototype.indexOf.call(sel[0].parentNode.childNodes, sel[0]);

                if (curRow !== 0) {

                    curRow--;

                    sel[0].classList.remove("selectedNav");

                    var nextRow = document.querySelectorAll("[data-row]")[curRow];

                    nextRow.childNodes[elIndex].classList.add("selectedNav");;

                }

            }

            // Inside Sub Navigation
            if (sel[0].classList.contains("subNavable")) {

                i = sel[0].getAttribute("data-snav");

                i--;

                if (sel[0].parentNode.classList.contains("scroll-into-view")) {
                    // var d = document.querySelectorAll(".selectedNav");

                    var d;

                    if (sel[0].nextElementSibling) {
                        d = sel[0].nextElementSibling.nextElementSibling;
                    }

                    if (d) {
                        d.scrollIntoView(false);
                    }

                    else {
                        sel[0].scrollIntoView(false);
                    }

                }

                var cont = sel[0].previousSibling;


                if (cont) {
                    i--;
                } else {
                    if (screen == 'browser') {
                        sel[0].classList.remove("selectedNav");
                        document.getElementsByClassName("navable")[1].classList.add("selectedNav");
                        return;
                    }
                }

                sel[0].classList.remove("selectedNav");
                sel[0].parentNode.parentNode.querySelectorAll(".subNavable")[i].classList.add("selectedNav");

                showCurrentSelection();
            }

        }


        // Has Sub Navigation
        if (sub[0]) {
            col = sel[0].querySelectorAll(".subNavable");

            sel[0].classList.remove("selectedNav"); // Remove Parent Select
            sub[0].classList.add("selectedNav"); // Add sub nav Select Class

            navigationHelpers(sel[0].getAttribute('id'));

            showCurrentSelection();

        }
    }

    var run = document.getElementsByClassName("selectedNav")[0].getAttribute("data-function");
    var parameters = document.getElementsByClassName("selectedNav")[0].getAttribute("data-parameters");

    if (k == 'enter') {
        systemEvents.events[run](parameters);
    }

};
