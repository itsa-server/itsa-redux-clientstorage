'use strict';

var DATEPATTERN = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/, // datepattern will return date-type
      REVIVER = function(key, value) {
          return DATEPATTERN.test(value) ? new Date(value) : value;
      };

var Storage = {
    /**
     *
     *
     * @method getItem
     * @param key {String}
     * @param parseDate {boolean}
     * @since 0.0.1
     */
    getItem: function(key, parseDate) {
        var value = localStorage.getItem(key),
            obj;
        if (value) {
            try {
                obj = JSON.parse(value, parseDate ? REVIVER : null);
            }
            catch(err) {
                // error in item: remove it from store
                obj = {};
            }
        }
        return obj;
    },

    /**
     *
     *
     * @method setItem
     * @param key {String}
     * @param value {Any}
     * @since 0.0.1
     */
    setItem: function(key, value) {
        try {
            value = JSON.stringify(value);
            localStorage.setItem(key, value);
        }
        catch(err) {
            // error storing
            return false;
        }
        return true;
    },

    /**
     *
     *
     * @method removeItem
     * @param key {String}
     * @since 0.0.1
     */
    removeItem: function(key) {
        try {
            localStorage.removeItem(key);
        }
        catch(err) {
            // error removing
            return false;
        }
        return true;
    }
};

module.exports = Storage;