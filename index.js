'use strict';

require('itsa-jsext/lib/object');

var isNode = require('itsa-utils').isNode,
    alreadySet = false,
    WINDOW = isNode ? {} : window,
    localStorage = require('./lib/localstorage'),
    KEY_ID = 'itsaRefluxClientStorage',
    MIN_SESSION_BROWSERS_NO_HISTORY = 3600; // sec

var setupListener = function(store) {
    if (alreadySet) {
        return;
    }
    // make sure only one listeners kieeps running:
    alreadySet = true;
    store.subscribe(function() {
        localStorage.setItem(KEY_ID, {time: Date.now(), state: store.getState()});
    });
};

var isBrowserWithHistory = function() {
    // only activated to browsers with history-support
    return (WINDOW.history && WINDOW.history.pushState);
};

var ReduxClientStorageMixin = {
    envBrowser: function() {
        return !isNode;
    },

    watch: function(store) {
        if (this.envBrowser() && localStorage) {
            setupListener(store);
        }
    },

    readStateFromClientStorage: function(initialState) {
        var localState;
        initialState || (initialState={});
        if (this.envBrowser() && localStorage) {
            var controller = require('itsa-client-controller'),
                sessionTime;
            controller.init();
            sessionTime = controller.getProps().__sessiontime;
            if (!isBrowserWithHistory()) {
                // force a specific sessiontime, to prevent stateloses during navigation
                sessionTime = Math.max(sessionTime, MIN_SESSION_BROWSERS_NO_HISTORY);
            }
            localState = localStorage.getItem(KEY_ID, true);
            if (localState && localState.time && (localState.time>(Date.now()-(1000*sessionTime)))) {
                initialState.itsa_merge(localState.state, {force: 'deep'});
            }
            localStorage.setItem(KEY_ID, {time: Date.now(), state: initialState});
        }
        return initialState;
    }

};

module.exports = ReduxClientStorageMixin;
