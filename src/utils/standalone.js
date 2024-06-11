/*
 *
 * This is used to build the bundle with browserify.
 *
 */
var CBRESearch = require('../app');

if (typeof global.window.define == 'function' && global.window.define.amd) {
    global.window.define('CBRESearch', function () { return CBRESearch; });
} else if (global.window) {
    global.window.CBRESearch = CBRESearch;
}