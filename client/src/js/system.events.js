/* Requested system events via client (usually button presses)
-------------------------------------------------- */

var KeyEvent                = require('./navigation.keyEvent'),
    api                 	= require('socket.io-client')('/api'),
    navigationBindings  	= require("./navigation.bindings"),
    _                   	= require('lodash'),
    navigationInit      	= require("./navigation.init.js"),
    dialog              	= require('./dialogs'),
    eventDispatcher     	= require('./events'),
    keyboardKeyEvents     	= require('./navigation.keyboardKeyEvents'),
    Screens             	= require('../interface/Screens.jsx');


var events = {

    /* Set Navigation State
    -------------------------------------------------- */
    navigationState: function(parameters) {
        sessionStorage.setItem("navigationState", parameters);
    },

    /* Remove Navigation State
    -------------------------------------------------- */
    removeNavigationState: function() {
        sessionStorage.removeItem("navigationState");
    },

    /*  Restrict Navigation on Play Session
    -------------------------------------------------- */
    pauseSessionNavigation: function() {

        navigationBindings("deinit");

        window.removeEventListener("keydown", function(e) {
            e.stopPropagation();
            return;
        });

        window.addEventListener("keydown", function(e) {

            if (e.keyCode === 76) { //L
                events.toggleUserSpaceSidebar();
            }

            e.stopPropagation();
            return;

        });

    },


    /*  Resume Navigation post Play Session
    -------------------------------------------------- */
    resumeSessionNavigation: function() {

    },

    /* Trigger New Screen Set
    -------------------------------------------------- */
    screenSet: function(parameters) {
        Screens.setupScreens(parameters);
    },

    /* Trigger Next Screen
    -------------------------------------------------- */
    nextScreen: function() {
        KeyEvent(221);
    },

    /* Trigger Previous Screen
    -------------------------------------------------- */
    previousScreen: function() {
        KeyEvent(219);
    },

    /* Render Certain Child of Screen
    -------------------------------------------------- */
    changeView: function(parameters) {
        eventDispatcher.changeView(parameters);
    },

    /* Focus form inputs on Action button/keypress
    -------------------------------------------------- */
    inputFocus: function() {
        var input = document.getElementsByClassName("selectedNav")[0];
        dialog.keyboard(input);
    },

    /* Close current Dialog
    -------------------------------------------------- */
    closeDialog: function() {
        dialog.close();
    },

    /* General Dialog
    -------------------------------------------------- */
    openDialog: function(_type) {
        dialog.general(null, _type);
    },

    /* Press Key on OnScreen Keyboard
    -------------------------------------------------- */
    depressKey: function(parameters) {
        keyboardKeyEvents.keypress(parameters);
    },

    /* Prevent any action
    -------------------------------------------------- */
    preventDefault: function() {
        return 0;
    },

    /* Log User In
    -------------------------------------------------- */
    logIn: function(parameters) {

        if (parameters) {

            var src  = "config/profiles/" + parameters + ".json";
            var dest = "config/profiles/Session.json";

            var copyObject = {};

            copyObject.src = src;
            copyObject.dest = dest;

            api.emit('request', { request: 'createSession', param: copyObject});

        }

    },

    /*  Log Out
    -------------------------------------------------- */
    logOut: function() {
        window.location = 'http://127.0.0.1:1210/profiles';
    },

    /* Save Wifi Config
    -------------------------------------------------- */
	saveWifiConfig: function(parameters) {

        var form = document.forms[parameters].elements;

        var obj = {};

        _.each(form, function(input) {
            if (input.name && input.value) {
               obj[input.name] = input.value;
            }
        });

        obj.formTitle = parameters;

        api.emit('request', { request: 'writeTextSync', param: obj });

    },

    /* Submit form on Action button/keypress
    -------------------------------------------------- */
    submitForm: function(parameters) {

        var form = document.forms[parameters].elements;

        var obj = {};

        _.each(form, function(input) {
            if (input.name && input.value) {
               obj[input.name] = input.value;
            }
        });

        obj.formTitle = parameters;

        switch(obj.server) {

            case "true": {
                api.emit('request', { request: 'submitForm', param: obj });
                break;
            }

            case "false": {
                api.emit('request', { request: 'writeJSONSync', param: obj });
                break;
            }

            case "cache": {
                 api.emit('request', { request: "cacheForm", param: obj });
                break;
            }

            default: {
                console.log("error submitting form");
            }

        }
    },

    /* Submit form on Action button/keypress
    -------------------------------------------------- */
    writeAdvancedConfig: function(parameters) {

        var form = document.forms[parameters].elements,
            formObj = {};

        _.each(form, function(input) {
            if (input.name && input.value) {
                formObj[input.name] = input.value;
            }
        });

        var selects = document.querySelectorAll("span[data-identifier='selectBoxConfig']"),
            selectList = [];

        _.each(selects, function(select) {
            selectList.push(select.classList.contains("label-selected"));
        });

        formObj.selectList = selectList;

        api.emit('request', { request: 'writeAdvancedConfig', param: formObj});

        dialog.close();

    },

    /*  Restore Default Config file
    -------------------------------------------------- */
    restoreAdvancedConfig: function(parameters) {

        var path = "/config/platforms/commandline/user/"+parameters+".json";
        api.emit('request', { request: 'removeFile', param: path});

        dialog.close();
    },

    /* Load Dashboard
    -------------------------------------------------- */
    preloadDashboard: function() {

        // Load new QTBrowser window and use on complete to close this instance?
        // if (document.readyState === "complete") { init(); }

        window.location = "http://127.0.0.1:1210/home/";


    },

    /* Get Community Info
    -------------------------------------------------- */
    moreCommunity: function() {
        dialog.show("Community");
    },

    /* Web Browser
    -------------------------------------------------- */
    launchBrowser: function(parameters) {
        dialog.show("WebBrowser", parameters);
    },

    /* Web Browser
    -------------------------------------------------- */
    browserFocus: function(parameters) {

        var arg = {
            message: "Enabling Control of the Browser will enable your mouse. This requires a mouse to navigate and exit control of the browser. Do not proceed without a mouse. Are you sure you want to continue?",
            agree: "browserFocusAgree",
            disagree: "closeDialog",
            parameters: parameters
        };

        dialog.show("Prompt", null, arg);

    },

    /* Focus Agreement
    -------------------------------------------------- */
    browserFocusAgree: function() {
        events.mouseControlEnable();
        dialog.close();
        setTimeout(function() {
            document.getElementsByTagName("iframe")[0].focus();
        }, 500);
    },

    /*     Terminal
    -------------------------------------------------- */
    showTerminal: function() {
        dialog.show("Terminal");
    },

    /*     Go to URL (web browser)
    -------------------------------------------------- */
    gotoUrl: function() {

        var url = document.getElementById("url-bar").value;
        document.getElementsByTagName("iframe")[0].src = url;

    },

    /*     Disable Mouse, Close Agreement
    -------------------------------------------------- */
    closeDialogDisableMouse: function() {

        document.body.classList.remove("mouse");
        dialog.close();

    },

    /*     Enable Mouse
    -------------------------------------------------- */
    mouseControlEnable: function() {
        document.body.classList.add("mouse");
    },

    /*     Disable Mouse
    -------------------------------------------------- */
    mouseControlDisable: function() {
        document.body.classList.remove("mouse");
        dialog.close();
    },

    /* Switch Emulator on Action button/keypress
    -------------------------------------------------- */
    switchEmulator: function(parameters) {

        // document.getElementById("alpha_list_tbody").innerHTML = "";

        var longname,
            list = document.querySelectorAll(".platform");

        _(list).forEach(function(item) {
            item.classList.remove("selected");
            if (item.getAttribute("data-parameters") == parameters) {
                item.classList.add("selected");
                longname = item.textContent;
            }
        }).value();

        var Obj = {
                platform: longname,
                start: 0
        };

        api.emit('request', { request: 'gamesList', param: Obj });

    },

    /*  Save Favorite
    -------------------------------------------------- */
    addFavorite: function(parameters) {

        var long = document.getElementById("toggle-favorite").getAttribute("data-selection"),
            pObj = JSON.parse(parameters);

        pObj.long = long;

        var Obj = {
            database: "favorites",
            values: pObj
        };

        api.emit('request', { request: 'storeData', param: Obj });

    },

    /*  Remove Favorite
    -------------------------------------------------- */
    removeFavorite: function(parameters) {

        var long = document.getElementById("toggle-favorite").getAttribute("data-selection"),
            pObj = JSON.parse(parameters);

        pObj.long = long;

        var Obj = {
            database: "favorites",
            values: pObj
        };

        api.emit('request', { request: 'removeFavorite', param: Obj });

    },

    /* Drop navigation on sub-panels on Action button/keypress
    -------------------------------------------------- */
    highlightPanel: function() {
        KeyEvent(40);
    },

    /*  Delete Message Prompt
    -------------------------------------------------- */
    deleteMessage: function(parameters) {

        var arg = {
            message: "Are you sure you want to delete this message?",
            agree: "deleteMessageConfirmed",
            disagree: "closeDialog",
            parameters: parameters
        };

        dialog.show("Prompt", null, arg);

    },

    /* Delete Message
    -------------------------------------------------- */
    deleteMessageConfirmed: function(parameters) {

        api.emit('request', { request: 'deleteMessage', param: parameters });
        api.emit('request', { request: 'messages', param: null });

        dialog.close();
        dialog.close();

    },

    /* View Messages event
    -------------------------------------------------- */
    viewMessages: function() {
        dialog.show("Messages");
    },

    /*  View Single Message
    -------------------------------------------------- */
    viewMessage: function(parameters) {
        dialog.show("Message", parameters);
        api.emit('request', { request: 'messages', param: null });
    },

    /* Send Message
    -------------------------------------------------- */
    passMessage: function(parameters) {
        dialog.show("PassMessage", parameters);
    },

    /* View Friends
    -------------------------------------------------- */
    viewFriends: function() {
        dialog.show("Friends");
    },

    /* View Friends
    -------------------------------------------------- */
    viewFriend: function(parameters) {
        dialog.show("FriendLarge", parameters);
    },

    /* Add a Friend(Request)
    -------------------------------------------------- */
    addFriend: function() {
        dialog.show("AddFriend");
    },

    /* Achievement Unlocked
    -------------------------------------------------- */
    achievementUnlocked: function(parameters) {

        dialog.uiNotification(parameters);

        setTimeout(function() {
            dialog.close(null, null, "uiNotification");
        }, 4500);

    },

    /* Toggle Right Sidebar in in-game UserSpace
    -------------------------------------------------- */
    toggleUserSpaceSidebar: function() {

        var userSpaceExists = document.querySelectorAll(".user-space-right");

        if (!userSpaceExists.length) {
            dialog.userSpaceRight();
            events.resumeSessionNavigation();
        }

        else {
            userSpaceExists[0].remove();
            events.pauseSessionNavigation();
        }

    },

    /* Launch selected game
    -------------------------------------------------- */
    launchGame: function(parameters) {

        // TODO:  via sockets and update server activity (so-and-so played game, 10 hours ago)

        if (parameters) {

            events.pauseSessionNavigation();

            var _doc = document.getElementById("main");

            document.body.style.background = "transparent";
            _doc.style.display = "none";

            dialog.userSpace();

            api.emit('request', { request: 'launchGame', param: JSON.parse(parameters) });
        }

    },

    /* See game Profile
    -------------------------------------------------- */
    largeProfile: function(parameters) {

        var platform = document.querySelectorAll(".platform.selected")[0].getAttribute("data-title"),
            shortname = document.querySelectorAll(".platform.selected")[0].getAttribute("data-parameters");

        var _launchContext = {
            platform: platform,
            filepath: parameters,
            shortname: shortname
        };

        eventDispatcher.launchContext(_launchContext);

        KeyEvent(221);

    },

    /*  Favorite Shortcut
    -------------------------------------------------- */
    favoriteCut: function(parameters) {
        // TODO: Create widget for favorites instead of passing them to profile

        var JSONified = JSON.parse(parameters);

        eventDispatcher.launchContext(JSONified);

        KeyEvent(221);
        KeyEvent(221);

    },

	/*  Resume Client
	-------------------------------------------------- */
    resumeClient: function() {

        var _doc = document.getElementById("main");
        document.body.style.background = "#000000";
        _doc.style.display = "block";

        dialog.closeAll(function() {


            api.emit('request', { request: 'killall', param: "retroarch" });

            var _ndoc = document.getElementById("Profile");
                _ndoc.classList.add("parent");

            events.removeNavigationState();

            navigationBindings("init");

            navigationInit.navigationInit();

        });

    },

	/*  Software Options
	-------------------------------------------------- */
    softwareOptions: function(parameters) {

        var options = JSON.parse(parameters);

        dialog.show("SoftwareOptions", options);

    },

	/*  Select Box UI for options
	-------------------------------------------------- */
    selectBox: function(parameters) {

        var doc     = document.getElementById(parameters);
        var input     = document.getElementById("input-"+parameters);

        if (!doc.classList.contains("required")) {
            doc.classList.toggle("label-selected");
            if (input) { input.classList.toggle("disabled"); }
        }

        eventDispatcher.selectBox(input, doc.classList.contains("label-selected"));

    },

	/*  Choice Box (radio) for Options
	-------------------------------------------------- */
    choiceBox: function(parameters) {

        var doc = document.getElementById(parameters),
            parent = doc.parentNode;

            _.each(parent.childNodes, function(el) {
                el.classList.remove("label-selected");
            });

            doc.classList.add("label-selected");

            api.emit('request', { request: 'getSpecificCommandLineConfig', param: doc.innerHTML });

    },

};


/* Exports
-------------------------------------------------- */
exports.events = events;
