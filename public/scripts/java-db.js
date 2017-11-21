// js file for database page

var REST_DATA = 'api/arcs_projects_db';
var KEY_ENTER = 13;
var defaultItems = [

];

function encodeUriAndQuotes(untrustedStr) {
    return encodeURI(String(untrustedStr)).replace(/'/g, '%27').replace(')', '%29');
}

function newproject() {
    var data = {
        name: "project",
        value: document.getElementById('input').value
    };
    item++;
    alert("The project was added to the database.")

    xhrPost(REST_DATA, data, function(item) {
        
    }, function(err) {
        console.error(err);
    });
}