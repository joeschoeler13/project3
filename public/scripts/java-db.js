// index.js

var REST_DATA = 'api/arcs_projects_db';
var KEY_ENTER = 13;
var defaultItems = [

];

function encodeUriAndQuotes(untrustedStr) {
    return encodeURI(String(untrustedStr)).replace(/'/g, '%27').replace(')', '%29');
}

function newproject() {
    console.log("Adding a project...");
}